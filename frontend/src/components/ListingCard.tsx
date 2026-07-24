"use client";

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, MessageSquare } from 'lucide-react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onMessageSeller?: (listing: Listing) => void;
}

export default function ListingCard({ listing, onMessageSeller }: ListingCardProps) {
  const { id, title, description, price, currency, quantity, server_region, seller, category, attributes } = listing;

  // Retrieve rarity and other custom attributes
  const rarity = attributes?.find(a => a.attribute_key === 'rarity')?.attribute_value || 'Common';
  const levelReq = attributes?.find(a => a.attribute_key === 'level_req')?.attribute_value;
  
  // Custom metadata display based on categories
  const otherAttributes = attributes?.filter(a => a.attribute_key !== 'rarity' && a.attribute_key !== 'level_req') || [];

  // Theme settings for rarity
  const getRarityConfig = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'uncommon':
        return {
          border: 'border-rarity-uncommon hover:border-rarity-uncommon/70',
          shadow: 'hover:shadow-glow-uncommon',
          text: 'text-rarity-uncommon',
          bg: 'bg-rarity-uncommon/10',
        };
      case 'rare':
        return {
          border: 'border-rarity-rare hover:border-rarity-rare/70',
          shadow: 'hover:shadow-glow-rare',
          text: 'text-rarity-rare',
          bg: 'bg-rarity-rare/10',
        };
      case 'epic':
        return {
          border: 'border-rarity-epic hover:border-rarity-epic/70',
          shadow: 'hover:shadow-glow-epic',
          text: 'text-rarity-epic',
          bg: 'bg-rarity-epic/10',
        };
      case 'legendary':
        return {
          border: 'border-rarity-legendary hover:border-rarity-legendary/70',
          shadow: 'hover:shadow-glow-legendary',
          text: 'text-rarity-legendary',
          bg: 'bg-rarity-legendary/10',
          glow: 'animate-pulse-glow',
        };
      case 'mythic':
        return {
          border: 'border-rarity-mythic hover:border-rarity-mythic/70',
          shadow: 'hover:shadow-glow-mythic',
          text: 'text-rarity-mythic',
          bg: 'bg-rarity-mythic/10',
          glow: 'animate-pulse-glow',
        };
      case 'common':
      default:
        return {
          border: 'border-game-border hover:border-gray-600',
          shadow: 'hover:shadow-glow-common',
          text: 'text-gray-400',
          bg: 'bg-game-border/30',
        };
    }
  };

  const rarityConf = getRarityConfig(rarity);
  const defaultImage = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80';
  const imageCount = listing.images?.length ?? 0;
  const imagesToShow = listing.images?.slice(0, 4) ?? [];
  const hasMultipleImages = imageCount > 1;

  return (
    <div
      className={`group relative flex flex-col h-full rounded-lg border bg-game-card/90 overflow-hidden transition-all duration-300 ${rarityConf.border} ${rarityConf.shadow} focus-within:ring-2 focus-within:ring-blue-500`}
    >
      {/* Card Header Media */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-game-dark border-b border-game-border/40">
        {/* Rarity Glow Backing for Epic+ */}
        {(rarity.toLowerCase() === 'legendary' || rarity.toLowerCase() === 'mythic') && (
          <div className={`absolute inset-0 opacity-20 bg-gradient-to-t from-transparent to-current ${rarityConf.text}`}></div>
        )}

        {hasMultipleImages ? (
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1">
            {imagesToShow.map((image, index) => (
              <div key={image.id || index} className="relative overflow-hidden">
                <img
                  src={image.url}
                  alt={`${title} image ${index + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {index === 3 && imageCount > 4 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-white text-sm font-semibold">
                    +{imageCount - 4}
                  </div>
                )}
              </div>
            ))}
            {imagesToShow.length < 4 && Array.from({ length: 4 - imagesToShow.length }).map((_, placeholderIndex) => (
              <div key={`placeholder-${placeholderIndex}`} className="bg-game-dark/80"></div>
            ))}
          </div>
        ) : (
          <img
            src={listing.images?.[0]?.url || defaultImage}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Badges on Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-white/10 ${rarityConf.text} ${rarityConf.bg}`}>
            {rarity}
          </span>
          {levelReq && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-game-dark/80 text-blue-400 border border-blue-500/20">
              Req. Lvl {levelReq}
            </span>
          )}
        </div>

        {/* Quantity for stackable items */}
        {quantity > 1 && (
          <div className="absolute bottom-2 right-2 bg-game-dark/95 border border-game-border text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
            Qty: {quantity}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex-1 flex flex-col p-4">
        
        {/* Category & Region */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400/90">
            {category?.name}
          </span>
          {server_region && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{server_region}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/listing/${id}`} className="hover:underline focus:outline-none mb-2">
          <h3 className={`text-base font-bold line-clamp-1 leading-snug transition-colors group-hover:text-white ${rarityConf.text}`}>
            {title}
          </h3>
        </Link>

        {/* Short Description */}
        {description && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-1">
            {description}
          </p>
        )}

        {/* Dynamic Attributes Grid */}
        {otherAttributes.length > 0 && (
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 border-t border-game-border/30 pt-3 pb-3 mb-3 text-[11px]">
            {otherAttributes.slice(0, 4).map((attr) => (
              <div key={attr.id} className="flex justify-between items-center text-gray-400">
                <span className="capitalize text-gray-500 font-medium">{attr.attribute_key.replace('_', ' ')}:</span>
                <span className="font-bold text-gray-300 truncate max-w-[65px]">{attr.attribute_value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer info: Seller rating & Price */}
        <div className="mt-auto border-t border-game-border/30 pt-3.5 flex items-center justify-between gap-3">
          
          {/* Seller profile snippet */}
          {seller && (
            <Link href={`/profile/${seller.id}`} className="flex items-center gap-2 focus:ring-1 focus:ring-blue-500 rounded p-0.5 hover:opacity-80">
              <div className="h-6.5 w-6.5 rounded-full overflow-hidden border border-game-border bg-gray-800">
                <img
                  src={seller.avatar_url}
                  alt={seller.username}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-gray-300 truncate max-w-[80px]">
                  {seller.username}
                </span>
                <div className="flex items-center gap-0.5 text-[9px] text-amber-500 font-semibold">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  <span>{seller.rating_avg.toFixed(1)}</span>
                </div>
              </div>
            </Link>
          )}

          {/* Pricing */}
          <div className="text-right flex flex-col">
            <span className="text-sm font-black text-amber-400 tracking-wide flex items-center gap-1 justify-end">
              <span>{price.toLocaleString()}</span>
              <span className="text-[10px] text-amber-500 font-bold uppercase">{currency}</span>
            </span>
          </div>

        </div>

      </div>

      {/* Hover action slide up banner */}
      <div className="p-3 bg-game-dark/95 border-t border-game-border flex items-center justify-between gap-2 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 absolute bottom-0 left-0 w-full z-10 backdrop-blur-sm">
        <Link
          href={`/listing/${id}`}
          className="flex-1 text-center py-2 rounded bg-game-border text-xs font-bold text-white hover:bg-game-borderHover transition-colors border border-blue-500/20"
        >
          View Specs
        </Link>
        <button
          onClick={() => onMessageSeller?.(listing)}
          className="px-3 py-2 rounded bg-orange-600 text-white hover:bg-orange-500 transition-all font-bold text-xs flex items-center justify-center shadow-glow-gold"
          aria-label="Message Seller"
        >
          <MessageSquare className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
