/*
  # Coffee Tracker Schema

  1. New Tables
    - `coffee_beans`
      - `id` (uuid, primary key)
      - `roaster` (text)
      - `name` (text)
      - `tasting_notes` (text)
      - `process` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

    - `coffee_brews`
      - `id` (uuid, primary key)
      - `coffee_bean_id` (uuid, foreign key)
      - `water_coffee_ratio` (text)
      - `bloom_time` (integer)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

    - `brew_pours`
      - `id` (uuid, primary key)
      - `brew_id` (uuid, foreign key)
      - `amount` (integer)
      - `notes` (text)
      - `pour_order` (integer)

    - `brew_ratings`
      - `id` (uuid, primary key)
      - `brew_id` (uuid, foreign key)
      - `aroma` (integer)
      - `flavor` (integer)
      - `acidity` (integer)
      - `body` (integer)
      - `sweetness` (integer)
      - `bitterness` (integer)
      - `aftertaste` (integer)
      - `balance` (integer)
      - `overall_impression` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Coffee Beans Table
CREATE TABLE coffee_beans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roaster text NOT NULL,
  name text NOT NULL,
  tasting_notes text,
  process text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE coffee_beans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own coffee beans"
  ON coffee_beans
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Coffee Brews Table
CREATE TABLE coffee_brews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coffee_bean_id uuid REFERENCES coffee_beans(id) NOT NULL,
  water_coffee_ratio text NOT NULL,
  bloom_time integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE coffee_brews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own coffee brews"
  ON coffee_brews
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Brew Pours Table
CREATE TABLE brew_pours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brew_id uuid REFERENCES coffee_brews(id) NOT NULL,
  amount integer NOT NULL,
  notes text,
  pour_order integer NOT NULL
);

ALTER TABLE brew_pours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their brew pours through parent brew"
  ON brew_pours
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM coffee_brews
      WHERE coffee_brews.id = brew_pours.brew_id
      AND coffee_brews.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM coffee_brews
      WHERE coffee_brews.id = brew_pours.brew_id
      AND coffee_brews.user_id = auth.uid()
    )
  );

-- Brew Ratings Table
CREATE TABLE brew_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brew_id uuid REFERENCES coffee_brews(id) NOT NULL,
  aroma integer CHECK (aroma BETWEEN 1 AND 10),
  flavor integer CHECK (flavor BETWEEN 1 AND 10),
  acidity integer CHECK (acidity BETWEEN 1 AND 10),
  body integer CHECK (body BETWEEN 1 AND 10),
  sweetness integer CHECK (sweetness BETWEEN 1 AND 10),
  bitterness integer CHECK (bitterness BETWEEN 1 AND 10),
  aftertaste integer CHECK (aftertaste BETWEEN 1 AND 10),
  balance integer CHECK (balance BETWEEN 1 AND 10),
  overall_impression integer CHECK (overall_impression BETWEEN 1 AND 10)
);

ALTER TABLE brew_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their brew ratings through parent brew"
  ON brew_ratings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM coffee_brews
      WHERE coffee_brews.id = brew_ratings.brew_id
      AND coffee_brews.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM coffee_brews
      WHERE coffee_brews.id = brew_ratings.brew_id
      AND coffee_brews.user_id = auth.uid()
    )
  );