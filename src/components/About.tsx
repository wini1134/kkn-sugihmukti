import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, UserCheck, Calendar, MapPin, Quote, Sparkles, Camera } from 'lucide-react';
import { ABOUT_INFO } from '../data/mockData';
import { useAdmin } from '../context/AdminContext';
import { compressImageFile, usePersistentState } from '../utils/imageStorage';

export const About: React.FC = () => {
  const { isAdmin } = useAdmin();
  const DEFAULT_ABOUT_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoOoeKV3HTgDJ8wVdf8nbwbkUwwUi5tvXTfXETCcUu8l2JXQbxcyenkNGe1EQLu2CJ6ZenbZ08UelXd90WpU9SpvDnomUD77Qs-vmISWck99cAXhLFoQ3CnEVgSu6DWejRKqmuAFw50bxsgqpesjIqXuDndGY_S6evv7r6ieREt4SmOXTdHUni39RjwbW0rlEVwED1S1mOEvREsiBr_6CxRdg7jtsEimNpbQe6kgURGb0yeis5I8nRZBLQIygOm4srVW3yjG6_xXIb';

  const [aboutImg, setAboutImg] = usePersistentState<string>('kkn_about_img', DEFAULT_ABOUT_IMG);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1200, 1200, 0.78);
        setAboutImg(compressed);
      } catch (err) {
        console.error('Failed to compress about photo', err);
      }
    }
  };

  return (
    <section id="about" className="py-20 md:py-28 bg-[#f8f9fa] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image & Floating Quote */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative group"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img
                src={aboutImg}
                alt="Desa Sugihmukti & Tim KKN"
                className="w-full h-[420px] sm:h-[480px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Upload Photo Button Top Right (Admin Only) */}
              {isAdmin && (
                <label
                  title="Ganti Gambar Ini Dengan Foto Kita"
                  className="absolute top-4 right-4 z-20 px-3.5 py-2 bg-white/90 hover:bg-white text-[#012d1d] text-xs font-bold rounded-full shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105 border border-gray-100"
                >
                  <Camera className="w-4 h-4 text-[#1b4332]" />
                  <span>Ganti Foto KKN Kita</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}

              {/* Floating Quote Card */}
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/95 backdrop-blur-md rounded-2xl memoir-shadow text-[#191c1d] border border-white/40">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#c1ecd4] rounded-xl text-[#002114] shrink-0">
                    <Quote className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium italic text-[#012d1d]">
                      "{ABOUT_INFO.heroQuote}"
                    </p>
                    <span className="text-[11px] font-bold text-[#1b4332] mt-1 block">
                      — Tim KKN Sugihmukti 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#c1ecd4]/50 rounded-3xl -z-10 blur-xl" />
          </motion.div>

          {/* Right Column: Text Content & Metadata Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Tag */}
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#1b4332]" />
              <span className="text-xs font-bold text-[#1b4332] uppercase tracking-widest">
                Harmoni di Sugihmukti
              </span>
            </div>

            {/* Main Title */}
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#012d1d] tracking-tight leading-tight mb-6">
              Mengabdi dengan Hati, <br />
              <span className="text-[#1b4332]">Membangun Bersama Warga</span>
            </h2>

            {/* Story Paragraphs */}
            <div className="space-y-4 text-[#414844] text-base leading-relaxed mb-8">
              <p>
                Terletak di kaki pegunungan hijau Kecamatan Pasirjambu, Kabupaten Bandung,
                Desa Sugihmukti menyimpan kekayaan alam dan budaya lokal yang luar biasa. Kuliah
                Kerja Nyata (KKN) Sugihmukti 2026 lahir dari tekad untuk menyinergikan ilmu
                akademik dengan kebutuhan nyata masyarakat.
              </p>
              <p>
                Selama pengabdian (29 Juni - 29 Juli 2026), 15 mahasiswa dari berbagai latar belakang keilmuan bersama 1 Dosen Pembimbing Lapangan
                fokus pada empat pilar pemberdayaan: digitalisasi UMKM, penguatan sarana
                literasi anak, pemberdayaan masyarakat, serta pertanian berkelanjutan.
              </p>
            </div>

            {/* Metadata Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-gray-100 memoir-shadow flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#c1ecd4] text-[#002114] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-[#414844] uppercase tracking-wider block">
                    Universitas
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#012d1d]">
                    {ABOUT_INFO.universitas}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-100 memoir-shadow flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#cde5ff] text-[#001d32] flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-[#414844] uppercase tracking-wider block">
                    Dosen Pembimbing
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#012d1d]">
                    {ABOUT_INFO.dosenPembimbing}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-100 memoir-shadow flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#dbe7cd] text-[#192312] flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-[#414844] uppercase tracking-wider block">
                    Durasi Pengabdian
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#012d1d]">
                    {ABOUT_INFO.durasi}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-100 memoir-shadow flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#f3f4f5] text-[#1b4332] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-[#414844] uppercase tracking-wider block">
                    Lokasi
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#012d1d]">
                    {ABOUT_INFO.lokasi}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
