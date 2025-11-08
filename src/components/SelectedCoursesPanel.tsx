import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Course, type CourseType } from "@/hooks/useCourses";

interface SelectedCoursesPanelProps {
  selectedCourses: Map<string, Map<CourseType, Course>>;
  onRemoveCourse: (courseCode: string, courseType: CourseType) => void;
  onClearAll: () => void;
}

export const SelectedCoursesPanel = ({ 
  selectedCourses, 
  onRemoveCourse,
  onClearAll 
}: SelectedCoursesPanelProps) => {
  if (selectedCourses.size === 0) return null;

  return (
    <aside className="w-72 bg-card border-l border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm">Selected Courses</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {Array.from(selectedCourses.keys()).map((courseCode) => {
          const typeMap = selectedCourses.get(courseCode)!;
          return Array.from(typeMap.entries()).map(([type, course]) => (
            <div
              key={`${courseCode}-${type}`}
              className="flex items-center justify-between bg-secondary rounded-lg px-3 py-2.5 group hover:bg-secondary/80 transition-colors"
            >
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">
                    {courseCode}
                  </span>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {type}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  Section {course.section}
                </span>
              </div>
              <button
                onClick={() => onRemoveCourse(courseCode, type)}
                className="ml-2 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label={`Remove ${courseCode} ${type}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ));
        })}
      </div>

      <div className="p-4 border-t border-border">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onClearAll}
        >
          Clear All
        </Button>
      </div>
    </aside>
  );
};
