/*
  # Add notes columns to brew_ratings table

  1. Changes
    - Add notes columns for each rating attribute in the brew_ratings table:
      - aroma_notes
      - flavor_notes
      - acidity_notes
      - body_notes
      - sweetness_notes
      - bitterness_notes
      - aftertaste_notes
      - balance_notes
      - overall_notes
*/

DO $$ 
BEGIN
  -- Add notes columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brew_ratings' AND column_name = 'aroma_notes') THEN
    ALTER TABLE brew_ratings ADD COLUMN aroma_notes text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brew_ratings' AND column_name = 'flavor_notes') THEN
    ALTER TABLE brew_ratings ADD COLUMN flavor_notes text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brew_ratings' AND column_name = 'acidity_notes') THEN
    ALTER TABLE brew_ratings ADD COLUMN acidity_notes text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brew_ratings' AND column_name = 'body_notes') THEN
    ALTER TABLE brew_ratings ADD COLUMN body_notes text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brew_ratings' AND column_name = 'sweetness_notes') THEN
    ALTER TABLE brew_ratings ADD COLUMN sweetness_notes text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brew_ratings' AND column_name = 'bitterness_notes') THEN
    ALTER TABLE brew_ratings ADD COLUMN bitterness_notes text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brew_ratings' AND column_name = 'aftertaste_notes') THEN
    ALTER TABLE brew_ratings ADD COLUMN aftertaste_notes text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brew_ratings' AND column_name = 'balance_notes') THEN
    ALTER TABLE brew_ratings ADD COLUMN balance_notes text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brew_ratings' AND column_name = 'overall_notes') THEN
    ALTER TABLE brew_ratings ADD COLUMN overall_notes text;
  END IF;
END $$;