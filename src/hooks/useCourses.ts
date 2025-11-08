import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  course_code: string;
  section: string;
  title: string | null;
  term: string;
  campus: string | null;
  status: string | null;
  seats_available: number | null;
  seats_total: number | null;
  days: string[] | null;
  time_start: string | null;
  time_end: string | null;
  instructor: string | null;
  location: string | null;
}

export type CourseType = 'Lecture' | 'Lab' | 'Discussion' | 'Tutorial';

export const getCourseType = (section: string): CourseType => {
  const sectionUpper = section.toUpperCase();
  if (sectionUpper.startsWith('L')) return 'Lab';
  if (sectionUpper.startsWith('T')) return 'Tutorial';
  if (sectionUpper.startsWith('D')) return 'Discussion';
  return 'Lecture';
};

export const getCoursesByType = (courses: Course[], courseCode: string) => {
  const filtered = courses.filter(c => c.course_code === courseCode);
  const grouped: Record<CourseType, Course[]> = {
    'Lecture': [],
    'Lab': [],
    'Discussion': [],
    'Tutorial': []
  };
  
  filtered.forEach(course => {
    const type = getCourseType(course.section);
    grouped[type].push(course);
  });
  
  return grouped;
};

export const useCourses = (term: string = '2025W') => {
  return useQuery({
    queryKey: ['courses', term],
    queryFn: async () => {
      console.log('Fetching all courses for', term);
      
      const { data, error } = await supabase.functions.invoke('fetch-courses', {
        body: { term, refresh: true },
      });

      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }

      console.log('Received courses:', data);
      return data.courses as Course[];
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });
};
