-- Game item marketplace — Postgres schema
-- Uses UUID PKs (requires pgcrypto or uuid-ossp).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT UNIQUE NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT,                 -- nullable if using OAuth-only (e.g. Discord login)
  avatar_url    TEXT,
  rating_avg    NUMERIC(3,2) DEFAULT 0,
  rating_count  INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE categories (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL
);

-- Defines which attributes are valid/expected for a category (e.g. weapons -> damage, level_req)
CREATE TABLE category_attributes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id    UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  attribute_key  TEXT NOT NULL,        -- e.g. 'rarity', 'level_req', 'damage'
  attribute_type TEXT NOT NULL CHECK (attribute_type IN ('text','number','enum')),
  enum_options   TEXT[]                -- populated only when attribute_type = 'enum'
);

CREATE TABLE listings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id   UUID NOT NULL REFERENCES categories(id),
  title         TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(12,2) NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'gold',   -- swap for real currency codes if applicable
  quantity      INTEGER NOT NULL DEFAULT 1,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','sold','removed')),
  server_region TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_seller ON listings(seller_id);

-- Key/value attributes per listing (rarity=epic, level_req=60, ...)
CREATE TABLE listing_attributes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  attribute_key   TEXT NOT NULL,
  attribute_value TEXT NOT NULL
);
CREATE INDEX idx_listing_attributes_listing ON listing_attributes(listing_id);
CREATE INDEX idx_listing_attributes_kv ON listing_attributes(attribute_key, attribute_value);

CREATE TABLE listing_images (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  buyer_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (listing_id, buyer_id, seller_id)
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at         TIMESTAMPTZ
);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

CREATE TABLE comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_comments_listing ON comments(listing_id);

CREATE TABLE reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id   UUID REFERENCES listings(id) ON DELETE SET NULL,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_reviews_reviewed ON reviews(reviewed_id);

CREATE TABLE reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('listing','user')),
  target_id   UUID NOT NULL,
  reason      TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','reviewed','dismissed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Saved searches for alerts (Phase 2/4 feature)
CREATE TABLE saved_searches (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query        TEXT,
  filters      JSONB NOT NULL DEFAULT '{}',  -- {category_id, min_price, max_price, rarity, server_region, ...}
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_notified_at TIMESTAMPTZ
);

-- Keep updated_at fresh on listings
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_listings_updated_at
BEFORE UPDATE ON listings
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
