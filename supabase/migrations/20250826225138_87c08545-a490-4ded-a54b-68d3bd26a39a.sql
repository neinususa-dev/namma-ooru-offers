-- Add new columns to offers table for listing types and redemption modes
ALTER TABLE public.offers 
ADD COLUMN listing_type TEXT DEFAULT 'local_deals' CHECK (listing_type IN ('hot_offers', 'trending', 'local_deals')),
ADD COLUMN redemption_mode TEXT DEFAULT 'both' CHECK (redemption_mode IN ('online', 'store', 'both'));

-- Add premium status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_premium BOOLEAN DEFAULT false;

-- Update the existing update trigger for offers
CREATE TRIGGER update_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance on listing_type queries
CREATE INDEX idx_offers_listing_type ON public.offers(listing_type);
CREATE INDEX idx_offers_merchant_active ON public.offers(merchant_id, is_active);