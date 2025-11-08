import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScheduledCourse {
  name: string;
  day: string;
  time: string;
  section?: string;
  status?: string;
  color?: string;
}

interface LoadScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadSchedule: (courses: ScheduledCourse[], scheduleName: string) => void;
  currentScheduleName?: string;
}

interface SavedSchedule {
  name: string;
  courseCount: number;
  createdAt: string;
}

export const LoadScheduleDialog = ({ 
  open, 
  onOpenChange, 
  onLoadSchedule,
  currentScheduleName 
}: LoadScheduleDialogProps) => {
  const [savedSchedules, setSavedSchedules] = useState<SavedSchedule[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSchedules = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_schedules')
        .select('schedule_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by schedule name and count courses
      const scheduleMap = new Map<string, { count: number; date: string }>();
      data?.forEach(item => {
        const existing = scheduleMap.get(item.schedule_name);
        if (existing) {
          existing.count++;
        } else {
          scheduleMap.set(item.schedule_name, { 
            count: 1, 
            date: item.created_at || '' 
          });
        }
      });

      const schedules: SavedSchedule[] = Array.from(scheduleMap.entries()).map(
        ([name, info]) => ({
          name,
          courseCount: info.count,
          createdAt: info.date,
        })
      );

      setSavedSchedules(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error("Failed to load schedules");
    }
  };

  useEffect(() => {
    if (open) {
      fetchSchedules();
    }
  }, [open]);

  const handleLoad = async (scheduleName: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_schedules')
        .select('*')
        .eq('user_id', user.id)
        .eq('schedule_name', scheduleName);

      if (error) throw error;

      const courses: ScheduledCourse[] = data.map(item => ({
        name: item.course_name,
        day: item.day,
        time: item.time,
        section: item.course_section || '',
        status: item.status || undefined,
        color: item.color || undefined,
      }));

      onLoadSchedule(courses, scheduleName);
      toast.success(`Loaded "${scheduleName}"`);
      onOpenChange(false);
    } catch (error) {
      console.error('Error loading schedule:', error);
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scheduleName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete "${scheduleName}"?`)) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_schedules')
        .delete()
        .eq('user_id', user.id)
        .eq('schedule_name', scheduleName);

      if (error) throw error;

      toast.success(`Deleted "${scheduleName}"`);
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error("Failed to delete schedule");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Load Schedule</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select a saved schedule to load, or delete schedules you no longer need.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-2">
            {savedSchedules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No saved schedules yet</p>
                <p className="text-sm mt-1">Create a schedule and save it to see it here</p>
              </div>
            ) : (
              savedSchedules.map((schedule) => (
                <div
                  key={schedule.name}
                  className={`flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer ${
                    currentScheduleName === schedule.name ? 'border-primary bg-accent' : ''
                  }`}
                  onClick={() => handleLoad(schedule.name)}
                >
                  <div className="flex-1">
                    <p className="font-medium">{schedule.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {schedule.courseCount} course{schedule.courseCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(schedule.name, e)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};