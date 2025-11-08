-- Add schedule_name column to user_schedules table
ALTER TABLE user_schedules ADD COLUMN schedule_name TEXT NOT NULL DEFAULT 'My Schedule';

-- Create index for faster queries by schedule_name
CREATE INDEX idx_user_schedules_name ON user_schedules(user_id, schedule_name);