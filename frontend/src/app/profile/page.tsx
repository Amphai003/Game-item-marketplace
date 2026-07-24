"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import ProfileView from '../../components/ProfileView';
import { currentUser } from '../../mocks/data';

export default function MyProfilePage() {
  return (
    <div className="min-h-screen bg-game-dark text-gray-100">
      <Navbar />
      <ProfileView user={currentUser} isOwn />
    </div>
  );
}
