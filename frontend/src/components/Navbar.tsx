"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, MessageSquare, PlusCircle, User, Bell, Coins, Menu, X } from 'lucide-react';
import { mockUsers } from '../mocks/data';

interface NavbarProps {
  onSearchChange?: (val: string) => void;
  searchValue?: string;
}

export default function Navbar({ onSearchChange, searchValue }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = mockUsers[4]; // mock current user

  const navLinks = [
    { href: '/', label: 'Browse Items', icon: Shield },
    { href: '/chat', label: 'Inbox', icon: MessageSquare, badge: 2 },
    { href: '/create', label: 'Sell Item', icon: PlusCircle },
    { href: '/profile', label: 'My Inventory', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-game-border glass-panel">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 focus:ring-2 focus:ring-blue-500 rounded p-1">
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 bg-clip-text text-xl font-black tracking-widest text-transparent uppercase sm:text-2xl">
              LootMarket
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-game-border text-white shadow-glow-rare border border-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-game-border/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions (Wallet, Notifications, Profile) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Mock Balance */}
            <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 text-sm font-semibold text-amber-400 shadow-glow-gold">
              <Coins className="h-4 w-4 animate-spin-slow" />
              <span>4,250 Gold</span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-full border border-game-border text-gray-400 hover:text-white hover:bg-game-border/50 transition-colors" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500"></span>
            </button>

            {/* User Profile */}
            <Link href="/profile" className="flex items-center gap-2 focus:ring-2 focus:ring-blue-500 rounded p-1 hover:opacity-90">
              <div className="h-8 w-8 rounded-full border-2 border-orange-500/50 overflow-hidden bg-gray-800">
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.username}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-sm font-semibold text-gray-300 hidden lg:inline">{currentUser.username}</span>
            </Link>
          </div>

          {/* Mobile Menu & Action Buttons */}
          <div className="flex md:hidden items-center gap-2">
            {/* Wallet for Mobile */}
            <div className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
              <Coins className="h-3 w-3" />
              <span>4.2k</span>
            </div>

            {/* Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md border border-game-border text-gray-400 hover:text-white hover:bg-game-border transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-game-border bg-game-dark/95 backdrop-blur-md animate-slide-down">
          <div className="space-y-1 px-2 pb-4 pt-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-game-border text-white border-l-4 border-blue-500'
                      : 'text-gray-400 hover:text-white hover:bg-game-border/30'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="border-t border-game-border pt-4 mt-4 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-gray-700 overflow-hidden bg-gray-800">
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.username}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{currentUser.username}</div>
                  <div className="text-xs text-gray-500">Rating: ★ {currentUser.rating_avg.toFixed(1)}</div>
                </div>
              </div>
              <button className="relative p-2 rounded-full border border-game-border text-gray-400 hover:text-white" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-orange-500"></span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
