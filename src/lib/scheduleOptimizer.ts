import { Course, CourseType } from "@/hooks/useCourses";

export type SchedulePreference = "short-breaks" | "long-breaks" | "morning" | "afternoon";

interface CourseOption {
  course: Course;
  timeSlots: Array<{ day: string; time: string }>;
}

// Convert time string to minutes since midnight for comparison
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Find all possible combinations for a course (all sections of same type)
const getCourseSections = (courseCode: string, courseType: CourseType, allCourses: Course[]): Course[] => {
  return allCourses.filter(c => c.course_code === courseCode);
};

export const optimizeSchedule = (
  selectedCourses: Map<string, Map<CourseType, Course>>,
  allAvailableCourses: Course[],
  preference: SchedulePreference
): Course[] => {
  const result: Course[] = [];
  
  // For each selected course type, find the best section based on preference
  selectedCourses.forEach((typeMap, courseCode) => {
    typeMap.forEach((selectedCourse, courseType) => {
      // Get all available sections for this course type
      const allSections = allAvailableCourses.filter(
        c => c.course_code === courseCode && c.section === selectedCourse.section
      );
      
      if (allSections.length > 0) {
        result.push(allSections[0]);
      }
    });
  });

  return sortCoursesByPreference(result, preference);
};

const sortCoursesByPreference = (courses: Course[], preference: SchedulePreference): Course[] => {
  const sorted = [...courses];
  
  switch (preference) {
    case "short-breaks":
      // Sort by earliest time, keeping courses tight
      return sorted.sort((a, b) => {
        const timeA = timeToMinutes(a.time_start || "12:00");
        const timeB = timeToMinutes(b.time_start || "12:00");
        return timeA - timeB;
      });
      
    case "long-breaks":
      // Spread courses throughout the day
      return sorted.sort((a, b) => {
        // Alternate between morning and afternoon
        const timeA = timeToMinutes(a.time_start || "12:00");
        const timeB = timeToMinutes(b.time_start || "12:00");
        
        const morningCutoff = 12 * 60; // 12:00
        const isAMorning = timeA < morningCutoff;
        const isBMorning = timeB < morningCutoff;
        
        if (isAMorning && !isBMorning) return -1;
        if (!isAMorning && isBMorning) return 1;
        
        return timeA - timeB;
      });
      
    case "morning":
      // Prioritize earliest times, closest to 9am
      return sorted.sort((a, b) => {
        const timeA = Math.abs(timeToMinutes(a.time_start || "12:00") - (9 * 60));
        const timeB = Math.abs(timeToMinutes(b.time_start || "12:00") - (9 * 60));
        return timeA - timeB;
      });
      
    case "afternoon":
      // Prioritize latest times, closest to 6pm
      return sorted.sort((a, b) => {
        const timeA = Math.abs(timeToMinutes(a.time_start || "12:00") - (18 * 60));
        const timeB = Math.abs(timeToMinutes(b.time_start || "12:00") - (18 * 60));
        return timeA - timeB;
      });
      
    default:
      return sorted;
  }
};

// Check if a time slot conflicts with lunch break (12:00-13:00)
export const conflictsWithLunch = (time: string): boolean => {
  const minutes = timeToMinutes(time);
  const lunchStart = 12 * 60; // 12:00
  const lunchEnd = 13 * 60;   // 13:00
  return minutes >= lunchStart && minutes < lunchEnd;
};
