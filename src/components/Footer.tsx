import React from 'react';
import { BookOpen, MapPin, Instagram, Mail, ArrowUpRight, Heart, ShieldCheck, Lock } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const Footer: React.FC = () => {
  const { isAdmin, setIsLoginModalOpen } = useAdmin();

  const scrollTo = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 85;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-[#012d1d] text-white pt-16 pb-24 lg:pb-12 border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#c1ecd4] text-[#002114] flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-2xl text-white tracking-tight">
                SUGIHMUKTI <span className="text-[#c1ecd4]">2026</span>
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
              Arsip digital pengabdian masyarakat Kuliah Kerja Nyata (KKN) Universitas Masoem di Desa Sugihmukti, Pasirjambu, Kab. Bandung.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#c1ecd4] font-medium">
              <MapPin className="w-4 h-4" />
              <span>Desa Sugihmukti, Kec. Pasirjambu, Kab. Bandung, Jawa Barat</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="font-heading font-bold text-base text-white mb-4">Navigasi Utama</h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-medium">
              <li>
                <button
                  onClick={() => scrollTo('hero')}
                  className="hover:text-[#c1ecd4] transition-colors"
                >
                  Home / Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('about')}
                  className="hover:text-[#c1ecd4] transition-colors"
                >
                  Tentang Sugihmukti
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('gallery')}
                  className="hover:text-[#c1ecd4] transition-colors"
                >
                  Galeri & Kenangan
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('programs')}
                  className="hover:text-[#c1ecd4] transition-colors"
                >
                  Program Kerja Unggulan
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('team')}
                  className="hover:text-[#c1ecd4] transition-colors"
                >
                  Tim Mahasiswa
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('gallery')}
                  className="hover:text-[#c1ecd4] transition-colors"
                >
                  Galeri & Kenangan
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('guestbook')}
                  className="hover:text-[#c1ecd4] transition-colors"
                >
                  Buku Tamu Digital
                </button>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="lg:col-span-4">
            <h4 className="font-heading font-bold text-base text-white mb-4">Koneksi & Media</h4>
            <div className="space-y-3 mb-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
              >
                <Instagram className="w-4 h-4 text-[#c1ecd4]" />
                @kkn_sugihmukti2026
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Dokumentasi ini dikelola secara independen sebagai bentuk kenangan dan arsip publik masyarakat Desa Sugihmukti.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4 text-center sm:text-left">
          <p>© 2026 KKN Desa Sugihmukti. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-white/70 hover:text-white transition-colors flex items-center gap-1.5 font-medium underline"
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mode Admin Aktif</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-white/70" />
                  <span>Akses Admin</span>
                </>
              )}
            </button>
            <span>•</span>
            <p className="flex items-center justify-center gap-1">
              Dibuat dengan <Heart className="w-3.5 h-3.5 text-red-400 fill-current" /> untuk Sugihmukti
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
