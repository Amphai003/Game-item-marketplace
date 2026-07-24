"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Star, Package, MessageSquare, Bell, ShieldCheck, PlusCircle } from 'lucide-react';
import ListingCard from './ListingCard';
import {
  getListingsBySeller,
  getReviewsForUser,
  getCategoryById,
  mockSavedSearches,
} from '../mocks/data';
import { formatDate, timeAgo } from '../lib/format';
import { User } from '../types';

interface ProfileViewProps {
  user: User;
  isOwn: boolean;
}

type Tab = 'listings' | 'reviews' | 'alerts';

export default function ProfileView({ user, isOwn }: ProfileViewProps) {
  const listings = useMemo(() => getListingsBySeller(user.id), [user.id]);
  const reviews = useMemo(() => getReviewsForUser(user.id), [user.id]);
  const savedSearches = isOwn ? mockSavedSearches : [];

  const activeListings = listings.filter((l) => l.status === 'active');
  const [tab, setTab] = useState<Tab>('listings');

  const stats = [
    { label: 'Rating', value: `★ ${user.rating_avg.toFixed(2)}` },
    { label: 'Reviews', value: user.rating_count.toLocaleString() },
    { label: 'Active Listings', value: activeListings.length.toLocaleString() },
    { label: 'Member Since', value: formatDate(user.created_at) },
  ];

  const tabs: { id: Tab; label: string; count: number; show: boolean }[] = [
    { id: 'listings', label: 'Listings', count: activeListings.length, show: true },
    { id: 'reviews', label: 'Reviews', count: reviews.length, show: true },
    { id: 'alerts', label: 'Saved Alerts', count: savedSearches.length, show: isOwn },
  ];

  const describeFilters = (filters: Record<string, unknown>): string => {
    const parts: string[] = [];
    if (filters.category_id) parts.push(getCategoryById(String(filters.category_id))?.name ?? String(filters.category_id));
    if (Array.isArray(filters.rarity) && filters.rarity.length) parts.push(filters.rarity.join(', '));
    if (filters.server_region) parts.push(String(filters.server_region));
    if (filters.min_price != null || filters.max_price != null) {
      parts.push(`$${filters.min_price ?? 0} – $${filters.max_price ?? '∞'}`);
    }
    return parts.join(' · ') || 'All listings';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-game-border bg-game-card/80 p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_15%_-10%,rgba(59,130,246,0.15),transparent)]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-orange-500/50 bg-gray-800 sm:h-24 sm:w-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{user.username}</h1>
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Trader
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span>{user.rating_avg.toFixed(2)}</span>
                <span className="text-gray-500">({user.rating_count} reviews)</span>
              </div>
            </div>
          </div>

          {isOwn ? (
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-bold text-white transition hover:opacity-95"
            >
              <PlusCircle className="h-4 w-4" />
              New Listing
            </Link>
          ) : (
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500">
              <MessageSquare className="h-4 w-4" />
              Message
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-game-border bg-game-dark/60 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
              <p className="mt-1 text-lg font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 border-b border-game-border">
        {tabs.filter((t) => t.show).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-4 py-3 text-sm font-bold transition-colors ${
              tab === t.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-xs text-gray-500">{t.count}</span>
            {tab === t.id && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-blue-500" />}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {tab === 'listings' && (
          activeListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Package className="h-7 w-7" />}
              title={isOwn ? 'You have no active listings' : 'No active listings'}
              body={isOwn ? 'List your first item to start selling.' : 'This trader has nothing for sale right now.'}
              action={isOwn ? { href: '/create', label: 'Create a Listing' } : undefined}
            />
          )
        )}

        {tab === 'reviews' && (
          reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="flex items-start gap-3 rounded-2xl border border-game-border bg-game-card/60 p-4">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-game-border bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={review.reviewer?.avatar_url} alt={review.reviewer?.username ?? 'user'} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-white">{review.reviewer?.username ?? 'Anonymous'}</span>
                      <span className="text-[11px] text-gray-500">{timeAgo(review.created_at)}</span>
                    </div>
                    <div className="my-1 flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-700'}`} />
                      ))}
                    </div>
                    {review.comment && <p className="text-sm text-gray-300">{review.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Star className="h-7 w-7" />} title="No reviews yet" body="Reviews appear here after completed trades." />
          )
        )}

        {tab === 'alerts' && (
          savedSearches.length > 0 ? (
            <div className="space-y-3">
              {savedSearches.map((search) => (
                <div key={search.id} className="flex items-center justify-between gap-4 rounded-2xl border border-game-border bg-game-card/60 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-500/25 bg-orange-500/10 text-orange-400">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{search.query ? `"${search.query}"` : 'Any keyword'}</p>
                      <p className="text-xs text-gray-400">{describeFilters(search.filters)}</p>
                      <p className="mt-1 text-[11px] text-gray-500">
                        Created {timeAgo(search.created_at)}
                        {search.last_notified_at && ` · last alert ${timeAgo(search.last_notified_at)}`}
                      </p>
                    </div>
                  </div>
                  <Link href="/" className="shrink-0 text-xs font-bold text-blue-400 hover:text-blue-300">
                    Run search
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Bell className="h-7 w-7" />}
              title="No saved alerts"
              body="Save a search from the browse page to get notified when matching loot drops."
              action={{ href: '/', label: 'Browse & Save a Search' }}
            />
          )
        )}
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-game-border bg-game-card/30 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-game-border bg-game-card text-gray-500">
        {icon}
      </div>
      <h3 className="mb-1 text-lg font-bold text-white">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-400">{body}</p>
      {action && (
        <Link href={action.href} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500">
          {action.label}
        </Link>
      )}
    </div>
  );
}
