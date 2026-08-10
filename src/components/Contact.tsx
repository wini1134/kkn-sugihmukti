import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Heart, MessageSquare, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';
import { GuestbookEntry } from '../types';
import { INITIAL_GUESTBOOK } from '../data/mockData';
import { usePersistentState } from '../utils/imageStorage';

export const Contact: React.FC = () => {
  const [entries, setEntries] = usePersistentState<GuestbookEntry[]>('kkn_guestbook_entries_v1', INITIAL_GUESTBOOK);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Warga Sugihmukti');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      name: name.trim(),
      status: status,
      message: message.trim(),
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      likes: 1,
    };

    setEntries([newEntry, ...entries]);
    setName('');
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleLike = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, likes: e.likes + 1 } : e))
    );
  };

  return (
    <section id="guestbook" className="py-20 md:py-28 bg-[#f8f9fa] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c1ecd4] text-[#002114] text-xs font-bold uppercase tracking-wider mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            BUKU TAMU DIGITAL
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#012d1d] tracking-tight mb-4">
            Tinggalkan Pesan & Kesan
          </h2>
          <p className="text-[#414844] text-base leading-relaxed">
            Sampaikan salam hangat, kenangan, atau doa terbaik Anda bagi keberlanjutan karya pengabdian di Desa Sugihmukti.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 memoir-shadow border border-gray-100">
            <h3 className="font-heading font-bold text-xl text-[#012d1d] mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1b4332]" />
              Tulis Pesan Baru
            </h3>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-6 bg-[#e9f5db] border border-[#a5d0b9] text-[#151e0f] rounded-2xl text-xs font-semibold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#1b4332]" />
                Pesan Anda berhasil dikirim ke Buku Tamu Sugihmukti!
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#012d1d] uppercase tracking-wider mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pak Suganda / Rina"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl text-sm font-medium text-[#191c1d] focus:outline-none focus:border-[#1b4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#012d1d] uppercase tracking-wider mb-2">
                  Status / Asal *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl text-sm font-medium text-[#191c1d] focus:outline-none focus:border-[#1b4332]"
                >
                  <option value="Warga Sugihmukti">Warga Sugihmukti</option>
                  <option value="Alumni KKN">Alumni KKN</option>
                  <option value="Pengunjung Website">Pengunjung Website</option>
                  <option value="Mahasiswa / Dosen">Mahasiswa / Dosen</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#012d1d] uppercase tracking-wider mb-2">
                  Pesan & Kesan *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan ucapan, kesan, atau doa Anda..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl text-sm font-medium text-[#191c1d] focus:outline-none focus:border-[#1b4332] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#012d1d] text-white font-bold text-sm rounded-xl hover:bg-[#1b4332] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Kiriman Pesan Buku Tamu
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Live Guestbook Feed */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-heading font-bold text-xl text-[#012d1d] mb-4 flex items-center justify-between">
              <span>Buku Tamu Terbaru</span>
              <span className="text-xs font-normal text-[#414844]">
                Total: {entries.length} Pesan
              </span>
            </h3>

            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
              {entries.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl memoir-shadow border border-gray-100 text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-[#e8f5e9] text-[#1b4332] flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-7 h-7" />
                  </div>
                  <h4 className="font-heading font-bold text-lg text-[#012d1d] mb-2">
                    Buku Tamu Masih Kosong
                  </h4>
                  <p className="text-xs sm:text-sm text-[#414844] max-w-sm mx-auto leading-relaxed">
                    Belum ada ucapan yang ditulis. Jadilah orang pertama yang meninggalkan salam hangat, masukan, atau doa untuk KKN Sugihmukti!
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-white p-6 rounded-2xl memoir-shadow border border-gray-100 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-heading font-bold text-base text-[#012d1d]">
                            {entry.name}
                          </h4>
                          <span className="text-[10px] font-semibold text-[#414844] px-2.5 py-0.5 bg-[#f3f4f5] rounded-full">
                            {entry.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#414844] leading-relaxed mb-4">
                          "{entry.message}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#414844] pt-3 border-t border-gray-100">
                        <span>{entry.date}</span>
                        <button
                          onClick={() => handleLike(entry.id)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-[#f8f9fa] hover:bg-[#ffe5e5] text-[#d90429] rounded-full text-xs font-bold transition-colors"
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                          <span>{entry.likes} Suka</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
