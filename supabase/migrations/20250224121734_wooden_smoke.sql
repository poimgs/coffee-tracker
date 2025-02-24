/*
  # Make water_coffee_ratio optional

  1. Changes
    - Make water_coffee_ratio column optional in coffee_brews table
    - Make bloom_time column optional in coffee_brews table

  This migration removes the NOT NULL constraints from water_coffee_ratio and bloom_time
  columns in the coffee_brews table, making them optional fields.
*/

DO $$ 
BEGIN
  -- Remove NOT NULL constraint from water_coffee_ratio
  ALTER TABLE coffee_brews 
  ALTER COLUMN water_coffee_ratio DROP NOT NULL;

  -- Remove NOT NULL constraint from bloom_time
  ALTER TABLE coffee_brews 
  ALTER COLUMN bloom_time DROP NOT NULL;
END $$;