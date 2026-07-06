export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  rating_avg: number;
  rating_count: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  parent_id?: string;
}

export interface CategoryAttribute {
  id: string;
  category_id: string;
  attribute_key: string;
  attribute_type: 'text' | 'number' | 'enum';
  enum_options?: string[];
}

export interface Listing {
  id: string;
  seller_id: string;
  category_id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  status: 'active' | 'pending' | 'sold' | 'removed';
  server_region?: string;
  created_at: string;
  updated_at: string;
  
  // Joins (Optional)
  seller?: User;
  category?: Category;
  attributes?: ListingAttribute[];
  images?: ListingImage[];
}

export interface ListingAttribute {
  id: string;
  listing_id: string;
  attribute_key: string;
  attribute_value: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  sort_order: number;
}

export interface Comment {
  id: string;
  listing_id: string;
  user_id: string;
  body: string;
  created_at: string;
  user?: User;
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  
  // Joins
  listing?: Listing;
  buyer?: User;
  seller?: User;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at?: string;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewed_id: string;
  listing_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer?: User;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  query?: string;
  filters: {
    category_id?: string;
    min_price?: number;
    max_price?: number;
    rarity?: Rarity[];
    server_region?: string;
    [key: string]: any;
  };
  created_at: string;
  last_notified_at?: string;
}
