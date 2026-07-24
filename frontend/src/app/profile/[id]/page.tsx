"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { UserX } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import ProfileView from '../../../components/ProfileView';
import { getUserById, currentUser } from '../../../mocks/data';

export default function SellerProfilePage() {
  const params = useParams<{ id: string }>();
  const user = getUserById(params.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-game-dark text-gray-100">
        <Navbar />
        <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-game-border bg-game-card text-gray-500">
            <UserX className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Trader not found</h1>
          <p className="mb-8 max-w-md text-sm text-gray-400">This profile does not exist or has been removed.</p>
          <Link href="/" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500">
            Back to Browse
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-dark text-gray-100">
      <Navbar />
      <ProfileView user={user} isOwn={user.id === currentUser.id} />
    </div>
  );
}
