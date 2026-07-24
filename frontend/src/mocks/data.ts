import { User, Category, CategoryAttribute, Listing, ListingAttribute, ListingImage, Comment, Review, Conversation } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'ShadowBladeX',
    email: 'shadowblade@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop&crop=face',
    rating_avg: 4.85,
    rating_count: 42,
    created_at: '2025-01-12T08:00:00Z',
  },
  {
    id: 'user-2',
    username: 'GoldGoblin_Store',
    email: 'goblin@goldgoblin.com',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    rating_avg: 4.95,
    rating_count: 312,
    created_at: '2024-05-20T12:00:00Z',
  },
  {
    id: 'user-3',
    username: 'LoreWeaver',
    email: 'weaver@lore.net',
    avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face',
    rating_avg: 4.20,
    rating_count: 15,
    created_at: '2025-03-01T14:30:00Z',
  },
  {
    id: 'user-4',
    username: 'Valeria_D3',
    email: 'valeria@diablo.com',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    rating_avg: 4.90,
    rating_count: 88,
    created_at: '2024-11-15T09:15:00Z',
  },
  {
    id: 'user-current',
    username: 'LootHunter99',
    email: 'player@gamer.com',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating_avg: 5.00,
    rating_count: 3,
    created_at: '2026-01-01T00:00:00Z',
  }
];

// Mock Categories
export const mockCategories: Category[] = [
  { id: 'cat-weapons', name: 'Weapons' },
  { id: 'cat-armor', name: 'Armor' },
  { id: 'cat-currency', name: 'Currency' },
  { id: 'cat-gems', name: 'Runes & Gems' },
  { id: 'cat-accounts', name: 'Accounts' },
  { id: 'cat-services', name: 'Services & Boosting' }
];

