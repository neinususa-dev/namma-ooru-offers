-- Add new columns to offers table for listing types and redemption modes
ALTER TABLE public.offers 
ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'local_deals' CHECK (listing_type IN ('hot_offers', 'trending', 'local_deals')),
ADD COLUMN IF NOT EXISTS redemption_mode TEXT DEFAULT 'both' CHECK (redemption_mode IN ('online', 'store', 'both'));

-- Add premium status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

-- Add indexes for better performance on listing_type queries
CREATE INDEX IF NOT EXISTS idx_offers_listing_type ON public.offers(listing_type);
CREATE INDEX IF NOT EXISTS idx_offers_merchant_active ON public.offers(merchant_id, is_active);