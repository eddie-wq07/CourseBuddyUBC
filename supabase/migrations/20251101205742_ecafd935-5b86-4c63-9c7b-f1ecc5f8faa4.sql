-- Fix function search path security warning
DROP TRIGGER IF EXISTS update_courses_updated_at_trigger ON public.courses;
DROP FUNCTION IF EXISTS update_courses_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION update_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;

-- Recreate the trigger
CREATE TRIGGER update_courses_updated_at_trigger
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION update_courses_updated_at();