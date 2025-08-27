-- First, let's consolidate the offers and fix the saves/redemptions to point to the correct merchant offers
-- Delete the duplicate offers created by the customer account (wrong merchant_id)
DELETE FROM offers WHERE merchant_id = '6c013eb5-e385-441d-a33a-eb27492ab28f';

-- Update saved_offers to point to the correct merchant offers
UPDATE saved_offers 
SET offer_id = CASE 
  WHEN offer_id = 'fa4ab9f5-b70d-48b7-8a82-0d809c8a6212' THEN '81146f75-c622-45c4-8b39-e0c10b59abda'  -- Web Designing course
  WHEN offer_id = '7061ca9b-b466-4224-a780-bc90e7c02134' THEN 'a0b24fc0-1380-4d26-b610-f3328f84f167'  -- Software Testing Course
  ELSE offer_id
END
WHERE offer_id IN ('fa4ab9f5-b70d-48b7-8a82-0d809c8a6212', '7061ca9b-b466-4224-a780-bc90e7c02134');

-- Update redemptions to point to the correct merchant offers  
UPDATE redemptions 
SET offer_id = CASE 
  WHEN offer_id = 'b607bef7-55ce-4975-ab06-dca1f2492087' THEN 'e9bec598-3a34-44c0-b821-a6384356af3b'  -- Digital Marketing Course
  ELSE offer_id
END
WHERE offer_id = 'b607bef7-55ce-4975-ab06-dca1f2492087';