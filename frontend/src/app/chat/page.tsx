"use client";

import React, { useMemo, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, MessageSquare, Package } from 'lucide-react';
import Navbar from '../../components/Navbar';
import {
  getConversationsForUser,
  getConversationById,
  addMessage,
  currentUser,
} from '../../mocks/data';
import { clockTime, timeAgo } from '../../lib/format';
import { Conversation, User } from '../../types';

function otherParty(conversation: Conversation): User | undefined {
  return conversation.buyer_id === currentUser.id ? conversation.seller : conversation.buyer;
}

export default function InboxPage() {
  const conversations = useMemo(() => getConversationsForUser(currentUser.id), []);
  const [activeId, setActiveId] = useState<string | null>(conversations[0]?.id ?? null);
  const [draft, setDraft] = useState('');
  // Bump to force re-render after mutating the shared mock conversation object.
  const [, setTick] = useState(0);

  const activeConversation = activeId ? getConversationById(activeId) : undefined;
  const messages = activeConversation?.messages ?? [];

  const threadRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeId, messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !activeConversation) return;
    addMessage(activeConversation.id, body);
    setDraft('');
    setTick((t) => t + 1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-game-dark text-gray-100">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-extrabold text-white">Inbox</h1>

        {conversations.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-game-border bg-game-card/30 py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-game-card border border-game-border text-gray-500">
              <MessageSquare className="h-7 w-7" />
            </div>
            <h2 className="mb-1 text-lg font-bold text-white">No conversations yet</h2>
            <p className="mb-6 max-w-sm text-sm text-gray-400">
              Message a seller from any listing and your chats will show up here.
            </p>
            <Link href="/" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500">
              Browse Items
            </Link>
          </div>
        ) : (
          <div className="grid flex-1 gap-4 overflow-hidden rounded-2xl border border-game-border bg-game-card/40 md:grid-cols-[320px_1fr]">
            {/* Conversation list */}
            <aside
              className={`flex flex-col border-game-border md:border-r ${
                activeId ? 'hidden md:flex' : 'flex'
              }`}
            >
              <div className="border-b border-game-border px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                {conversations.length} conversation{conversations.length === 1 ? '' : 's'}
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => {
                  const other = otherParty(conversation);
                  const last = conversation.messages?.[conversation.messages.length - 1];
                  const isActive = conversation.id === activeId;
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => setActiveId(conversation.id)}
                      className={`flex w-full items-center gap-3 border-b border-game-border/50 px-4 py-3 text-left transition ${
                        isActive ? 'bg-game-border/50' : 'hover:bg-game-border/25'
                      }`}
                    >
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-game-border bg-gray-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={other?.avatar_url} alt={other?.username ?? 'user'} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-bold text-white">{other?.username}</span>
                          {last && <span className="shrink-0 text-[10px] text-gray-500">{timeAgo(last.created_at)}</span>}
                        </div>
                        <p className="truncate text-xs text-gray-400">{last?.body ?? 'No messages yet'}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Active thread */}
            <section className={`flex-col ${activeId ? 'flex' : 'hidden md:flex'}`}>
              {activeConversation ? (
                <>
                  {/* Thread header */}
                  <div className="flex items-center gap-3 border-b border-game-border px-4 py-3">
                    <button
                      onClick={() => setActiveId(null)}
                      className="md:hidden rounded p-1 text-gray-400 hover:text-white"
                      aria-label="Back to conversations"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="h-9 w-9 overflow-hidden rounded-full border border-game-border bg-gray-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={otherParty(activeConversation)?.avatar_url}
                        alt={otherParty(activeConversation)?.username ?? 'user'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{otherParty(activeConversation)?.username}</p>
                      {activeConversation.listing && (
                        <Link
                          href={`/listing/${activeConversation.listing.id}`}
                          className="flex items-center gap-1 truncate text-xs text-blue-400 hover:underline"
                        >
                          <Package className="h-3 w-3" />
                          {activeConversation.listing.title}
                        </Link>
                      )}
                    </div>
                    {activeConversation.listing && (
                      <span className="hidden shrink-0 text-sm font-bold text-amber-400 sm:block">
                        {activeConversation.listing.price.toLocaleString()} {activeConversation.listing.currency}
                      </span>
                    )}
                  </div>

                  {/* Messages */}
                  <div ref={threadRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" style={{ maxHeight: '55vh' }}>
                    {messages.map((message) => {
                      const mine = message.sender_id === currentUser.id;
                      return (
                        <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                              mine
                                ? 'rounded-br-sm bg-blue-600 text-white'
                                : 'rounded-bl-sm border border-game-border bg-game-card text-gray-200'
                            }`}
                          >
                            <p className="leading-snug">{message.body}</p>
                            <span className={`mt-1 block text-[10px] ${mine ? 'text-blue-200/80' : 'text-gray-500'}`}>
                              {clockTime(message.created_at)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Composer */}
                  <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-game-border px-3 py-3">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-full border border-game-border bg-game-dark/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim()}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Send message"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
                  Select a conversation to start chatting.
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
