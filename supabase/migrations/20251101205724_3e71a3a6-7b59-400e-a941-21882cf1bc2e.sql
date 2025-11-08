-- Create courses table to cache UBC course data
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code TEXT NOT NULL,
  section TEXT NOT NULL,
  title TEXT,
  term TEXT NOT NULL,
  campus TEXT DEFAULT 'Vancouver',
  status TEXT, -- 'Open', 'Restricted', 'Full'
  seats_available INTEGER,
  seats_total INTEGER,
  days TEXT[], -- Array of days like ['MON', 'WED', 'FRI']
  time_start TEXT, -- Format: '09:00'
  time_end TEXT, -- Format: '10:00'
  instructor TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_code, section, term)
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Public read access for course data (it's public information)
CREATE POLICY "Anyone can view courses"
  ON public.courses
  FOR SELECT
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_courses_term ON public.courses(term);
CREATE INDEX idx_courses_code ON public.courses(course_code);
CREATE INDEX idx_courses_status ON public.courses(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_courses_updated_at_trigger
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION update_courses_updated_at();