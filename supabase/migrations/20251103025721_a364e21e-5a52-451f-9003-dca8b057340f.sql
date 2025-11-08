-- Add has_seen_tutorial column to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS has_seen_tutorial BOOLEAN NOT NULL DEFAULT false;

-- Update the existing handle_new_user function to include tutorial tracking
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, has_seen_tutorial)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    false
  );
  RETURN NEW;
END;
$$;