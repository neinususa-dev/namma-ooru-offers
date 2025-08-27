-- Add policies to allow merchants to see saved_offers and redemptions for their own offers

-- Allow merchants to view saved_offers for their own offers
CREATE POLICY "Merchants can view saved offers for their offers" 
ON public.saved_offers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.offers o 
    WHERE o.id = saved_offers.offer_id 
    AND o.merchant_id = auth.uid()
  )
);

-- Allow merchants to view redemptions for their own offers  
CREATE POLICY "Merchants can view redemptions for their offers" 
ON public.redemptions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.offers o 
    WHERE o.id = redemptions.offer_id 
    AND o.merchant_id = auth.uid()
  )
);