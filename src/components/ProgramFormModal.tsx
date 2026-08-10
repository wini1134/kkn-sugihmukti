import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Edit3, Image as ImageIcon, CheckCircle2, Upload } from 'lucide-react';
import { Program, ProgramCategory } from '../types';
import { compressImageFile } from '../utils/imageStorage';

interface ProgramFormModalProps {
  isOpen: boolean;
  editingProgram: Program | null;
  onClose: () => void;
  onSave: (program: Program) => void;
}

export const ProgramFormModal: React.FC<ProgramFormModalProps> = ({
  isOpen,
  editingProgram,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProgramCategory>('Edukasi');
  const [tag, setTag] = useState('EDUKASI & SOSIAL');
  const [description, setDescription] = useState('');
  const [impactReport, setImpactReport] = useState('');
  const [location, setLocation] = useState('RT 03 RW 02 Kp. Kaca Kaca');
  const [beneficiariesCount, setBeneficiariesCount] = useState<number>(50);
  const [image, setImage] = useState('');
  const [imageInputUrl, setImageInputUrl] = useState('');

  useEffect(() => {
    if (editingProgram) {
      setTitle(editingProgram.title);
      setCategory(editingProgram.category);
      setTag(editingProgram.tag);
      setDescription(editingProgram.description);
      setImpactReport(editingProgram.impactReport || '');
      setLocation(editingProgram.location || 'RT 03 RW 02 Kp. Kaca Kaca');
      setBeneficiariesCount(editingProgram.beneficiariesCount || 50);
      setImage(editingProgram.image);
    } else {
      // Reset form for new program
      setTitle('');
      setCategory('Edukasi');
      setTag('EDUKASI & PENGABDIAN');
      setDescription('');
      setImpactReport('');
      setLocation('RT 03 RW 02 Kp. Kaca Kaca');
      setBeneficiariesCount(50);
      setImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBTWBD35QXURKVGax62L7Ch4NKiConHjMagTKx2AJVFb8rJuLOGmxp_KrfhC4TKrb5SivKtAnm-cKq81PXvIJYMykfBu5ZesrXksk-SQx1JlPW2xFalU57uQOCAPwkczkT9-7WAqEaXWaPR6SLhCQw9MBzik0E54Ul1CKhOi7VyMDIz0C90y78SU2v7tw7mjcgPt6bkjXiaMHYWKb6FTSbLzv_9502RpEiF6qBvwiR4s6gwtP0evwJvGBTtk3YCtkzXA9VfGmmtTO3F');
    }
  }, [editingProgram, isOpen]);

  if (!isOpen) return null;

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1200, 1200, 0.78);
        setImage(compressed);
      } catch (err) {
        console.error('Failed to compress image file', err);
      }
    }
  };

  const handleApplyUrl = () => {
    if (imageInputUrl.trim()) {
      setImage(imageInputUrl.trim());
      setImageInputUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const programData: Program = {
      id: editingProgram ? editingProgram.id : `prog-${Date.now()}`,
      title: title.trim(),
      category: category,
      tag: tag.trim() || category.toUpperCase(),
      description: description.trim(),
      fullDescription: description.trim(),
      impactReport: impactReport.trim() || 'Program berhasil direalisasikan dengan antusiasme masyarakat Sugihmukti.',
      image: image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTWBD35QXURKVGax62L7Ch4NKiConHjMagTKx2AJVFb8rJuLOGmxp_KrfhC4TKrb5SivKtAnm-cKq81PXvIJYMykfBu5ZesrXksk-SQx1JlPW2xFalU57uQOCAPwkczkT9-7WAqEaXWaPR6SLhCQw9MBzik0E54Ul1CKhOi7VyMDIz0C90y78SU2v7tw7mjcgPt6bkjXiaMHYWKb6FTSbLzv_9502RpEiF6qBvwiR4s6gwtP0evwJvGBTtk3YCtkzXA9VfGmmtTO3F',
      location: location.trim(),
      beneficiariesCount: Number(beneficiariesCount) || 0,
      featured: editingProgram ? editingProgram.featured : false,
    };

    onSave(programData);
    onClose();
  };

  return (
    <AnimatePresence>
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
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-[#012d1d] text-white flex items-center justify-between shrink-0">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2">
              {editingProgram ? <Edit3 className="w-5 h-5 text-[#c1ecd4]" /> : <Plus className="w-5 h-5 text-[#c1ecd4]" />}
              {editingProgram ? 'Edit Judul & Data Program Kerja' : 'Tambah Program Kerja Baru'}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-[#012d1d] uppercase mb-1">
                Judul Program Kerja *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Bimbingan Belajar & Rumah Baca Kp. Kaca Kaca"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1b4332]"
              />
            </div>

            {/* Category & Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#012d1d] uppercase mb-1">
                  Kategori Program *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProgramCategory)}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1b4332]"
                >
                  <option value="Edukasi">Edukasi</option>
                  <option value="Digital">Digital</option>
                  <option value="Lingkungan">Lingkungan</option>
                  <option value="Sosial">Sosial</option>
                  <option value="Infrastruktur">Infrastruktur</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#012d1d] uppercase mb-1">
                  Label Tag
                </label>
                <input
                  type="text"
                  placeholder="EDUKASI & LITERASI"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1b4332]"
                />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-bold text-[#012d1d] uppercase mb-1">
                Deskripsi Program Kerja *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Penjelasan deskripsi program kerja..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#1b4332] resize-none"
              />
            </div>

            {/* Impact Report */}
            <div>
              <label className="block text-xs font-bold text-[#012d1d] uppercase mb-1">
                Laporan Hasil & Impact Report
              </label>
              <input
                type="text"
                placeholder="Meningkatkan partisipasi 50+ warga dalam program..."
                value={impactReport}
                onChange={(e) => setImpactReport(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#1b4332]"
              />
            </div>

            {/* Location & Beneficiaries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#012d1d] uppercase mb-1">
                  Lokasi Realisasi
                </label>
                <input
                  type="text"
                  placeholder="RT 03 RW 02 Kp. Kaca Kaca"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#1b4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#012d1d] uppercase mb-1">
                  Penerima Manfaat (Warga)
                </label>
                <input
                  type="number"
                  min={1}
                  value={beneficiariesCount}
                  onChange={(e) => setBeneficiariesCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#1b4332]"
                />
              </div>
            </div>

            {/* Program Image Preview & Upload */}
            <div>
              <label className="block text-xs font-bold text-[#012d1d] uppercase mb-1">
                Foto Dokumentasi Program
              </label>

              {image && (
                <div className="relative h-40 w-full mb-3 rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="w-full sm:w-auto text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#012d1d] file:text-white hover:file:bg-[#1b4332]"
                />

                <div className="flex gap-2 w-full sm:flex-1">
                  <input
                    type="url"
                    placeholder="Atau tempel URL gambar (https://...)"
                    value={imageInputUrl}
                    onChange={(e) => setImageInputUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-1.5 bg-gray-200 text-[#012d1d] text-xs font-bold rounded-xl hover:bg-gray-300"
                  >
                    Gunakan
                  </button>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#012d1d] text-white text-xs font-bold hover:bg-[#1b4332] shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#c1ecd4]" />
                Simpan Program Kerja
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
