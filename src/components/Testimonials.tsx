import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, MessageSquareQuote, Plus, Trash2, X, Sparkles } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';
import { Testimonial } from '../types';
import { usePersistentState } from '../utils/imageStorage';
import { useAdmin } from '../context/AdminContext';

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = usePersistentState<Testimonial[]>('kkn_testimonials_v2', TESTIMONIALS);
  const { isAdmin } = useAdmin();

  // Modal State for Admin adding new testimonial
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [tag, setTag] = useState('WARGA DESA');
  const [quote, setQuote] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;

    const newItem: Testimonial = {
      id: `test-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Warga Desa Sugihmukti',
      tag: tag.trim().toUpperCase() || 'WARGA DESA',
      quote: quote.trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    };

    setTestimonials([newItem, ...testimonials]);
    setName('');
    setRole('');
    setQuote('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus entri suara warga ini?')) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f3f4f5] text-[#1b4332] text-xs font-bold uppercase tracking-wider mb-4">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            VOICE OF THE VILLAGE
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#012d1d] tracking-tight mb-4">
            Kesan & Pesan Suara Warga
          </h2>
          <p className="text-[#414844] text-base leading-relaxed mb-6">
            Tutur tulus dari pimpinan desa, tokoh masyarakat, dan warga tentang dampak kehadiran KKN Sugihmukti 2026.
          </p>

          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#012d1d] hover:bg-[#1b4332] text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Suara Warga</span>
            </button>
          )}
        </div>

        {/* Testimonials Content */}
        {testimonials.length === 0 ? (
          <div className="text-center py-16 px-6 bg-[#f8f9fa] rounded-3xl border border-dashed border-gray-200 max-w-xl mx-auto memoir-shadow">
            <MessageSquareQuote className="w-12 h-12 text-[#1b4332] opacity-30 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-lg text-[#012d1d] mb-1">
              Belum Ada Suara Warga
            </h3>
            <p className="text-xs text-[#414844] max-w-md mx-auto">
              Sampaikan kesan dan pesan Anda di bagian Buku Tamu Digital di bawah untuk ditampilkan di sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-[#f8f9fa] rounded-3xl p-8 memoir-shadow hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between relative group"
              >
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(test.id)}
                    className="absolute top-4 right-4 z-10 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                    title="Hapus Suara Warga"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="absolute top-6 right-6 text-[#c1ecd4] group-hover:text-[#1b4332] transition-colors pointer-events-none">
                  <Quote className="w-10 h-10 opacity-60" />
                </div>

                <div>
                  {/* Tag Badge */}
                  {test.tag && (
                    <span className="inline-block px-3 py-1 bg-white text-[#012d1d] text-[10px] font-bold rounded-full uppercase tracking-wider mb-6 border border-gray-100 shadow-2xs">
                      {test.tag}
                    </span>
                  )}

                  {/* Quote Text */}
                  <p className="text-[#191c1d] text-sm sm:text-base leading-relaxed italic mb-8 relative z-10">
                    "{test.quote}"
                  </p>
                </div>

                {/* Author Profile */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200/60">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#1b4332]"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-base text-[#012d1d]">
                      {test.name}
                    </h4>
                    <span className="text-xs text-[#414844] font-medium block">
                      {test.role}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Modal to Add Testimonial */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full memoir-shadow-lg relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <h3 className="font-heading font-bold text-xl text-[#012d1d] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#1b4332]" />
                  Tambah Suara Warga Baru
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTestimonial} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#012d1d] uppercase mb-1">
                    Nama Warga / Tokoh *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pak Suganda / Ibu Wiwin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#1b4332]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#012d1d] uppercase mb-1">
                      Jabatan / Peran
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Kepala Desa Sugihmukti"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#1b4332]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#012d1d] uppercase mb-1">
                      Kategori / Tag
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: PEMERINTAHAN DESA"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#1b4332]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#012d1d] uppercase mb-1">
                    Isi Kesan & Pesan / Kutipan *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tuliskan ucapan atau masukan warga..."
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#1b4332] resize-none"
                  />
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#012d1d] hover:bg-[#1b4332] text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
