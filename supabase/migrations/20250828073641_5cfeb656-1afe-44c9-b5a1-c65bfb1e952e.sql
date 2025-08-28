-- Add status field to offers table with approval workflow
ALTER TABLE public.offers 
ADD COLUMN status TEXT NOT NULL DEFAULT 'in_review';

-- Update existing offers to be approved (to maintain current functionality)
UPDATE public.offers 
SET status = 'approved' 
WHERE is_active = true;

-- Add check constraint for valid status values
ALTER TABLE public.offers 
ADD CONSTRAINT offers_status_check 
CHECK (status IN ('applied', 'in_review', 'approved', 'rejected'));

-- Update RLS policy to only show approved offers to public
DROP POLICY IF EXISTS "Everyone can view active offers" ON public.offers;

CREATE POLICY "Everyone can view approved active offers" 
ON public.offers 
FOR SELECT 
USING (is_active = true AND status = 'approved');

-- Super admin can see all offers regardless of status
CREATE POLICY "Super admins can view all offers regardless of status" 
ON public.offers 
FOR SELECT 
USING (get_current_user_role() = 'super_admin');

-- Update merchant policy to see their own offers regardless of status
DROP POLICY IF EXISTS "Merchants can manage their own offers" ON public.offers;

CREATE POLICY "Merchants can manage their own offers" 
ON public.offers 
FOR ALL 
USING (auth.uid() = merchant_id);

-- Super admin can update offer status
CREATE POLICY "Super admins can update offer status" 
ON public.offers 
FOR UPDATE 
USING (get_current_user_role() = 'super_admin');