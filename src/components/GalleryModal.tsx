import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Edit3, Image as ImageIcon, Camera, Plus } from 'lucide-react';
import { GalleryItem } from '../types';
import { compressImageFile } from '../utils/imageStorage';

interface GalleryModalProps {
  isOpen: boolean;
  editingItem: GalleryItem | null;
  onClose: () => void;
  onSave: (item: GalleryItem) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  editingItem,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Kebersamaan');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState('');

  const categories = ['Kebersamaan', 'Behind The Scene', 'Penutupan', 'Program Kerja'];

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setCategory(editingItem.category);
      setCaption(editingItem.caption);
      setDate(editingItem.date || '');
      setImage(editingItem.image);
    } else {
      setTitle('');
      setCategory('Kebersamaan');
      setCaption('');
      setDate(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
      setImage('https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80');
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1200, 1200, 0.8);
        setImage(compressed);
      } catch (err) {
        console.error('Failed to compress image', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !caption.trim()) return;

    const itemData: GalleryItem = {
      id: editingItem ? editingItem.id : `gal-${Date.now()}`,
      title: title.trim(),
      category: category as any,
      caption: caption.trim(),
      date: date.trim() || 'Desa Sugihmukti',
      image: image || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    };

    onSave(itemData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-gray-100 my-8"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-[#f3f4f5] text-[#414844] hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#e8f5e9] rounded-2xl text-[#1b4332]">
            {editingItem ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-xl text-[#012d1d]">
              {editingItem ? 'Edit Foto Kenangan' : 'Tambah Foto Kenangan Baru'}
            </h3>
            <p className="text-xs text-[#414844]">
              {editingItem ? 'Ubah judul, caption, tanggal, atau foto galeri' : 'Tambahkan dokumentasi momen baru ke Galeri'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Preview & File Upload */}
          <div className="flex items-center gap-4 p-4 bg-[#f8f9fa] rounded-2xl border border-gray-100">
            <img
              src={image}
              alt="Preview"
              className="w-24 h-20 rounded-2xl object-cover border-2 border-[#1b4332] shadow-sm"
            />
            <div className="flex-1">
              <label className="block text-xs font-bold text-[#012d1d] mb-1">Foto Dokumentasi</label>
              <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#012d1d] hover:bg-[#1b4332] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs">
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Foto Baru</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#012d1d] mb-1">Judul Momen / Foto *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Senyum Kebersamaan di Posko"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#012d1d] mb-1">Kategori Galeri</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332] bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#012d1d] mb-1">Tanggal / Lokasi</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Contoh: 15 Juli 2026 / Posko Kp. Kaca Kaca"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>
          </div>

          {/* Caption / Description */}
          <div>
            <label className="block text-xs font-bold text-[#012d1d] mb-1">Keterangan / Caption Teks *</label>
            <textarea
              required
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tuliskan cerita singkat atau kenangan di balik foto ini..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332] resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-100 text-[#414844] text-xs font-bold hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#012d1d] text-white text-xs font-bold hover:bg-[#1b4332] transition-colors shadow-sm"
            >
              {editingItem ? 'Simpan Perubahan' : 'Tambah Kenangan'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
