-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_offers_active_approved_expiry 
ON offers(is_active, status, expiry_date) 
WHERE is_active = true AND status = 'approved';

CREATE INDEX IF NOT EXISTS idx_offers_listing_type 
ON offers(listing_type) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_offers_category 
ON offers(category) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_offers_created_at 
ON offers(created_at DESC) 
WHERE is_active = true;

-- Add index for stores
CREATE INDEX IF NOT EXISTS idx_stores_active_name 
ON stores(is_active, name) 
WHERE is_active = true;