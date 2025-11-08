import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Loader2, Search } from "lucide-react";
import { useCourses, type Course, getCourseType, getCoursesByType, type CourseType } from "@/hooks/useCourses";
import { toast } from "sonner";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface SidebarProps {
  onGenerateSchedule: (courses: Course[], coursesMap: Map<string, Map<CourseType, Course>>) => void;
  onRemoveCourseFromSchedule?: (courseCode: string, courseType: CourseType) => void;
  onClearSchedule?: () => void;
  term: string;
  setTerm: (term: string) => void;
}

export const Sidebar = ({ onGenerateSchedule, onRemoveCourseFromSchedule, onClearSchedule, term, setTerm }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  // Map of courseCode -> CourseType -> Course
  const [selectedCourses, setSelectedCourses] = useState<Map<string, Map<CourseType, Course>>>(new Map());
  const { data: availableCourses, isLoading, refetch } = useCourses(term);
  const [commSynced, setCommSynced] = useState(false);

  useEffect(() => {
    if (commSynced) return;
    if (!isLoading && availableCourses) {
      const hasCOMM = availableCourses.some((c: Course) => c.course_code?.startsWith('COMM '));
      if (!hasCOMM) {
        supabase.functions
          .invoke('fetch-courses', { body: { term, refresh: true, subjects: ['COMM'] } })
          .then(() => refetch())
          .finally(() => setCommSynced(true));
      }
    }
  }, [term, availableCourses, isLoading, commSynced, refetch]);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!availableCourses || !searchQuery) return [];
    
    const query = searchQuery.toLowerCase().trim();
    return availableCourses.filter((course: Course) => 
      course.course_code.toLowerCase().includes(query) ||
      course.title?.toLowerCase().includes(query) ||
      course.section.toLowerCase().includes(query)
    );
  }, [availableCourses, searchQuery]);

  const handleSelectCourse = (course: Course) => {
    const courseType = getCourseType(course.section);
    const courseCode = course.course_code;
    
    setSelectedCourses(prev => {
      const newMap = new Map(prev);
      
      // Get or create the course map
      if (!newMap.has(courseCode)) {
        newMap.set(courseCode, new Map());
      }
      
      const typeMap = newMap.get(courseCode)!;
      
      // Check if this type already exists
      if (typeMap.has(courseType)) {
        const existing = typeMap.get(courseType)!;
        toast.error(`${courseCode} already has a ${courseType}: Section ${existing.section}`);
        return prev;
      }
      
      // Add the new course
      typeMap.set(courseType, course);
      toast.success(`Added ${courseCode} ${courseType} (Section ${course.section})`);
      
      return newMap;
    });
    
    setSearchQuery("");
    setOpen(false);
  };

  const handleRemoveCourse = (courseCode: string, courseType: CourseType) => {
    setSelectedCourses(prev => {
      const newMap = new Map(prev);
      const typeMap = newMap.get(courseCode);
      
      if (typeMap) {
        typeMap.delete(courseType);
        if (typeMap.size === 0) {
          newMap.delete(courseCode);
        }
      }
      
      return newMap;
    });
    
    // Also remove from schedule if callback provided
    if (onRemoveCourseFromSchedule) {
      onRemoveCourseFromSchedule(courseCode, courseType);
    }
  };

  const handleGenerateClick = () => {
    if (selectedCourses.size === 0) {
      toast.error("Please add at least one course");
      return;
    }
    
    // Convert Map to array of courses
    const allCourses: Course[] = [];
    selectedCourses.forEach(typeMap => {
      typeMap.forEach(course => {
        allCourses.push(course);
      });
    });
    
    onGenerateSchedule(allCourses, selectedCourses);
  };

  // Get flat array of selected courses for display
  const selectedCoursesArray = useMemo(() => {
    const courses: Array<{ courseCode: string; type: CourseType; course: Course }> = [];
    selectedCourses.forEach((typeMap, courseCode) => {
      typeMap.forEach((course, type) => {
        courses.push({ courseCode, type, course });
      });
    });
    return courses.sort((a, b) => {
      if (a.courseCode !== b.courseCode) return a.courseCode.localeCompare(b.courseCode);
      const typeOrder: CourseType[] = ['Lecture', 'Lab', 'Tutorial', 'Discussion'];
      return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
    });
  }, [selectedCourses]);

  return (
    <aside className="w-64 bg-card border-r border-border p-4 flex flex-col h-full gap-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Campus</label>
          <Select defaultValue="vancouver">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select campus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vancouver">Vancouver</SelectItem>
              <SelectItem value="okanagan">Okanagan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Term</label>
          <Select value={term} onValueChange={setTerm}>
            <SelectTrigger className="w-full ring-2 ring-accent">
              <SelectValue placeholder="Term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025W">2025 Winter</SelectItem>
              <SelectItem value="2025S">2025 Spring</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading courses...</span>
          </div>
        )}

        {availableCourses && availableCourses.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {availableCourses.length} courses available
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Search Courses</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-start text-left font-normal"
                disabled={isLoading || !availableCourses || availableCourses.length === 0}
              >
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <span className="truncate">
                  {isLoading ? "Loading..." : "Search and select courses..."}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Type course code or name..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>
                    {searchQuery ? "No courses found." : "Start typing to search..."}
                  </CommandEmpty>
                  {filteredCourses.length > 0 && (
                    <CommandGroup>
                      {filteredCourses.slice(0, 10).map((course: Course) => {
                        const courseType = getCourseType(course.section);
                        return (
                          <CommandItem
                            key={`${course.course_code}-${course.section}`}
                            value={`${course.course_code} ${course.title ?? ""} ${course.section}`}
                            onSelect={() => handleSelectCourse(course)}
                            className="group flex flex-col items-start gap-1 py-3"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {course.course_code} - Section {course.section}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {courseType}
                              </Badge>
                            </div>
                            {course.title && (
                              <div className="text-xs text-muted-foreground group-hover:text-white">
                                {course.title}
                              </div>
                            )}
                            <div className="flex gap-2 text-xs">
                              {course.days && course.days.length > 0 && (
                                <span className="text-muted-foreground group-hover:text-white">
                                  {course.days.join(", ")}
                                </span>
                              )}
                              {course.time_start && (
                                <span className="text-muted-foreground group-hover:text-white">
                                  {course.time_start}
                                </span>
                              )}
                              {course.status && (
                                <span className={`group-hover:text-white ${
                                  course.status === "Open" 
                                    ? "text-green-600" 
                                    : course.status === "Full" 
                                    ? "text-red-600" 
                                    : "text-yellow-600"
                                }`}>
                                  {course.status}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Selected Courses List */}
      {selectedCoursesArray.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-3 max-h-[calc(100vh-500px)]">
          <label className="text-xs font-medium text-muted-foreground">
            Selected Courses ({selectedCoursesArray.length})
          </label>
          <div className="space-y-3">
            {Array.from(selectedCourses.keys()).map((courseCode) => {
              const typeMap = selectedCourses.get(courseCode)!;
              return (
                <div key={courseCode} className="space-y-1">
                  <div className="font-medium text-sm">{courseCode}</div>
                  {Array.from(typeMap.entries()).map(([type, course]) => (
                    <div
                      key={`${courseCode}-${type}`}
                      className="flex flex-col gap-1 bg-secondary rounded px-3 py-2 text-sm ml-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {type}
                          </Badge>
                          <span className="text-xs">Section {course.section}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveCourse(courseCode, type)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        {course.days && course.days.length > 0 && (
                          <div>{course.days.join(", ")} at {course.time_start}</div>
                        )}
                        {course.status && (
                          <div className={
                            course.status === "Open" 
                              ? "text-green-600" 
                              : course.status === "Full" 
                              ? "text-red-600" 
                              : "text-yellow-600"
                          }>
                            {course.status}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2 flex-shrink-0">
        <Button 
          className="w-full" 
          disabled={selectedCourses.size === 0}
          onClick={handleGenerateClick}
        >
          GENERATE SCHEDULE
        </Button>
        
        <Button 
          variant="outline"
          className="w-full" 
          onClick={() => {
            setSelectedCourses(new Map());
            onClearSchedule?.();
          }}
        >
          CLEAR SCHEDULE
        </Button>
        
      </div>
    </aside>
  );
};
