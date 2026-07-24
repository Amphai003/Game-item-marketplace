"use client";

import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import AutocompleteSearch from '../components/AutocompleteSearch';
import FilterSidebar from '../components/FilterSidebar';
import ListingCard from '../components/ListingCard';
import { searchListings, mockCategories } from '../mocks/data';
import { SlidersHorizontal, ArrowUpDown, X, Bell, Sparkles } from 'lucide-react';

type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest';

export default function BrowsePage() {
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [dynamicAttributes, setDynamicAttributes] = useState<Record<string, string>>({});
  
  // UI states
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Clear all filters
  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedRarities([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedRegion('all');
    setSortOption('relevance');
    setDynamicAttributes({});
  };

  // Perform filtering using mock Meilisearch engine helper
  const filteredListings = useMemo(() => {
    return searchListings({
      query: searchQuery,
      category_id: selectedCategory,
      rarity: selectedRarities,
      min_price: minPrice,
      max_price: maxPrice,
      server_region: selectedRegion === 'all' ? undefined : selectedRegion,
      sort: sortOption,
      attributes: dynamicAttributes
    });
  }, [searchQuery, selectedCategory, selectedRarities, minPrice, maxPrice, selectedRegion, sortOption, dynamicAttributes]);

  // Handle saving search alert
  const handleSaveSearch = () => {
    let summary = `Alert configured: `;
    if (searchQuery) summary += `"${searchQuery}" `;
    if (selectedCategory !== 'all') {
      const catName = mockCategories.find(c => c.id === selectedCategory)?.name;
      summary += `in ${catName} `;
    }
    if (selectedRarities.length > 0) {
      summary += `[${selectedRarities.join(', ')}] `;
    }
    if (minPrice || maxPrice) {
      summary += `($${minPrice || 0} - $${maxPrice || '∞'})`;
    }
    if (!searchQuery && selectedCategory === 'all' && selectedRarities.length === 0 && !minPrice && !maxPrice) {
      summary = "Alert configured for all new listings";
    }

    setToastMessage(`${summary}. You will be notified when matching loot drops!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Active tags to show above grid
  const activeTags = useMemo(() => {
    const tags: { id: string; label: string; onRemove: () => void }[] = [];
    
    if (searchQuery) {
      tags.push({
        id: 'query',
        label: `Search: "${searchQuery}"`,
        onRemove: () => setSearchQuery('')
      });
    }
    if (selectedCategory !== 'all') {
      const catName = mockCategories.find(c => c.id === selectedCategory)?.name;
      tags.push({
        id: 'category',
        label: `Category: ${catName}`,
        onRemove: () => {
          setSelectedCategory('all');
          setDynamicAttributes({});
        }
      });
    }
    selectedRarities.forEach(rarity => {
      tags.push({
        id: `rarity-${rarity}`,
        label: `Rarity: ${rarity}`,
        onRemove: () => setSelectedRarities(selectedRarities.filter(r => r !== rarity))
      });
    });
    if (minPrice !== undefined) {
      tags.push({
        id: 'minPrice',
        label: `Min Price: ${minPrice}`,
        onRemove: () => setMinPrice(undefined)
      });
    }
    if (maxPrice !== undefined) {
      tags.push({
        id: 'maxPrice',
        label: `Max Price: ${maxPrice}`,
        onRemove: () => setMaxPrice(undefined)
      });
    }
    if (selectedRegion !== 'all') {
      tags.push({
        id: 'region',
        label: `Region: ${selectedRegion}`,
        onRemove: () => setSelectedRegion('all')
      });
    }
    Object.entries(dynamicAttributes).forEach(([key, val]) => {
      if (val && val !== 'all') {
        tags.push({
          id: `attr-${key}`,
          label: `${key.replace('_', ' ')}: ${val}`,
          onRemove: () => {
            const next = { ...dynamicAttributes };
            delete next[key];
            setDynamicAttributes(next);
          }
        });
      }
    });

    return tags;
  }, [searchQuery, selectedCategory, selectedRarities, minPrice, maxPrice, selectedRegion, dynamicAttributes]);

  return (
    <div className="min-h-screen bg-game-dark text-gray-100 flex flex-col">
      <Navbar />

      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900/10 via-transparent to-transparent py-8 sm:py-12 border-b border-game-border/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),transparent)] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-400 mb-4 animate-pulse-glow">
            <Sparkles className="h-3 w-3" />
            <span>Now with live category attributes mapping</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl max-w-2xl leading-[1.1] mb-4">
            Trade In-Game Loot with Structured Specs
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mb-8 leading-relaxed">
            Stop searching chronological Facebook feeds. Search exact weapon damage, level requirements, classes, and regions instantly.
          </p>

          {/* Autocomplete Search Container */}
          <AutocompleteSearch onSearch={setSearchQuery} defaultValue={searchQuery} />
        </div>
      </section>

      {/* Main Browse Layout */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Controls Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {/* Mobile Filters Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-lg border border-game-border bg-game-card hover:bg-game-border transition-colors font-bold text-sm"
              aria-label="Open filter sidebar"
            >
              <SlidersHorizontal className="h-4 w-4 text-blue-400" />
              <span>Filters</span>
              {activeTags.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  {activeTags.length}
                </span>
              )}
            </button>

            {/* Desktop Save Search Button */}
            <button
              onClick={handleSaveSearch}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-orange-500/20 bg-orange-500/10 hover:bg-orange-500/20 transition-all font-bold text-sm text-orange-400 hover:text-white"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Save Search Alert</span>
              <span className="sm:hidden">Alert</span>
            </button>
          </div>

          {/* Sort Controller */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:inline">
              Sort By:
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none rounded-lg border border-game-border bg-game-card py-2.5 pl-4 pr-10 text-xs font-bold text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Drops</option>
              </select>
              <ArrowUpDown className="pointer-events-none absolute right-3 top-3 h-3.5 w-3.5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Filters & Results Grid wrapper */}
        <div className="flex gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block w-64 shrink-0 sticky top-24">
            <FilterSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedRarities={selectedRarities}
              setSelectedRarities={setSelectedRarities}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              dynamicAttributes={dynamicAttributes}
              setDynamicAttributes={setDynamicAttributes}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Main listings area */}
          <div className="flex-1 min-w-0">
            
            {/* Active Tags list */}
            {activeTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1">Active:</span>
                {activeTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 bg-game-border/60 border border-game-border pl-2.5 pr-1 py-1 rounded text-xs font-semibold text-gray-200"
                  >
                    <span>{tag.label}</span>
                    <button
                      onClick={tag.onRemove}
                      className="p-0.5 hover:text-white text-gray-500 rounded transition-colors"
                      aria-label={`Remove filter ${tag.label}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-orange-500 hover:text-orange-400 p-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Listings Count */}
            <div className="mb-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
              Showing {filteredListings.length} match{filteredListings.length === 1 ? '' : 'es'}
            </div>

            {/* Grid of Listings: Responsive sizing */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onMessageSeller={(lst) => {
                      setToastMessage(`Simulated messaging ${lst.seller?.username} about: ${lst.title}`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-game-border rounded-xl bg-game-card/35">
                <div className="h-12 w-12 rounded-full bg-game-border flex items-center justify-center text-gray-500 mb-4">
                  <SlidersHorizontal className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No loot matches your filters</h3>
                <p className="text-xs text-gray-400 max-w-sm mb-6">
                  Try adjusting your keywords, price range, or category specifications. Game servers are constantly dropping new items!
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-glow-rare"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Mobile Drawer (Filter bottom sheet / slide-over) */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end animate-fade-in" role="dialog" aria-modal="true">
          {/* Backdrop overlay */}
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          ></div>
          
          {/* Drawer Content */}
          <div className="relative w-full max-w-sm h-full bg-game-dark flex flex-col shadow-2xl animate-slide-up border-l border-game-border">
            <div className="flex-1 overflow-y-auto p-4">
              <FilterSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedRarities={selectedRarities}
                setSelectedRarities={setSelectedRarities}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                dynamicAttributes={dynamicAttributes}
                setDynamicAttributes={setDynamicAttributes}
                onClearAll={handleClearAll}
                onCloseMobile={() => setMobileFiltersOpen(false)}
              />
            </div>
            
            {/* Sticky mobile footer drawer */}
            <div className="p-4 border-t border-game-border bg-game-card flex items-center gap-3">
              <button
                onClick={handleClearAll}
                className="flex-1 py-3 rounded-lg border border-game-border font-bold text-xs text-center uppercase tracking-wider text-gray-400"
              >
                Clear
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-xs text-center uppercase tracking-wider text-white shadow-glow-rare"
              >
                Apply ({filteredListings.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border border-orange-500/30 bg-game-card/95 p-4 shadow-2xl backdrop-blur-md flex items-start gap-3 animate-slide-up">
          <div className="h-8 w-8 rounded-full bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 shrink-0">
            <Bell className="h-4 w-4 animate-bounce" />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Loot Alert Saved</div>
            <p className="text-[11px] text-gray-400 leading-normal">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-0.5 text-gray-500 hover:text-white rounded ml-auto"
            aria-label="Close Toast Notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
