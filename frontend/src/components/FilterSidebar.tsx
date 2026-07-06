"use client";

import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { mockCategories, mockCategoryAttributes } from '../mocks/data';
import { Rarity } from '../types';

interface FilterSidebarProps {
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedRarities: string[];
  setSelectedRarities: (val: string[]) => void;
  minPrice: number | undefined;
  setMinPrice: (val: number | undefined) => void;
  maxPrice: number | undefined;
  setMaxPrice: (val: number | undefined) => void;
  selectedRegion: string;
  setSelectedRegion: (val: string) => void;
  dynamicAttributes: Record<string, string>;
  setDynamicAttributes: (val: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  onClearAll: () => void;
  onCloseMobile?: () => void; // for closing bottom sheet / drawer
}

export default function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedRarities,
  setSelectedRarities,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedRegion,
  setSelectedRegion,
  dynamicAttributes,
  setDynamicAttributes,
  onClearAll,
  onCloseMobile
}: FilterSidebarProps) {
  // Accordion states
  const [catOpen, setCatOpen] = useState(true);
  const [rarityOpen, setRarityOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [regionOpen, setRegionOpen] = useState(true);
  const [attributesOpen, setAttributesOpen] = useState(true);

  // Dynamic attributes matching the current category
  const [currentAttrs, setCurrentAttrs] = useState<typeof mockCategoryAttributes>([]);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      const attrs = mockCategoryAttributes.filter(a => a.category_id === selectedCategory && a.attribute_key !== 'rarity');
      setCurrentAttrs(attrs);
    } else {
      setCurrentAttrs([]);
    }
  }, [selectedCategory]);

  const toggleRarity = (rarity: Rarity) => {
    if (selectedRarities.includes(rarity)) {
      setSelectedRarities(selectedRarities.filter(r => r !== rarity));
    } else {
      setSelectedRarities([...selectedRarities, rarity]);
    }
  };

  const handleAttrChange = (key: string, value: string) => {
    setDynamicAttributes(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const rarityList: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
  
  // Highlight border and text for rarity selection
  const getRarityBadgeStyle = (rarity: Rarity, isChecked: boolean) => {
    if (!isChecked) return 'border-game-border bg-game-card/50 text-gray-400 hover:border-gray-600';
    switch (rarity.toLowerCase()) {
      case 'common': return 'border-rarity-common bg-rarity-common/10 text-rarity-common font-bold';
      case 'uncommon': return 'border-rarity-uncommon bg-rarity-uncommon/10 text-rarity-uncommon font-bold';
      case 'rare': return 'border-rarity-rare bg-rarity-rare/10 text-rarity-rare font-bold';
      case 'epic': return 'border-rarity-epic bg-rarity-epic/10 text-rarity-epic font-bold';
      case 'legendary': return 'border-rarity-legendary bg-rarity-legendary/10 text-rarity-legendary font-bold';
      case 'mythic': return 'border-rarity-mythic bg-rarity-mythic/10 text-rarity-mythic font-bold';
      default: return 'border-blue-500 bg-blue-500/10 text-blue-400 font-bold';
    }
  };

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'us-east', label: 'US-East (PVP/SC)' },
    { value: 'us-west', label: 'US-West (PVP/SC)' },
    { value: 'eu-kazzak', label: 'EU-Kazzak' },
    { value: 'eu-gehennas', label: 'EU-Gehennas' },
    { value: 'global', label: 'Global Realms' }
  ];

  return (
    <aside className="w-full flex flex-col h-full bg-game-card/65 border border-game-border rounded-lg p-5 overflow-y-auto select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-game-border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Filters</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-[11px] font-semibold text-orange-500 hover:text-orange-400 transition-colors uppercase tracking-wider p-1 rounded hover:bg-game-border/30"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
          
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 rounded text-gray-400 hover:text-white"
              aria-label="Close Filter Menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 mt-4 space-y-5">
        
        {/* Category Accordion */}
        <div className="border-b border-game-border/40 pb-4">
          <button
            onClick={() => setCatOpen(!catOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest py-1"
          >
            <span>Category</span>
            {catOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {catOpen && (
            <div className="mt-3 space-y-1.5 animate-fade-in">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setDynamicAttributes({});
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-glow-rare'
                    : 'text-gray-400 hover:bg-game-border/30 hover:text-white'
                }`}
              >
                All Categories
              </button>
              {mockCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setDynamicAttributes({}); // clear on category change
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-glow-rare'
                      : 'text-gray-400 hover:bg-game-border/30 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rarity Selector */}
        <div className="border-b border-game-border/40 pb-4">
          <button
            onClick={() => setRarityOpen(!rarityOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest py-1"
          >
            <span>Rarity Grade</span>
            {rarityOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {rarityOpen && (
            <div className="mt-3 grid grid-cols-2 gap-2 animate-fade-in">
              {rarityList.map((rarity) => {
                const isChecked = selectedRarities.includes(rarity);
                return (
                  <button
                    key={rarity}
                    onClick={() => toggleRarity(rarity)}
                    className={`flex items-center justify-center py-2 px-1 border rounded text-[11px] transition-all duration-150 ${getRarityBadgeStyle(
                      rarity,
                      isChecked
                    )}`}
                  >
                    {rarity}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Category Attributes Driven by Category Attributes Schema */}
        {selectedCategory !== 'all' && currentAttrs.length > 0 && (
          <div className="border-b border-game-border/40 pb-4">
            <button
              onClick={() => setAttributesOpen(!attributesOpen)}
              className="w-full flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest py-1"
            >
              <span>Specs Attributes</span>
              {attributesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {attributesOpen && (
              <div className="mt-3 space-y-4 animate-fade-in">
                {currentAttrs.map((attr) => {
                  const val = dynamicAttributes[attr.attribute_key] || '';
                  const displayName = attr.attribute_key.replace('_', ' ').toUpperCase();
                  
                  return (
                    <div key={attr.id} className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">
                        {displayName}
                      </label>
                      
                      {attr.attribute_type === 'enum' && attr.enum_options ? (
                        <select
                          value={val}
                          onChange={(e) => handleAttrChange(attr.attribute_key, e.target.value)}
                          className="w-full text-xs font-semibold rounded bg-game-dark border border-game-border p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        >
                          <option value="all">Any {displayName.toLowerCase()}</option>
                          {attr.enum_options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => handleAttrChange(attr.attribute_key, e.target.value)}
                          placeholder={`Min ${attr.attribute_key.replace('_req', ' level')}`}
                          className="w-full text-xs font-semibold rounded bg-game-dark border border-game-border p-2.5 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Price Range Filter */}
        <div className="border-b border-game-border/40 pb-4">
          <button
            onClick={() => setPriceOpen(!priceOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest py-1"
          >
            <span>Price Range</span>
            {priceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {priceOpen && (
            <div className="mt-3 flex items-center gap-2.5 animate-fade-in">
              <div className="flex-1 flex flex-col gap-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice !== undefined ? minPrice : ''}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full text-xs font-semibold rounded bg-game-dark border border-game-border p-2.5 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <span className="text-gray-600 text-xs">-</span>
              <div className="flex-1 flex flex-col gap-1">
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice !== undefined ? maxPrice : ''}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full text-xs font-semibold rounded bg-game-dark border border-game-border p-2.5 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Server/Region Filter */}
        <div>
          <button
            onClick={() => setRegionOpen(!regionOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest py-1"
          >
            <span>Server / Region</span>
            {regionOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {regionOpen && (
            <div className="mt-3 animate-fade-in">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full text-xs font-semibold rounded bg-game-dark border border-game-border p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                {regions.map((reg) => (
                  <option key={reg.value} value={reg.value}>
                    {reg.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
}
