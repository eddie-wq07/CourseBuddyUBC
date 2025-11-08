import { Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduledCourse } from "@/pages/Index";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Course, CourseType } from "@/hooks/useCourses";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

interface ScheduleGridProps {
  scheduledCourses: ScheduledCourse[];
  draggingCourse: ScheduledCourse | null;
  availableAlternatives: Course[];
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedCourses?: Map<string, Map<CourseType, Course>>;
}

const DraggableCourseBlock = ({ course, color }: { course: ScheduledCourse; color: string }) => {
  const id = `${course.name}-${course.section}-${course.day}-${course.time}`;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        color,
        "rounded-lg h-full flex flex-col items-center justify-center px-2 py-2 text-center font-medium cursor-grab active:cursor-grabbing",
        "transition-all duration-150 ease-out",
        isDragging && "opacity-0"
      )}
    >
      <div className="text-sm leading-tight">{course.name}</div>
      <div className="text-xs leading-tight mt-0.5">{course.section}</div>
      <div className="text-xs leading-tight mt-0.5 opacity-80">{course.status}</div>
    </div>
  );
};

const DroppableTimeSlot = ({ 
  day, 
  time, 
  course,
  color,
  isValidDropZone,
  isPreview
}: { 
  day: string; 
  time: string; 
  course?: ScheduledCourse;
  color?: string;
  isValidDropZone: boolean;
  isPreview?: boolean;
}) => {
  const id = `drop-${day}-${time}`;
  const { setNodeRef, isOver } = useDroppable({ 
    id,
    disabled: !isValidDropZone 
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-b border-r border-border last:border-r-0 p-1 min-h-[60px] transition-all duration-200",
        !course && "hover:bg-muted/30",
        isValidDropZone && !course && "ring-2 ring-inset ring-primary/50 bg-primary/5",
        isOver && isValidDropZone && "ring-4 ring-inset ring-primary bg-primary/20 shadow-lg shadow-primary/20"
      )}
    >
      {course && color && (
        <div className={cn(isPreview && "opacity-60 border-2 border-dashed border-current")}>
          <DraggableCourseBlock course={course} color={color} />
        </div>
      )}
    </div>
  );
};

export const ScheduleGrid = ({ 
  scheduledCourses, 
  draggingCourse, 
  availableAlternatives,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  selectedCourses
}: ScheduleGridProps) => {
  const getCourseAtSlot = (day: string, time: string) => {
    // First check scheduled courses
    const scheduled = scheduledCourses.find(
      (course) => course.day === day && course.time === time
    );
    if (scheduled) return { course: scheduled, isPreview: false };

    // No scheduled course in this slot
    return null;
  };

  const isValidDropZone = (day: string, time: string) => {
    if (!draggingCourse) return false;
    
    // Check if any alternative course matches this time slot
    return availableAlternatives.some(alt => 
      alt.days?.includes(day.toUpperCase()) && alt.time_start === time
    );
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case "purple":
        return "bg-purple-200 text-purple-700 hover:bg-purple-300";
      case "green":
        return "bg-green-200 text-green-700 hover:bg-green-300";
      case "tan":
        return "bg-amber-100 text-amber-700 hover:bg-amber-200";
      case "orange":
        return "bg-orange-200 text-orange-600 hover:bg-orange-300";
      case "blue":
        return "bg-blue-200 text-blue-700 hover:bg-blue-300";
      default:
        return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
  };
  return (
    <div className="flex-1 bg-background p-6">
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 h-full flex flex-col">
        {/* Controls */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-[80px_repeat(5,1fr)] min-w-[900px]">
            {/* Header */}
            <div className="bg-muted border-b border-r border-border"></div>
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="bg-muted border-b border-r border-border px-4 py-3 text-center text-sm font-medium text-foreground last:border-r-0"
              >
                {day}
              </div>
            ))}

            {/* Time slots */}
            {TIME_SLOTS.map((time) => (
              <>
                <div
                  key={`time-${time}`}
                  className="border-b border-r border-border px-3 py-4 text-sm text-muted-foreground text-right bg-muted/30"
                >
                  {time}
                </div>
                {WEEKDAYS.map((day) => {
                  const result = getCourseAtSlot(day, time);
                  const isValid = isValidDropZone(day, time);
                  return (
                    <DroppableTimeSlot
                      key={`${day}-${time}`}
                      day={day}
                      time={time}
                      course={result?.course}
                      color={result?.course ? getColorClasses(result.course.color) : undefined}
                      isValidDropZone={isValid}
                      isPreview={result?.isPreview}
                    />
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
