"use client";

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { addListing, mockCategories, mockUsers } from '../../mocks/data';

export default function CreateListingPage() {
  const router = useRouter();
  const currentUser = mockUsers[4] ?? mockUsers[0];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(mockCategories[0]?.id || '');
  const [rarity, setRarity] = useState('Common');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('Gold');
  const [quantity, setQuantity] = useState(1);
  const [serverRegion, setServerRegion] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const category = useMemo(
    () => mockCategories.find((item) => item.id === categoryId) ?? mockCategories[0],
    [categoryId]
  );

  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
  const validImages = useMemo(() => imageFiles.map((f) => URL.createObjectURL(f)), [imageFiles]);
  const canSubmit = title.trim().length > 0 && price.trim().length > 0 && serverRegion.trim().length > 0;

  useEffect(() => {
    return () => {
      // revoke object URLs on unmount
      validImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [validImages]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImageFiles((current) => {
      const combined = [...current, ...files].slice(0, 8);
      return combined;
    });
    // reset input so same file can be picked again if needed
    e.currentTarget.value = '';
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((current) => {
      const next = current.slice();
      next.splice(index, 1);
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const newListingId = `list-${Date.now()}`;
    const newListing = {
      id: newListingId,
      seller_id: currentUser.id,
      category_id: categoryId,
      title: title.trim(),
      description: description.trim() || undefined,
      price: Number(price),
      currency: currency.trim() || 'Gold',
      quantity,
      status: 'active' as const,
      server_region: serverRegion.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seller: currentUser,
      category,
      attributes: [
        { id: `${newListingId}-attr-rarity`, listing_id: newListingId, attribute_key: 'rarity', attribute_value: rarity },
      ],
      images: validImages.map((url, idx) => ({
        id: `${newListingId}-img-${idx}`,
        listing_id: newListingId,
        url,
        sort_order: idx,
      })),
    };

    addListing(newListing);
    setIsSubmitted(true);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-game-dark text-gray-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-game-border bg-game-card/90 p-6 shadow-glow-common">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-400 font-bold">Sell Item</p>
              <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">Create your item listing</h1>
              <p className="mt-3 max-w-2xl text-sm text-gray-400 sm:text-base">
                Add a title, set your price, attach a few images, and publish your in-game loot in seconds.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-bold text-blue-200 transition hover:bg-blue-500/20"
            >
              Back to Browse
            </Link>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.25fr_0.9fr]">
          <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-game-border bg-game-card/90 p-6 shadow-glow-common">
            <div className="grid gap-6 lg:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-gray-300">Item Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Celestial Thunderblade"
                  className="w-full rounded-2xl border border-game-border bg-game-dark/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-gray-300">Category</span>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-2xl border border-game-border bg-game-dark/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                >
                  {mockCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-gray-300">Price</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="w-2/3 rounded-2xl border border-game-border bg-game-dark/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-1/3 rounded-2xl border border-game-border bg-game-dark/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-gray-300">Quantity</span>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded-2xl border border-game-border bg-game-dark/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="space-y-2 lg:col-span-2">
                <span className="text-sm font-semibold text-gray-300">Description</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Describe the item's stats, condition, server, and any bonuses."
                  className="w-full rounded-3xl border border-game-border bg-game-dark/80 px-4 py-4 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-gray-300">Rarity</span>
                <select
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value)}
                  className="w-full rounded-2xl border border-game-border bg-game-dark/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                >
                  {rarities.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-gray-300">Server / Region</span>
                <input
                  value={serverRegion}
                  onChange={(e) => setServerRegion(e.target.value)}
                  placeholder="US-East (PVP), EU-Gehennas, Global Realm"
                  className="w-full rounded-2xl border border-game-border bg-game-dark/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-300">Images</p>
                  <p className="text-xs text-gray-500">Take photos or pick from your device (up to 8).</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={imageFiles.length >= 8}
                  >
                    Add Image
                  </button>
                  <span className="text-xs text-gray-400">{imageFiles.length}/8</span>
                </div>
              </div>

              <div className="space-y-3">
                {imageFiles.length === 0 && (
                  <div className="text-sm text-gray-500">No images added yet. Click “Add Image” to take a photo.</div>
                )}

                {imageFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-16 w-16 relative rounded-md overflow-hidden border border-game-border">
                      <Image src={validImages[index]} alt={file.name} fill sizes="64px" className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{file.name}</div>
                      <div className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-3xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-4 text-sm font-bold text-white shadow-glow-rare transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canSubmit}
            >
              {isSubmitted ? 'Listing Ready' : 'Post Your Item'}
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-game-border bg-game-card/90 p-6 shadow-glow-common">
              <h2 className="text-lg font-bold text-white">Listing Preview</h2>
              <p className="mt-2 text-sm text-gray-400">
                See a quick preview of your item before you post it.
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-3xl border border-game-border bg-game-dark/80 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Category</p>
                  <p className="mt-2 text-sm text-white">{category?.name}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-game-border bg-game-dark/80 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Price</p>
                    <p className="mt-2 text-sm text-white">{price || '0'} {currency}</p>
                  </div>
                  <div className="rounded-3xl border border-game-border bg-game-dark/80 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Qty</p>
                    <p className="mt-2 text-sm text-white">{quantity}</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-game-border bg-game-dark/80 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Rarity</p>
                  <p className="mt-2 text-sm text-white">{rarity}</p>
                </div>

                <div className="rounded-3xl border border-game-border bg-game-dark/80 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Server / Region</p>
                  <p className="mt-2 text-sm text-white">{serverRegion || 'Not set'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-game-border bg-game-card/90 p-6 shadow-glow-common">
              <h2 className="text-lg font-bold text-white">Image Gallery</h2>
              <p className="mt-2 text-sm text-gray-400">
                Upload URLs or add screenshots. The preview shows the first 4 images.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {validImages.slice(0, 4).map((url, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-3xl border border-game-border bg-gray-950">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 160px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
                {validImages.length === 0 && (
                  <div className="col-span-2 rounded-3xl border border-dashed border-game-border/50 bg-game-dark/80 p-6 text-center text-sm text-gray-500">
                    Add image URLs above to preview your listing.
                  </div>
                )}
              </div>

              {validImages.length > 4 && (
                <p className="mt-3 text-xs text-gray-400">+{validImages.length - 4} more image(s) will be included.</p>
              )}
            </div>

            {isSubmitted && (
              <div className="rounded-3xl border border-green-500/40 bg-emerald-500/10 p-5 text-sm text-emerald-200">
                <p className="font-semibold">Your item is ready to publish.</p>
                <p className="mt-2 text-gray-300">
                  This demo form stores the listing locally and shows your chosen details in the preview.
                </p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
