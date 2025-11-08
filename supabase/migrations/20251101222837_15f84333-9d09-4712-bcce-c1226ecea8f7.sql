-- Create table for user schedules
CREATE TABLE public.user_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  course_section TEXT,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_schedules ENABLE ROW LEVEL SECURITY;

-- Policies for user_schedules
CREATE POLICY "Users can view their own schedules"
  ON public.user_schedules
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own schedules"
  ON public.user_schedules
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules"
  ON public.user_schedules
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedules"
  ON public.user_schedules
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_schedules_updated_at
  BEFORE UPDATE ON public.user_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_courses_updated_at();