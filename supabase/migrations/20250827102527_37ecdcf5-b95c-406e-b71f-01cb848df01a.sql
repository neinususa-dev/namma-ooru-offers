-- Allow merchants to view customer profiles who have saved or redeemed their offers
CREATE POLICY "Merchants can view customer profiles who interacted with their offers" 
ON public.profiles 
FOR SELECT 
USING (
  -- Allow if the profile belongs to a user who saved merchant's offers
  EXISTS (
    SELECT 1 FROM public.saved_offers so
    JOIN public.offers o ON so.offer_id = o.id
    WHERE so.user_id = profiles.id 
    AND o.merchant_id = auth.uid()
  )
  OR
  -- Allow if the profile belongs to a user who redeemed merchant's offers  
  EXISTS (
    SELECT 1 FROM public.redemptions r
    JOIN public.offers o ON r.offer_id = o.id
    WHERE r.user_id = profiles.id 
    AND o.merchant_id = auth.uid()
  )
);