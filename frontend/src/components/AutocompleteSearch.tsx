"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader, ArrowRight } from 'lucide-react';
import { mockListings, mockCategories, mockUsers } from '../mocks/data';

interface AutocompleteSearchProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
  placeholder?: string;
}

interface Suggestion {
  id: string;
  type: 'item' | 'category' | 'seller';
  text: string;
  categoryName?: string;
  rarity?: string;
  detail?: string;
}

export default function AutocompleteSearch({ onSearch, defaultValue = '', placeholder = "Search weapons, armor, runes, sellers..." }: AutocompleteSearchProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update input value when defaultValue prop changes
  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  // Generate suggestions based on input
  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const q = inputValue.toLowerCase().trim();
      const tempSuggestions: Suggestion[] = [];

      // 1. Match Categories (max 2 matches)
      const matchedCats = mockCategories
        .filter(c => c.name.toLowerCase().includes(q))
        .slice(0, 2)
        .map(c => ({
          id: `cat-${c.id}`,
          type: 'category' as const,
          text: c.name,
          detail: 'Category'
        }));
      tempSuggestions.push(...matchedCats);

      // 2. Match Listings (max 5 matches)
      const matchedListings = mockListings
        .filter(l => l.title.toLowerCase().includes(q) || (l.description && l.description.toLowerCase().includes(q)))
        .slice(0, 5)
        .map(l => {
          const rarity = l.attributes?.find(a => a.attribute_key === 'rarity')?.attribute_value;
          return {
            id: `item-${l.id}`,
            type: 'item' as const,
            text: l.title,
            rarity,
            categoryName: l.category?.name,
            detail: `${l.price} ${l.currency}`
          };
        });
      tempSuggestions.push(...matchedListings);

      // 3. Match Sellers (max 2 matches)
      const matchedSellers = mockUsers
        .filter(u => u.username.toLowerCase().includes(q))
        .slice(0, 2)
        .map(u => ({
          id: `seller-${u.id}`,
          type: 'seller' as const,
          text: u.username,
          detail: `★ ${u.rating_avg.toFixed(1)} (${u.rating_count} reviews)`
        }));
      tempSuggestions.push(...matchedSellers);

      setSuggestions(tempSuggestions);
      setIsOpen(tempSuggestions.length > 0);
      setActiveIndex(-1);
      setLoading(false);
    }, 150); // Small debounce

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[activeIndex]);
      } else {
        handleSubmitSearch();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setInputValue(suggestion.text);
    setIsOpen(false);
    onSearch(suggestion.text);
  };

  const handleSubmitSearch = () => {
    setIsOpen(false);
    onSearch(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  // Helper to color coder rarity inside autocomplete list
  const getRarityColor = (rarity?: string) => {
    if (!rarity) return 'text-gray-400';
    switch (rarity.toLowerCase()) {
      case 'common': return 'text-rarity-common';
      case 'uncommon': return 'text-rarity-uncommon';
      case 'rare': return 'text-rarity-rare';
      case 'epic': return 'text-rarity-epic';
      case 'legendary': return 'text-rarity-legendary';
      case 'mythic': return 'text-rarity-mythic';
      default: return 'text-gray-400';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative flex items-center">
        <label htmlFor="search-input" className="sr-only">Search listings</label>
        <div className="pointer-events-none absolute left-4 text-gray-400">
          {loading ? (
            <Loader className="h-5 w-5 animate-spin text-blue-500" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>
        <input
          id="search-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(suggestions.length > 0)}
          placeholder={placeholder}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
          className="w-full rounded-lg border border-game-border bg-game-card/90 py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-500 shadow-inner transition-all focus:border-blue-500 focus:bg-game-card focus:shadow-glow-rare focus:ring-1 focus:ring-blue-500"
        />
        
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-12 p-1.5 rounded-full text-gray-400 hover:text-white transition-colors"
            aria-label="Clear Search Input"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={handleSubmitSearch}
          className="absolute right-2.5 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-all font-semibold text-xs tracking-wider uppercase focus:ring-2 focus:ring-blue-400"
          aria-label="Submit Search"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Suggestion Dropdown */}
      {isOpen && (
        <ul
          role="listbox"
          aria-label="Search suggestions"
          className="absolute left-0 mt-2 w-full z-40 rounded-lg border border-game-border bg-game-dark/95 backdrop-blur-md p-1 shadow-2xl overflow-y-auto max-h-80 divide-y divide-game-border/30 animate-slide-down"
        >
          {suggestions.map((suggestion, index) => {
            const isSelected = index === activeIndex;
            return (
              <li
                key={suggestion.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelectSuggestion(suggestion)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-md cursor-pointer transition-all ${
                  isSelected ? 'bg-game-border/60 text-white shadow-inner border border-blue-500/10' : 'text-gray-300'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold truncate ${suggestion.type === 'item' ? getRarityColor(suggestion.rarity) : ''}`}>
                      {suggestion.text}
                    </span>
                    {suggestion.categoryName && (
                      <span className="text-[10px] bg-game-border border border-game-border px-1.5 py-0.5 rounded text-gray-400">
                        {suggestion.categoryName}
                      </span>
                    )}
                  </div>
                  {suggestion.type === 'seller' && (
                    <span className="text-[10px] text-gray-500 font-medium">Merchant</span>
                  )}
                </div>

                <div className="text-right">
                  <span className={`text-xs font-semibold ${suggestion.type === 'item' ? 'text-amber-400' : 'text-gray-400'}`}>
                    {suggestion.detail}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
