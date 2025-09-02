-- Performance optimization indexes to reduce query time and egress usage

-- Index for offers table - most commonly queried fields
CREATE INDEX IF NOT EXISTS idx_offers_performance ON offers (
  is_active, 
  status, 
  expiry_date, 
  created_at DESC, 
  listing_type
);

-- Index for offers by merchant_id for merchant queries
CREATE INDEX IF NOT EXISTS idx_offers_merchant_active ON offers (merchant_id, is_active, status);

-- Index for offers by category and location for filtering
CREATE INDEX IF NOT EXISTS idx_offers_category_location ON offers (category, city, district, is_active);

-- Index for saved_offers to speed up user lookups
CREATE INDEX IF NOT EXISTS idx_saved_offers_user ON saved_offers (user_id, saved_at DESC);

-- Index for redemptions to speed up user lookups
CREATE INDEX IF NOT EXISTS idx_redemptions_user ON redemptions (user_id, redeemed_at DESC);

-- Index for redemptions by offer for merchant queries
CREATE INDEX IF NOT EXISTS idx_redemptions_offer ON redemptions (offer_id, status, redeemed_at DESC);

-- Index for stores_public for faster filtering
CREATE INDEX IF NOT EXISTS idx_stores_public_active ON stores_public (is_active, name);
CREATE INDEX IF NOT EXISTS idx_stores_public_location ON stores_public (city, district, is_active);

-- Index for profiles for faster user lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role_active ON profiles (role, is_active);

-- Text search indexes for better performance on search queries
CREATE INDEX IF NOT EXISTS idx_offers_text_search ON offers USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(location, '')));
CREATE INDEX IF NOT EXISTS idx_stores_text_search ON stores_public USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));