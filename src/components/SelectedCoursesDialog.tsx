import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Course, type CourseType } from "@/hooks/useCourses";

interface SelectedCoursesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCourses: Map<string, Map<CourseType, Course>>;
  onRemoveCourse: (courseCode: string, courseType: CourseType) => void;
}

export const SelectedCoursesDialog = ({ 
  open, 
  onOpenChange,
  selectedCourses, 
  onRemoveCourse
}: SelectedCoursesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] max-h-[95vh] w-[98vw] h-[95vh]">
        <DialogHeader>
          <DialogTitle>Selected Courses ({Array.from(selectedCourses.values()).reduce((sum, typeMap) => sum + typeMap.size, 0)})</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto space-y-4 pr-2">
          {Array.from(selectedCourses.keys()).map((courseCode) => {
            const typeMap = selectedCourses.get(courseCode)!;
            return (
              <div key={courseCode} className="space-y-2 border-b pb-4 last:border-b-0">
                <h3 className="font-semibold text-lg">{courseCode}</h3>
                <div className="space-y-2">
                  {Array.from(typeMap.entries()).map(([type, course]) => (
                    <div
                      key={`${courseCode}-${type}`}
                      className="flex items-start justify-between bg-secondary rounded-lg p-4 group hover:bg-secondary/80 transition-colors"
                    >
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-medium">
                            {type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Section {course.section}
                          </span>
                        </div>
                        
                        {course.title && (
                          <p className="text-sm font-medium">{course.title}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          {course.days && course.days.length > 0 && (
                            <span>📅 {course.days.join(", ")}</span>
                          )}
                          {course.time_start && course.time_end && (
                            <span>🕐 {course.time_start} - {course.time_end}</span>
                          )}
                          {course.status && (
                            <span className={
                              course.status === "Open" 
                                ? "text-green-600 font-medium" 
                                : course.status === "Full" 
                                ? "text-red-600 font-medium" 
                                : "text-yellow-600 font-medium"
                            }>
                              {course.status}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8"
                        onClick={() => onRemoveCourse(courseCode, type)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {selectedCourses.size === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No courses selected yet. Add courses from the sidebar to get started.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
