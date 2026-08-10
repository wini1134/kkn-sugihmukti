import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Image as ImageIcon,
  Calendar,
  MapPin,
  Heart,
  Maximize2,
  Sparkles,
  Camera,
  Upload,
  Edit3,
  Trash2,
  Plus
} from 'lucide-react';
import { GalleryItem } from '../types';
import {
  GALLERY_ITEMS,
  POLAROID_MEMORIES
} from '../data/mockData';
import { ImageLightbox } from './ImageLightbox';
import { GalleryModal } from './GalleryModal';
import { useAdmin } from '../context/AdminContext';
import { compressImageFile, usePersistentState } from '../utils/imageStorage';

export const Gallery: React.FC = () => {
  const { isAdmin } = useAdmin();
  // Persistent state for gallery items and polaroids with IndexedDB backing
  const [items, setItems] = usePersistentState<GalleryItem[]>('kkn_gallery_items_v1', GALLERY_ITEMS);
  const [polaroids, setPolaroids] = usePersistentState('kkn_polaroids_v1', POLAROID_MEMORIES);

  const [selectedCategory, setSelectedCategory] = useState<string>('Kebersamaan');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  // CRUD modal state
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);

  // Polaroid title edit state
  const [editingPolaroidId, setEditingPolaroidId] = useState<string | null>(null);
  const [editingPolaroidTitle, setEditingPolaroidTitle] = useState('');

  const categories = ['Kebersamaan', 'Behind The Scene', 'Penutupan'];

  const handleGalleryPhotoUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1200, 1200, 0.78);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, image: compressed } : item))
        );
      } catch (err) {
        console.error('Failed to compress gallery photo', err);
      }
    }
  };

  const handlePolaroidPhotoUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1000, 1000, 0.78);
        setPolaroids((prev) =>
          prev.map((pol) => (pol.id === id ? { ...pol, image: compressed } : pol))
        );
      } catch (err) {
        console.error('Failed to compress polaroid photo', err);
      }
    }
  };

  const handleSaveGalleryItem = (savedItem: GalleryItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === savedItem.id);
      if (exists) {
        return prev.map((i) => (i.id === savedItem.id ? savedItem : i));
      } else {
        return [savedItem, ...prev];
      }
    });
  };

  const handleDeleteGalleryItem = () => {
    if (!itemToDelete) return;
    setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    setItemToDelete(null);
  };

  const handleSavePolaroidTitle = (id: string) => {
    if (!editingPolaroidTitle.trim()) {
      setEditingPolaroidId(null);
      return;
    }
    setPolaroids((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: editingPolaroidTitle.trim() } : p))
    );
    setEditingPolaroidId(null);
  };

  const filteredGallery = items.filter((item) => {
    if (selectedCategory === 'Semua') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="gallery" className="py-20 md:py-28 bg-[#f8f9fa] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dbe7cd] text-[#192312] text-xs font-bold uppercase tracking-wider mb-4">
            <ImageIcon className="w-3.5 h-3.5" />
            GALERI & KENANGAN
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#012d1d] tracking-tight mb-4">
            Memory Wall & Dokumentasi
          </h2>
          <p className="text-[#414844] text-base leading-relaxed mb-6">
            Kumpulan potret tulus & cuplikan tawa perjalanan 30 hari bersama warga Desa Sugihmukti.
          </p>

          {/* Add Photo Button (Admin Only) */}
          {isAdmin && (
            <button
              onClick={() => {
                setEditingGalleryItem(null);
                setIsGalleryModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#012d1d] hover:bg-[#1b4332] text-white text-sm font-bold rounded-2xl shadow-md transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kenangan / Foto Baru</span>
            </button>
          )}
        </div>

        {/* POLAROID MEMORY WALL (Tilted Cards Row) */}
        <div className="mb-20 bg-white rounded-3xl p-8 sm:p-12 memoir-shadow border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#012d1d] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1b4332]" />
              Polaroid Memory Wall
            </h3>
            <span className="text-xs text-[#414844] font-medium bg-[#f3f4f5] px-3.5 py-1.5 rounded-full inline-block">
              {isAdmin
                ? '💡 Klik teks judul atau ikon pensil untuk mengubah tulisan polaroid'
                : '💡 Momen berkesan KKN Desa Sugihmukti'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {polaroids.map((pol) => (
              <motion.div
                key={pol.id}
                whileHover={{ scale: 1.05, rotate: 0 }}
                className={`bg-white p-4 pb-6 rounded-xl shadow-md border border-gray-200/80 transition-transform duration-300 polaroid-hover relative group ${pol.rotateClass}`}
              >
                {/* Photo Container */}
                <div
                  onClick={() => {
                    const match = items.find((g) => g.title.includes(pol.title)) || items[0];
                    if (match) setActiveLightboxItem(match);
                  }}
                  className="aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-gray-100 cursor-pointer relative"
                >
                  <img
                    src={pol.image}
                    alt={pol.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Upload Button overlay (Admin Only) */}
                  {isAdmin && (
                    <label
                      onClick={(e) => e.stopPropagation()}
                      title="Ganti Foto Polaroid Ini"
                      className="absolute top-2 right-2 p-2 bg-white/95 hover:bg-white text-[#012d1d] rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                    >
                      <Camera className="w-4 h-4 text-[#012d1d]" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePolaroidPhotoUpload(pol.id, e)}
                      />
                    </label>
                  )}
                </div>

                {isAdmin && editingPolaroidId === pol.id ? (
                  <div className="flex items-center gap-1.5 mt-2 bg-[#f8f9fa] p-1.5 rounded-lg border border-[#1b4332]">
                    <input
                      type="text"
                      autoFocus
                      value={editingPolaroidTitle}
                      onChange={(e) => setEditingPolaroidTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSavePolaroidTitle(pol.id);
                        if (e.key === 'Escape') setEditingPolaroidId(null);
                      }}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded font-bold text-center text-[#012d1d] focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
                    />
                    <button
                      onClick={() => handleSavePolaroidTitle(pol.id)}
                      className="px-2.5 py-1 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded text-xs font-bold whitespace-nowrap shadow-xs"
                    >
                      Simpan
                    </button>
                  </div>
                ) : isAdmin ? (
                  <div className="flex items-center justify-center gap-2 text-center font-heading font-bold text-sm text-[#012d1d] pt-1">
                    <span
                      onClick={() => {
                        setEditingPolaroidId(pol.id);
                        setEditingPolaroidTitle(pol.title);
                      }}
                      className="cursor-pointer hover:underline hover:text-[#1b4332]"
                      title="Klik untuk ubah teks judul"
                    >
                      "{pol.title}"
                    </span>
                    <button
                      onClick={() => {
                        setEditingPolaroidId(pol.id);
                        setEditingPolaroidTitle(pol.title);
                      }}
                      title="Edit Teks Polaroid"
                      className="p-1 hover:bg-gray-100 rounded text-[#1b4332] transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-center font-heading font-bold text-sm text-[#012d1d] pt-1">
                    <span>"{pol.title}"</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* PHOTO GALLERY FILTER TABS */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#012d1d] text-white shadow-xs'
                  : 'bg-white text-[#414844] hover:bg-[#e7e8e9] border border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PHOTO MASONRY / GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          <AnimatePresence mode="popLayout">
            {filteredGallery.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative h-72 rounded-3xl overflow-hidden memoir-shadow bg-gray-200"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                  onClick={() => setActiveLightboxItem(item)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity pointer-events-none" />

                {/* Top Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#012d1d] text-[10px] font-extrabold rounded-full uppercase">
                    {item.category}
                  </span>
                </div>

                {/* Action Controls Top Right */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                  {/* Edit & Delete Gallery Item (Admin Only) */}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          setEditingGalleryItem(item);
                          setIsGalleryModalOpen(true);
                        }}
                        className="p-2 bg-white/90 hover:bg-white text-[#012d1d] rounded-full shadow-md transition-transform hover:scale-110"
                        title="Edit Teks / Data Foto Ini"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full shadow-md transition-transform hover:scale-110"
                        title="Hapus Foto Kenangan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  {/* Zoom Icon Button */}
                  <button
                    onClick={() => setActiveLightboxItem(item)}
                    className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-transform hover:scale-110"
                    title="Perbesar Gambar"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom Caption Overlay */}
                <div
                  className="absolute bottom-4 left-4 right-4 text-white cursor-pointer"
                  onClick={() => setActiveLightboxItem(item)}
                >
                  <h4 className="font-heading font-bold text-base mb-1">{item.title}</h4>
                  <p className="text-xs text-white/80 line-clamp-2 mb-2">{item.caption}</p>
                  <div className="flex items-center gap-3 text-[10px] text-white/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox Popups */}
      <ImageLightbox
        item={activeLightboxItem}
        onClose={() => setActiveLightboxItem(null)}
      />

      {/* Gallery Item Add/Edit Modal */}
      <GalleryModal
        isOpen={isGalleryModalOpen}
        editingItem={editingGalleryItem}
        onClose={() => setIsGalleryModalOpen(false)}
        onSave={handleSaveGalleryItem}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setItemToDelete(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl z-10 border border-gray-100"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#012d1d] mb-2">
                Hapus Kenangan Ini?
              </h3>
              <p className="text-xs text-[#414844] mb-6 leading-relaxed">
                Apakah Anda yakin ingin menghapus foto <span className="font-bold">"{itemToDelete.title}"</span> dari galeri?
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setItemToDelete(null)}
                  className="px-4 py-2 bg-gray-100 text-[#414844] rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteGalleryItem}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
