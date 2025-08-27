-- Add plan-related columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN current_plan TEXT,
ADD COLUMN plan_amount NUMERIC,
ADD COLUMN plan_selected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN payment_method TEXT,
ADD COLUMN plan_status TEXT DEFAULT 'pending';

-- Create index for better performance
CREATE INDEX idx_profiles_plan_status ON public.profiles(plan_status);
CREATE INDEX idx_profiles_current_plan ON public.profiles(current_plan);