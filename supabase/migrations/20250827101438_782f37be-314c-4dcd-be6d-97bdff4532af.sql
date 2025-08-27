-- Recreate the saved offers and redemptions with correct merchant offer IDs
-- Insert saved offers for the customer who saved offers from Neinus Technologies
INSERT INTO saved_offers (user_id, offer_id, saved_at) VALUES
('6c013eb5-e385-441d-a33a-eb27492ab28f', '81146f75-c622-45c4-8b39-e0c10b59abda', '2025-08-27 10:01:56.21655+00:00'),  -- Web Designing course
('6c013eb5-e385-441d-a33a-eb27492ab28f', 'a0b24fc0-1380-4d26-b610-f3328f84f167', '2025-08-27 10:02:13.883293+00:00'); -- Software Testing Course

-- Insert redemption for the customer who redeemed offer from Neinus Technologies  
INSERT INTO redemptions (user_id, offer_id, redeemed_at) VALUES
('6c013eb5-e385-441d-a33a-eb27492ab28f', 'e9bec598-3a34-44c0-b821-a6384356af3b', '2025-08-27 10:02:28.759272+00:00'); -- Digital Marketing Course