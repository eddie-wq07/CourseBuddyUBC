import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ScheduledCourse {
  name: string;
  day: string;
  time: string;
  section?: string;
  status?: string;
  color?: string;
}

interface SaveScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduledCourses: ScheduledCourse[];
  currentScheduleName?: string;
}

export const SaveScheduleDialog = ({ 
  open, 
  onOpenChange, 
  scheduledCourses,
  currentScheduleName 
}: SaveScheduleDialogProps) => {
  const [scheduleName, setScheduleName] = useState(currentScheduleName || "");

  const handleSave = async () => {
    if (!scheduleName.trim()) {
      toast.error("Please enter a schedule name");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to save schedules");
        return;
      }

      // Delete existing schedule with this name
      await supabase
        .from('user_schedules')
        .delete()
        .eq('user_id', user.id)
        .eq('schedule_name', scheduleName.trim());

      // Save new schedule
      const scheduleData = scheduledCourses.map(course => ({
        user_id: user.id,
        schedule_name: scheduleName.trim(),
        course_name: course.name,
        course_section: course.section,
        day: course.day,
        time: course.time,
        status: course.status,
        color: course.color,
      }));

      const { error } = await supabase
        .from('user_schedules')
        .insert(scheduleData);

      if (error) throw error;

      toast.success(`Schedule "${scheduleName}" saved successfully!`);
      onOpenChange(false);
      setScheduleName("");
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error("Failed to save schedule");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Save Your Schedule</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Save and name your schedule for future access.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="schedule-name" className="text-sm font-medium">
              Schedule Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="schedule-name"
              placeholder="e.g., Winter 2025 Plan A"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false);
              setScheduleName("");
            }}
            className="text-primary"
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!scheduleName.trim()}
          >
            SAVE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};