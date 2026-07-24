"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Package,
  Send,
  Clock,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import ListingCard from '../../../components/ListingCard';
import {
  getListingById,
  getCommentsForListing,
  getAttribute,
  addComment,
  findOrCreateConversation,
  addMessage,
  currentUser,
  mockListings,
} from '../../../mocks/data';
import { getRarityConfig } from '../../../lib/rarity';
import { timeAgo } from '../../../lib/format';
import { Comment } from '../../../types';

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const listing = getListingById(params.id);

  // Local, refresh-scoped state for Q&A and the private message composer.
  const [comments, setComments] = useState<Comment[]>(() =>
    listing ? getCommentsForListing(listing.id) : [],
  );
  const [newComment, setNewComment] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [messageBody, setMessageBody] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const relatedListings = useMemo(() => {
    if (!listing) return [];
    return mockListings
      .filter((l) => l.category_id === listing.category_id && l.id !== listing.id && l.status === 'active')
      .slice(0, 4);
  }, [listing]);

  if (!listing) {
    return (
      <div className="min-h-screen bg-game-dark text-gray-100">
        <Navbar />
        <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-game-card border border-game-border text-gray-500">
            <Package className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Listing not found</h1>
          <p className="mb-8 max-w-md text-sm text-gray-400">
            This item may have been sold or removed. Head back to the marketplace to find more loot.
          </p>
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            Back to Browse
          </Link>
        </main>
      </div>
    );
  }

  const rarity = getAttribute(listing, 'rarity') || 'Common';
  const rarityConf = getRarityConfig(rarity);
  const seller = listing.seller;
  const isOwnListing = seller?.id === currentUser.id;
  const images = listing.images ?? [];
  const heroImage = images[activeImage]?.url || images[0]?.url ||
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80';

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const body = newComment.trim();
    if (!body) return;
    const created = addComment(listing.id, body);
    setComments((prev) => [...prev, created]);
    setNewComment('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const body = messageBody.trim();
    if (!body || !seller) return;
    const conversation = findOrCreateConversation(listing.id, seller.id);
    addMessage(conversation.id, body);
    setMessageBody('');
    setMessageSent(true);
  };

  return (
    <div className="min-h-screen bg-game-dark text-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Browse
          </Link>
          <span>/</span>
          <span className="text-blue-400">{listing.category?.name}</span>
          <span>/</span>
          <span className="truncate text-gray-300">{listing.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Gallery */}
          <div className="space-y-4">
            <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl border bg-game-card ${rarityConf.border}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt={listing.title} className="h-full w-full object-cover" />
              <span
                className={`absolute left-4 top-4 inline-flex items-center rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider border border-white/10 ${rarityConf.text} ${rarityConf.bg}`}
              >
                {rarity}
              </span>
            </div>

            {images.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveImage(index)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border transition ${
                      index === activeImage ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-game-border hover:border-gray-600'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url} alt={`${listing.title} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Summary + actions */}
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-blue-400/90">
                <span>{listing.category?.name}</span>
                {listing.server_region && (
                  <span className="flex items-center gap-1 text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {listing.server_region}
                  </span>
                )}
              </div>
              <h1 className={`text-2xl font-extrabold leading-tight sm:text-3xl ${rarityConf.text}`}>
                {listing.title}
              </h1>
            </div>

            {/* Price block */}
            <div className="flex items-end justify-between rounded-2xl border border-game-border bg-game-card/80 p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Price</p>
                <p className="mt-1 text-3xl font-black text-amber-400">
                  {listing.price.toLocaleString()}
                  <span className="ml-1.5 text-sm font-bold uppercase text-amber-500">{listing.currency}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Quantity</p>
                <p className="mt-1 text-xl font-bold text-white">{listing.quantity}</p>
              </div>
            </div>

            {/* Seller card */}
            {seller && (
              <div className="flex items-center justify-between rounded-2xl border border-game-border bg-game-card/80 p-4">
                <Link href={`/profile/${seller.id}`} className="flex items-center gap-3 hover:opacity-90">
                  <div className="h-11 w-11 overflow-hidden rounded-full border border-game-border bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={seller.avatar_url} alt={seller.username} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{seller.username}</p>
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{seller.rating_avg.toFixed(1)}</span>
                      <span className="text-gray-500">({seller.rating_count} reviews)</span>
                    </div>
                  </div>
                </Link>
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              </div>
            )}

            {/* Message seller / private composer */}
            {isOwnListing ? (
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-200">
                This is your listing.{' '}
                <Link href="/profile" className="font-bold underline hover:text-white">
                  Manage it from your inventory
                </Link>
                .
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3 rounded-2xl border border-game-border bg-game-card/80 p-4">
                <label htmlFor="seller-message" className="flex items-center gap-2 text-sm font-bold text-white">
                  <MessageSquare className="h-4 w-4 text-orange-400" />
                  Message the seller
                </label>
                <textarea
                  id="seller-message"
                  value={messageBody}
                  onChange={(e) => {
                    setMessageBody(e.target.value);
                    setMessageSent(false);
                  }}
                  rows={3}
                  placeholder={`Hi ${seller?.username ?? ''}, is this still available?`}
                  className="w-full rounded-xl border border-game-border bg-game-dark/80 p-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex items-center justify-between gap-3">
                  {messageSent ? (
                    <span className="text-xs font-semibold text-emerald-300">
                      Sent! Continue in your{' '}
                      <Link href="/chat" className="underline hover:text-white">
                        inbox
                      </Link>
                      .
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">Starts a private, listing-linked conversation.</span>
                  )}
                  <button
                    type="submit"
                    disabled={!messageBody.trim()}
                    className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Description + specs */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <h2 className="mb-3 text-lg font-bold text-white">Description</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-300">
              {listing.description || 'No description provided for this listing.'}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">Specs</h2>
            <dl className="overflow-hidden rounded-2xl border border-game-border">
              {(listing.attributes ?? []).map((attr, index) => (
                <div
                  key={attr.id}
                  className={`flex items-center justify-between px-4 py-3 text-sm ${
                    index % 2 === 0 ? 'bg-game-card/60' : 'bg-game-card/30'
                  }`}
                >
                  <dt className="font-medium capitalize text-gray-400">{attr.attribute_key.replace(/_/g, ' ')}</dt>
                  <dd className="font-bold text-gray-100">{attr.attribute_value}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between bg-game-card/30 px-4 py-3 text-sm">
                <dt className="font-medium text-gray-400">Listed</dt>
                <dd className="flex items-center gap-1 font-bold text-gray-100">
                  <Clock className="h-3.5 w-3.5 text-gray-500" />
                  {timeAgo(listing.created_at)}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Public Q&A */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-white">
            Public Q&amp;A <span className="text-sm font-semibold text-gray-500">({comments.length})</span>
          </h2>

          <form onSubmit={handleAddComment} className="mb-6 flex items-start gap-3">
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-game-border bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentUser.avatar_url} alt={currentUser.username} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ask a public question about this item..."
                className="w-full rounded-xl border border-game-border bg-game-card/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Post
            </button>
          </form>

          <div className="space-y-4">
            {comments.length === 0 && (
              <p className="rounded-xl border border-dashed border-game-border bg-game-card/30 px-4 py-6 text-center text-sm text-gray-500">
                No questions yet. Be the first to ask.
              </p>
            )}
            {comments.map((comment) => {
              const author = comment.user;
              const isSeller = author?.id === seller?.id;
              return (
                <div key={comment.id} className="flex items-start gap-3">
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-game-border bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={author?.avatar_url} alt={author?.username ?? 'user'} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 rounded-xl border border-game-border bg-game-card/60 px-4 py-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{author?.username ?? 'Unknown'}</span>
                      {isSeller && (
                        <span className="rounded bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-blue-300">
                          Seller
                        </span>
                      )}
                      <span className="text-[11px] text-gray-500">{timeAgo(comment.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-300">{comment.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Related listings */}
        {relatedListings.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-lg font-bold text-white">More in {listing.category?.name}</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedListings.map((related) => (
                <ListingCard key={related.id} listing={related} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