// Mock Category Attributes
export const mockCategoryAttributes: CategoryAttribute[] = [
  // Weapons attributes
  { id: 'attr-w-1', category_id: 'cat-weapons', attribute_key: 'rarity', attribute_type: 'enum', enum_options: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'] },
  { id: 'attr-w-2', category_id: 'cat-weapons', attribute_key: 'level_req', attribute_type: 'number' },
  { id: 'attr-w-3', category_id: 'cat-weapons', attribute_key: 'damage', attribute_type: 'number' },
  { id: 'attr-w-4', category_id: 'cat-weapons', attribute_key: 'item_type', attribute_type: 'enum', enum_options: ['One-Handed Sword', 'Two-Handed Mace', 'Staff', 'Bow', 'Dagger', 'Shield'] },
  
  // Armor attributes
  { id: 'attr-a-1', category_id: 'cat-armor', attribute_key: 'rarity', attribute_type: 'enum', enum_options: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'] },
  { id: 'attr-a-2', category_id: 'cat-armor', attribute_key: 'level_req', attribute_type: 'number' },
  { id: 'attr-a-3', category_id: 'cat-armor', attribute_key: 'defense', attribute_type: 'number' },
  { id: 'attr-a-4', category_id: 'cat-armor', attribute_key: 'slot', attribute_type: 'enum', enum_options: ['Helmet', 'Chestplate', 'Gloves', 'Boots', 'Ring', 'Amulet'] },
  
  // Currency attributes
  { id: 'attr-c-1', category_id: 'cat-currency', attribute_key: 'delivery_speed', attribute_type: 'enum', enum_options: ['Instant (<15m)', 'Fast (<2h)', 'Standard (<24h)'] },
  { id: 'attr-c-2', category_id: 'cat-currency', attribute_key: 'minimum_order', attribute_type: 'number' },

  // Gems & Runes
  { id: 'attr-g-1', category_id: 'cat-gems', attribute_key: 'rarity', attribute_type: 'enum', enum_options: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'] },
  { id: 'attr-g-2', category_id: 'cat-gems', attribute_key: 'level_req', attribute_type: 'number' },
  { id: 'attr-g-3', category_id: 'cat-gems', attribute_key: 'gem_color', attribute_type: 'enum', enum_options: ['Red', 'Blue', 'Green', 'Yellow', 'White', 'Prismatic'] },

  // Accounts
  { id: 'attr-ac-1', category_id: 'cat-accounts', attribute_key: 'character_level', attribute_type: 'number' },
  { id: 'attr-ac-2', category_id: 'cat-accounts', attribute_key: 'class', attribute_type: 'enum', enum_options: ['Warrior', 'Mage', 'Rogue', 'Paladin', 'Necromancer', 'Demon Hunter'] },
  { id: 'attr-ac-3', category_id: 'cat-accounts', attribute_key: 'has_rare_mounts', attribute_type: 'enum', enum_options: ['Yes', 'No'] },

  // Services
  { id: 'attr-s-1', category_id: 'cat-services', attribute_key: 'service_type', attribute_type: 'enum', enum_options: ['Raid Carry', 'Dungeon Boost', 'PvP Coaching', 'Leveling 1-60'] }
];

// Mock Listings with Attributes and Images
export const mockListings: Listing[] = [
  {
    id: 'list-1',
    seller_id: 'user-1',
    category_id: 'cat-weapons',
    title: 'Thunderfury, Blessed Blade of the Windseeker',
    description: 'Ultra rare legendary one-handed sword. Fully repaired. Deals massive chain-lightning nature damage on hit and reduces target attack speed by 20%. Perfect for main tanking or flex DPS.',
    price: 85000,
    currency: 'Gold',
    quantity: 1,
    status: 'active',
    server_region: 'US-East (PVP)',
    created_at: '2026-07-02T10:00:00Z',
    updated_at: '2026-07-02T10:00:00Z',
    seller: mockUsers[0],
    category: mockCategories[0],
    images: [
      { id: 'img-1-1', listing_id: 'list-1', url: 'https://images.unsplash.com/photo-1580234810907-b40315b76418?w=600&q=80', sort_order: 0 },
      { id: 'img-1-2', listing_id: 'list-1', url: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&q=80', sort_order: 1 }
    ],
    attributes: [
      { id: 'l-attr-1-1', listing_id: 'list-1', attribute_key: 'rarity', attribute_value: 'Legendary' },
      { id: 'l-attr-1-2', listing_id: 'list-1', attribute_key: 'level_req', attribute_value: '60' },
      { id: 'l-attr-1-3', listing_id: 'list-1', attribute_key: 'damage', attribute_value: '54' },
      { id: 'l-attr-1-4', listing_id: 'list-1', attribute_key: 'item_type', attribute_value: 'One-Handed Sword' }
    ]
  },
  {
    id: 'list-2',
    seller_id: 'user-2',
    category_id: 'cat-currency',
    title: '500,000 Gold [EU-Kazzak Horde]',
    description: 'Safe hand-farmed gold. Delivery is via guild bank deposit or face-to-face trade in Orgrimmar. I have 100% positive feedback, and I trade within 15 minutes of payment confirmation.',
    price: 45.50,
    currency: 'USD',
    quantity: 5,
    status: 'active',
    server_region: 'EU-Kazzak',
    created_at: '2026-07-03T11:45:00Z',
    updated_at: '2026-07-03T11:45:00Z',
    seller: mockUsers[1],
    category: mockCategories[2],
    images: [
      { id: 'img-2-1', listing_id: 'list-2', url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&q=80', sort_order: 0 }
    ],
    attributes: [
      { id: 'l-attr-2-1', listing_id: 'list-2', attribute_key: 'delivery_speed', attribute_value: 'Instant (<15m)' },
      { id: 'l-attr-2-2', listing_id: 'list-2', attribute_key: 'minimum_order', attribute_value: '100000' }
    ]
  },
  {
    id: 'list-3',
    seller_id: 'user-4',
    category_id: 'cat-armor',
    title: 'Harlequin Crest (Shako) - Perfect Roll',
    description: 'Perfect roll Shako! +4 to All Skills, 10% Damage Reduction, Max Resource increase, and massive Resource Generation. Fresh drop from Uber Duriel, ready to trade in Diablo 4 Eternal Realm.',
    price: 320,
    currency: 'Forum Gold',
    quantity: 1,
    status: 'active',
    server_region: 'Global Realm',
    created_at: '2026-07-01T22:15:00Z',
    updated_at: '2026-07-01T22:15:00Z',
    seller: mockUsers[3],
    category: mockCategories[1],
    images: [
      { id: 'img-3-1', listing_id: 'list-3', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80', sort_order: 0 }
    ],
    attributes: [
      { id: 'l-attr-3-1', listing_id: 'list-3', attribute_key: 'rarity', attribute_value: 'Mythic' },
      { id: 'l-attr-3-2', listing_id: 'list-3', attribute_key: 'level_req', attribute_value: '80' },
      { id: 'l-attr-3-3', listing_id: 'list-3', attribute_key: 'defense', attribute_value: '460' },
      { id: 'l-attr-3-4', listing_id: 'list-3', attribute_key: 'slot', attribute_value: 'Helmet' }
    ]
  },
  {
    id: 'list-4',
    seller_id: 'user-3',
    category_id: 'cat-gems',
    title: 'Mirror of Kalandra (POE Settlers)',
    description: 'Path of Exile Settlers of Kalguur league. Allows duplication of a non-unique, non-corrupted item. Will deliver within 1 hour. Safe trade procedures in hideout.',
    price: 210,
    currency: 'USD',
    quantity: 2,
    status: 'active',
    server_region: 'US-West (SC)',
    created_at: '2026-07-03T02:30:00Z',
    updated_at: '2026-07-03T02:30:00Z',
    seller: mockUsers[2],
    category: mockCategories[3],
    images: [
      { id: 'img-4-1', listing_id: 'list-4', url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&q=80', sort_order: 0 }
    ],
    attributes: [
      { id: 'l-attr-4-1', listing_id: 'list-4', attribute_key: 'rarity', attribute_value: 'Mythic' },
      { id: 'l-attr-4-2', listing_id: 'list-4', attribute_key: 'level_req', attribute_value: '1' },
      { id: 'l-attr-4-3', listing_id: 'list-4', attribute_key: 'gem_color', attribute_value: 'Prismatic' }
    ]
  },
  {
    id: 'list-5',
    seller_id: 'user-1',
    category_id: 'cat-weapons',
    title: 'Ashbringer Recreated Greatsword',
    description: 'Crafted replica of the Ashbringer. Custom design with epic stat allocations: +45 Strength, +22 Stamina. Requires high level blacksmithing to wield effectively. Renders undead and demon targets vulnerable on strike.',
    price: 15000,
    currency: 'Gold',
    quantity: 1,
    status: 'active',
    server_region: 'US-East (PVP)',
    created_at: '2026-06-28T09:00:00Z',
    updated_at: '2026-07-01T15:20:00Z',
    seller: mockUsers[0],
    category: mockCategories[0],
    images: [
      { id: 'img-5-1', listing_id: 'list-5', url: 'https://images.unsplash.com/photo-1559893088-c0787ebfc084?w=600&q=80', sort_order: 0 }
    ],
    attributes: [
      { id: 'l-attr-5-1', listing_id: 'list-5', attribute_key: 'rarity', attribute_value: 'Epic' },
      { id: 'l-attr-5-2', listing_id: 'list-5', attribute_key: 'level_req', attribute_value: '60' },
      { id: 'l-attr-5-3', listing_id: 'list-5', attribute_key: 'damage', attribute_value: '115' },
      { id: 'l-attr-5-4', listing_id: 'list-5', attribute_key: 'item_type', attribute_value: 'Two-Handed Mace' } // using mace as placeholder type
    ]
  },
  {
    id: 'list-6',
    seller_id: 'user-2',
    category_id: 'cat-accounts',
    title: 'Level 80 BiS Holy Paladin - Raid Ready',
    description: 'Fully geared Holy Paladin, ready for ICC Heroic. Has 4/5 Tier 10.5 gear, Val\'anyr Hammer of Ancient Kings (Legendary Mace), Invincible Mount, and 310% flying. 450 Jewelcrafting/Engineering.',
    price: 750,
    currency: 'USD',
    quantity: 1,
    status: 'active',
    server_region: 'EU-Gehennas (PVP)',
    created_at: '2026-06-30T10:00:00Z',
    updated_at: '2026-06-30T10:00:00Z',
    seller: mockUsers[1],
    category: mockCategories[4],
    images: [
      { id: 'img-6-1', listing_id: 'list-6', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80', sort_order: 0 }
    ],
    attributes: [
      { id: 'l-attr-6-1', listing_id: 'list-6', attribute_key: 'character_level', attribute_value: '80' },
      { id: 'l-attr-6-2', listing_id: 'list-6', attribute_key: 'class', attribute_value: 'Paladin' },
      { id: 'l-attr-6-3', listing_id: 'list-6', attribute_key: 'has_rare_mounts', attribute_value: 'Yes' }
    ]
  },
  {
    id: 'list-7',
    seller_id: 'user-3',
    category_id: 'cat-services',
    title: 'Hardcore Leveling 1-60 Boost',
    description: '100% manual leveling boost by veteran players. Safe and stream-monitored. We use VPN matching your location to ensure safety. Delivery in 5-7 days. All loot and gold kept on your account.',
    price: 180,
    currency: 'USD',
    quantity: 99,
    status: 'active',
    server_region: 'US/EU Realms',
    created_at: '2026-07-02T18:00:00Z',
    updated_at: '2026-07-02T18:00:00Z',
    seller: mockUsers[2],
    category: mockCategories[5],
    images: [
      { id: 'img-7-1', listing_id: 'list-7', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80', sort_order: 0 }
    ],
    attributes: [
      { id: 'l-attr-7-1', listing_id: 'list-7', attribute_key: 'service_type', attribute_value: 'Leveling 1-60' }
    ]
  },
  {
    id: 'list-8',
    seller_id: 'user-4',
    category_id: 'cat-weapons',
    title: 'Recruit\'s Practice Wooden Bow',
    description: 'A light, splintering practice bow used by military academy cadets. Deals minor damage but costs zero stamina to shoot. Ideal for beginner rangers leveling up in the starting zone.',
    price: 12,
    currency: 'Gold',
    quantity: 3,
    status: 'active',
    server_region: 'US-East (PVP)',
    created_at: '2026-07-03T09:30:00Z',
    updated_at: '2026-07-03T09:30:00Z',
    seller: mockUsers[3],
    category: mockCategories[0],
    images: [
      { id: 'img-8-1', listing_id: 'list-8', url: 'https://images.unsplash.com/photo-1512412086890-a7d057978b77?w=600&q=80', sort_order: 0 }
    ],
    attributes: [
      { id: 'l-attr-8-1', listing_id: 'list-8', attribute_key: 'rarity', attribute_value: 'Common' },
      { id: 'l-attr-8-2', listing_id: 'list-8', attribute_key: 'level_req', attribute_value: '1' },
      { id: 'l-attr-8-3', listing_id: 'list-8', attribute_key: 'damage', attribute_value: '3' },
      { id: 'l-attr-8-4', listing_id: 'list-8', attribute_key: 'item_type', attribute_value: 'Bow' }
    ]
  },
  {
    id: 'list-9',
    seller_id: 'user-1',
    category_id: 'cat-armor',
    title: 'Glinting Silver Ring of Swiftness',
    description: 'Uncommon drop from dungeon trash. Gives a minor passive movement speed increase (+2%) and +5 Agility. Fits any class, level 15 required.',
    price: 450,
    currency: 'Gold',
    quantity: 1,
    status: 'active',
    server_region: 'EU-Gehennas (PVP)',
    created_at: '2026-07-03T07:15:00Z',
    updated_at: '2026-07-03T07:15:00Z',
    seller: mockUsers[0],
    category: mockCategories[1],
    images: [
      { id: 'img-9-1', listing_id: 'list-9', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80', sort_order: 0 }
    ],
    attributes: [
      { id: 'l-attr-9-1', listing_id: 'list-9', attribute_key: 'rarity', attribute_value: 'Uncommon' },
      { id: 'l-attr-9-2', listing_id: 'list-9', attribute_key: 'level_req', attribute_value: '15' },
      { id: 'l-attr-9-3', listing_id: 'list-9', attribute_key: 'defense', attribute_value: '5' },
      { id: 'l-attr-9-4', listing_id: 'list-9', attribute_key: 'slot', attribute_value: 'Ring' }
    ]
  }
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: 'comm-1',
    listing_id: 'list-1',
    user_id: 'user-3',
    body: 'Is this sword still available? And does it have any enchantments applied currently?',
    created_at: '2026-07-02T14:22:00Z',
    user: mockUsers[2]
  },
  {
    id: 'comm-2',
    listing_id: 'list-1',
    user_id: 'user-1',
    body: 'Yes, still available! It has a Crusader enchantment (+strength & heal on proc) on it, free of charge.',
    created_at: '2026-07-02T15:05:00Z',
    user: mockUsers[0]
  },
  {
    id: 'comm-3',
    listing_id: 'list-3',
    user_id: 'user-1',
    body: 'Can we do 290 Forum Gold for the Shako? I am online right now.',
    created_at: '2026-07-02T08:12:00Z',
    user: mockUsers[0]
  }
];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: 'rev-1',
    reviewer_id: 'user-3',
    reviewed_id: 'user-1',
    listing_id: 'list-5',
    rating: 5,
    comment: 'Super fast trade and safe. He even gave me some health potions for free. Highly recommended seller!',
    created_at: '2026-06-29T10:15:00Z',
    reviewer: mockUsers[2]
  },
  {
    id: 'rev-2',
    reviewer_id: 'user-4',
    reviewed_id: 'user-2',
    rating: 5,
    comment: 'Bought gold multiple times, always arrives within 10 minutes. A+++ goblin merchant!',
    created_at: '2026-05-25T11:00:00Z',
    reviewer: mockUsers[3]
  }
];

// Mock Conversations & Messages
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    listing_id: 'list-1',
    buyer_id: 'user-current',
    seller_id: 'user-1',
    created_at: '2026-07-03T10:00:00Z',
    listing: mockListings[0],
    buyer: mockUsers[4],
    seller: mockUsers[0],
    messages: [
      { id: 'm-1-1', conversation_id: 'conv-1', sender_id: 'user-current', body: 'Hey ShadowBlade, is the Thunderfury negotiable? I have 80,000 gold on me right now.', created_at: '2026-07-03T10:00:00Z', read_at: '2026-07-03T10:02:00Z' },
      { id: 'm-1-2', conversation_id: 'conv-1', sender_id: 'user-1', body: 'Hey! 80k is close enough. I can accept that if we do the trade right now. Meet me in Ironforge bank, channel 4.', created_at: '2026-07-03T10:05:00Z', read_at: '2026-07-03T10:06:00Z' },
      { id: 'm-1-3', conversation_id: 'conv-1', sender_id: 'user-current', body: 'Awesome! Logging on my warrior character named "IronTank". Be there in 2 mins.', created_at: '2026-07-03T10:08:00Z' }
    ]
  },
  {
    id: 'conv-2',
    listing_id: 'list-2',
    buyer_id: 'user-current',
    seller_id: 'user-2',
    created_at: '2026-07-03T11:50:00Z',
    listing: mockListings[1],
    buyer: mockUsers[4],
    seller: mockUsers[1],
    messages: [
      { id: 'm-2-1', conversation_id: 'conv-2', sender_id: 'user-current', body: 'Hi! Just bought the 500k gold. Can we trade in Orgrimmar?', created_at: '2026-07-03T11:50:00Z', read_at: '2026-07-03T11:51:00Z' },
      { id: 'm-2-2', conversation_id: 'conv-2', sender_id: 'user-2', body: 'Greetings customer! Yes, of course. Please log in and stand near the auction house. Invite me, my character name is "Golddigger". What is your name?', created_at: '2026-07-03T11:52:00Z', read_at: '2026-07-03T11:53:00Z' },
      { id: 'm-2-3', conversation_id: 'conv-2', sender_id: 'user-current', body: 'My character is "LootMaster". I am standing in front of the AH now.', created_at: '2026-07-03T11:54:00Z' }
    ]
  }
];

// Helper search function simulating a faceted search engine like Meilisearch
export interface SearchParams {
  query?: string;
  category_id?: string;
  rarity?: string[];
  min_price?: number;
  max_price?: number;
  server_region?: string;
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'newest';
  
  // Dynamic attribute filters (key-value pair)
  attributes?: Record<string, string>;
}

export function searchListings(params: SearchParams): Listing[] {
  let results = [...mockListings];

  // 1. Filter by Active status
  results = results.filter(item => item.status === 'active');

  // 2. Query Search (simple text matching on title, description, and tags)
  if (params.query) {
    const q = params.query.toLowerCase().trim();
    results = results.filter(item => 
      item.title.toLowerCase().includes(q) || 
      (item.description && item.description.toLowerCase().includes(q)) ||
      item.category?.name.toLowerCase().includes(q) ||
      item.server_region?.toLowerCase().includes(q)
    );
  }

  // 3. Category Filter
  if (params.category_id && params.category_id !== 'all') {
    results = results.filter(item => item.category_id === params.category_id);
  }

  // 4. Rarity Filter (multi-select)
  if (params.rarity && params.rarity.length > 0) {
    results = results.filter(item => {
      const itemRarity = item.attributes?.find(a => a.attribute_key === 'rarity')?.attribute_value;
      return itemRarity && params.rarity!.includes(itemRarity);
    });
  }

  // 5. Price Range Filter
  if (params.min_price !== undefined && !isNaN(params.min_price)) {
    results = results.filter(item => item.price >= params.min_price!);
  }
  if (params.max_price !== undefined && !isNaN(params.max_price)) {
    results = results.filter(item => item.price <= params.max_price!);
  }

  // 6. Server Region Filter
  if (params.server_region && params.server_region !== 'all') {
    results = results.filter(item => 
      item.server_region?.toLowerCase().includes(params.server_region!.toLowerCase())
    );
  }

  // 7. Dynamic Attributes filters (e.g. level_req, defense, weapon type, etc.)
  if (params.attributes) {
    Object.entries(params.attributes).forEach(([key, val]) => {
      if (val && val !== 'all') {
        results = results.filter(item => {
          const attr = item.attributes?.find(a => a.attribute_key === key);
          if (!attr) return false;
          
          // Numerical comparisons like level_req or defense can be checked
          if (!isNaN(Number(val)) && !isNaN(Number(attr.attribute_value))) {
            return Number(attr.attribute_value) >= Number(val); // treat as minimum (e.g. min level or min defense)
          }
          return attr.attribute_value.toLowerCase() === val.toLowerCase();
        });
      }
    });
  }

  // 8. Sorting
  if (params.sort) {
    switch (params.sort) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'relevance':
      default:
        // relevance sort: match title first, then newest
        if (params.query) {
          const q = params.query.toLowerCase().trim();
          results.sort((a, b) => {
            const aTitle = a.title.toLowerCase().includes(q) ? 2 : 1;
            const bTitle = b.title.toLowerCase().includes(q) ? 2 : 1;
            if (aTitle !== bTitle) return bTitle - aTitle;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
        } else {
          results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        break;
    }
  } else {
    // default sort is newest
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return results;
}

export function addListing(listing: Listing) {
  mockListings.unshift(listing);
}
