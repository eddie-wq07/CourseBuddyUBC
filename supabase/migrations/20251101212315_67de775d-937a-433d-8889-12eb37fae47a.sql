-- Add INSERT policy for edge functions to store course data
-- Edge functions use service role which bypasses RLS, but we'll add a policy for INSERT anyway
CREATE POLICY "Service role can insert courses"
  ON public.courses
  FOR INSERT
  WITH CHECK (true);

-- Add UPDATE policy for edge functions to update course data
CREATE POLICY "Service role can update courses"
  ON public.courses
  FOR UPDATE
  USING (true);