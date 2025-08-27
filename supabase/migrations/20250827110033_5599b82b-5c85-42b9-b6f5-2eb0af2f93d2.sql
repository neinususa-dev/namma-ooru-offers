-- Create policy for merchants to update redemptions for their offers
CREATE POLICY "Merchants can update redemptions for their offers" 
ON public.redemptions 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM offers o 
    WHERE o.id = redemptions.offer_id 
    AND o.merchant_id = auth.uid()
  )
);