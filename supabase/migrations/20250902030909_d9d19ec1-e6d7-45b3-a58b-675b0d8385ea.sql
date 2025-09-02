-- Add missing performance indexes for saved_offers table to fix timeout issues

-- Index for saved_offers to speed up user lookups (this was missing from previous migration)
CREATE INDEX IF NOT EXISTS idx_saved_offers_user ON saved_offers (user_id, saved_at DESC);

-- Additional index for saved_offers with offer_id for better join performance
CREATE INDEX IF NOT EXISTS idx_saved_offers_offer_lookup ON saved_offers (offer_id, saved_at DESC);

-- Index for better performance on offers table joins with saved_offers
CREATE INDEX IF NOT EXISTS idx_offers_for_saved ON offers (id, is_active, status) WHERE is_active = true AND status = 'approved';