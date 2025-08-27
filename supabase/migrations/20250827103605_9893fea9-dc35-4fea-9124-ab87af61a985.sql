-- Add status column to redemptions table with default 'pending'
ALTER TABLE public.redemptions 
ADD COLUMN status text NOT NULL DEFAULT 'pending';

-- Add check constraint for valid status values
ALTER TABLE public.redemptions 
ADD CONSTRAINT redemptions_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update existing redemptions to 'approved' status
UPDATE public.redemptions 
SET status = 'approved' 
WHERE status = 'pending';