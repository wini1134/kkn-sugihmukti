import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Image as ImageIcon, MapPin, Users, Camera, Check } from 'lucide-react';
import { HERO_STATS, ABOUT_INFO } from '../data/mockData';
import { useAdmin } from '../context/AdminContext';
import { compressImageFile, usePersistentState } from '../utils/imageStorage';

export const Hero: React.FC = () => {
  const { isAdmin } = useAdmin();
  const DEFAULT_HERO_BG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRVtQaEuzp327AQOowr2NM_cWRTLDE76_6SD1lkUamvyU5c7aVIIMuswpczgfKl-Pz_v3_EcgF93WfIZkKESuHIA88ns5Ztm0qdRQVkUASnPdz1Yynpg3F67SA8MPj1DpV1iZ_tTmbKJOTI7DfBeaQ1HgAIIj7G3TjQeRGEwyUYK-BmiTbdfcxuNcNLCD7KsXtvHJXRz5d0jkU1UufZ_OYE7rSXA3agGwpkHOk9V65roeMhclGkKgJla3l7E5RWE03mw7farFaOQQP';
  
  const [heroBg, setHeroBg] = usePersistentState<string>('kkn_hero_bg', DEFAULT_HERO_BG);
  const [isEditingBg, setIsEditingBg] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1600, 1200, 0.78);
        setHeroBg(compressed);
        showSavedFeedback();
      } catch (err) {
        console.error('Failed to save compressed image', err);
      }
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      const url = inputUrl.trim();
      setHeroBg(url);
      setInputUrl('');
      showSavedFeedback();
    }
  };

  const showSavedFeedback = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsEditingBg(false);
    }, 1500);
  };

  const resetHeroBg = () => {
    setHeroBg(DEFAULT_HERO_BG);
    localStorage.removeItem('kkn_hero_bg');
    setIsEditingBg(false);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-24 pb-16 md:pb-24 overflow-hidden">
      {/* Background Banner Container */}
      <div className="relative min-h-[620px] sm:min-h-[680px] lg:min-h-[720px] flex items-center rounded-b-[2.5rem] lg:rounded-b-[3.5rem] overflow-hidden shadow-xl mx-3 sm:mx-6 md:mx-10 group/hero">
        {/* Scenic Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center scale-105 transition-all duration-700"
          style={{
            backgroundImage: `url('${heroBg}')`,
          }}
        />

        {/* Dark Emerald Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#012d1d]/90 via-[#012d1d]/75 to-[#012d1d]/40 z-10" />

        {/* Custom Hero Image Upload Floating Action Button (Admin Only) */}
        {isAdmin && (
          <div className="absolute top-6 right-6 z-30">
            {!isEditingBg ? (
              <button
                onClick={() => setIsEditingBg(true)}
                className="px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold rounded-full flex items-center gap-2 border border-white/30 shadow-md transition-all hover:scale-105"
              >
                <Camera className="w-3.5 h-3.5 text-[#c1ecd4]" />
                <span>Ganti Foto Banner</span>
              </button>
            ) : (
              <div className="bg-white text-[#191c1d] p-4 rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-80 text-left animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#012d1d] flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#1b4332]" />
                    Ganti Foto Banner Hero
                  </span>
                  <button
                    onClick={() => setIsEditingBg(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 font-bold px-1"
                  >
                    ✕
                  </button>
                </div>

                {savedSuccess ? (
                  <div className="py-3 px-3 bg-[#e9f5db] text-[#151e0f] rounded-xl text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1b4332]" />
                    Foto Banner Berhasil Diganti!
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#414844] mb-1">
                        Upload File Foto Asli
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#012d1d] file:text-white hover:file:bg-[#1b4332]"
                      />
                    </div>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-gray-200"></div>
                      <span className="shrink-0 mx-2 text-[10px] text-gray-400 uppercase">Atau Link Image</span>
                      <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <form onSubmit={handleUrlSubmit} className="flex gap-1.5">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#1b4332]"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#012d1d] text-white text-xs font-bold rounded-xl hover:bg-[#1b4332]"
                      >
                        Simpan
                      </button>
                    </form>

                    {heroBg !== DEFAULT_HERO_BG && (
                      <button
                        onClick={resetHeroBg}
                        className="w-full py-1 text-[10px] text-red-600 hover:underline text-center font-medium"
                      >
                        Reset ke Banner Default
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-20 max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 w-full py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            {/* Posko Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#cde5ff] text-[#001d32] font-semibold text-xs rounded-full uppercase tracking-widest mb-6 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#001d32]" />
              <span>POSKO: RT 03 RW 02 KP. KACA KACA</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none mb-6">
              KKN Desa <br />
              <span className="text-[#c1ecd4]">Sugihmukti 2026</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/90 font-normal leading-relaxed mb-10 max-w-xl">
              Bersama Berkarya, Meninggalkan Jejak. Dokumen arsip pengabdian 15 mahasiswa Universitas Masoem & 1 DPL (29 Juni - 29 Juli 2026) di RT 03 RW 02 Kp. Kaca Kaca, Desa Sugihmukti.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo('about')}
                className="bg-[#1b4332] text-white px-8 py-4 rounded-full font-medium hover:bg-[#012d1d] hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border border-[#a5d0b9]/30"
              >
                Jelajahi Perjalanan
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo('programs')}
                className="border border-white/50 text-white backdrop-blur-sm px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Lihat 15 Program Kerja
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Stats Row */}
      <div className="relative z-30 -mt-12 md:-mt-16 max-w-[1200px] mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl sm:rounded-3xl memoir-shadow p-6 sm:p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left border border-gray-100"
        >
          {/* Stat 1: 15 Mahasiswa */}
          <div className="flex flex-col items-center md:items-start border-r border-gray-100 last:border-0 pr-4">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1b4332]">
              {HERO_STATS.mahasiswa < 10 ? `0${HERO_STATS.mahasiswa}` : HERO_STATS.mahasiswa}
            </span>
            <span className="text-xs sm:text-sm font-medium text-[#414844] mt-1">
              Mahasiswa
            </span>
          </div>

          {/* Stat 2: 15 Program Kerja */}
          <div className="flex flex-col items-center md:items-start border-r border-gray-100 last:border-0 pr-4">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1b4332]">
              {HERO_STATS.programKerja < 10 ? `0${HERO_STATS.programKerja}` : HERO_STATS.programKerja}
            </span>
            <span className="text-xs sm:text-sm font-medium text-[#414844] mt-1">
              Program Kerja
            </span>
          </div>

          {/* Stat 3: 30 Hari Pengabdian */}
          <div className="flex flex-col items-center md:items-start border-r border-gray-100 last:border-0 pr-4">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1b4332]">
              {HERO_STATS.hariPengabdian}
            </span>
            <span className="text-xs sm:text-sm font-medium text-[#414844] mt-1">
              Hari Pengabdian
            </span>
          </div>

          {/* Stat 4: 12 Partisipasi Masyarakat */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-1.5">
              <Users className="w-6 h-6 text-[#1b4332] hidden sm:block" />
              <span className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1b4332]">
                {HERO_STATS.partisipasiMasyarakat < 10 ? `0${HERO_STATS.partisipasiMasyarakat}` : HERO_STATS.partisipasiMasyarakat}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-[#414844] mt-1">
              Partisipasi Masyarakat
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

