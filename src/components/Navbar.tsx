import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Menu,
  X,
  ArrowUpRight,
  Camera,
  Check,
  Upload,
  ShieldCheck,
  Lock,
  Home,
  Compass,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Info,
  Calendar,
  Database,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { compressImageFile, usePersistentState } from '../utils/imageStorage';
import { DataBackupModal } from './DataBackupModal';

export const Navbar: React.FC = () => {
  const { isAdmin, currentAdmin, setIsLoginModalOpen } = useAdmin();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Custom KKN Logo State
  const [logoUrl, setLogoUrl] = usePersistentState<string>('kkn_navbar_logo', '');
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero', icon: Home },
    { name: 'Tentang', href: '#about', icon: Info },
    { name: 'Tim Mahasiswa', href: '#team', icon: Users },
    { name: 'Galeri & Kenangan', href: '#gallery', icon: ImageIcon },
    { name: 'Program Kerja', href: '#programs', icon: Compass },
    { name: 'Suara Warga', href: '#testimonials', icon: MessageSquare },
    { name: 'Buku Tamu', href: '#guestbook', icon: BookOpen },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = navLinks.map((link) => link.href.replace('#', ''));
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 600, 600, 0.85);
        setLogoUrl(compressed);
        triggerSuccessFeedback();
      } catch (err) {
        console.error('Failed to compress logo image', err);
      }
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      const url = inputUrl.trim();
      setLogoUrl(url);
      setInputUrl('');
      triggerSuccessFeedback();
    }
  };

  const triggerSuccessFeedback = () => {
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      setShowLogoModal(false);
    }, 1500);
  };

  const removeCustomLogo = () => {
    setLogoUrl('');
    localStorage.removeItem('kkn_navbar_logo');
    setShowLogoModal(false);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMobileMenuOpen(false);

    const targetId = href.replace('#', '');

    setTimeout(() => {
      if (targetId === 'hero' || targetId === '') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 60);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md py-3 shadow-md border-b border-gray-100'
          : 'bg-[#f8f9fa]/90 backdrop-blur-md py-4 shadow-xs'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex items-center justify-between relative">
        {/* Brand Logo & Custom KKN Logo Container */}
        <div className="flex items-center gap-3">
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="flex items-center gap-3 group"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo KKN Sugihmukti"
                className="w-10 h-10 object-contain rounded-xl border border-gray-200 bg-white shadow-xs group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#012d1d] flex items-center justify-center text-[#c1ecd4] group-hover:scale-105 transition-transform shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
            )}

            <span className="font-heading font-bold text-xl tracking-tight text-[#012d1d] flex flex-col leading-tight">
              <span>
                SUGIHMUKTI <span className="text-[#1b4332]">2026</span>
              </span>
              <span className="text-[10px] text-[#414844] font-medium tracking-normal hidden sm:inline">
                Posko: RT 03 RW 02 Kp. Kaca Kaca
              </span>
            </span>
          </a>

          {/* Button to Upload/Edit KKN Logo (Admin only) */}
          {isAdmin && (
            <button
              onClick={() => setShowLogoModal(!showLogoModal)}
              className="p-1.5 text-gray-400 hover:text-[#012d1d] hover:bg-gray-100 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
              title="Ganti/Upload Logo KKN (Admin)"
            >
              <Camera className="w-3.5 h-3.5 text-[#1b4332]" />
              <span className="hidden sm:inline text-[10px]">Logo KKN</span>
            </button>
          )}
        </div>

        {/* Modal Popover for Logo Upload */}
        {isAdmin && showLogoModal && (
          <div className="absolute top-14 left-6 z-50 bg-white rounded-2xl p-4 shadow-2xl border border-gray-200 w-80 text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-[#012d1d] flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#1b4332]" />
                Upload / Ganti Logo KKN
              </span>
              <button
                onClick={() => setShowLogoModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {savedMessage ? (
              <div className="p-3 bg-[#e9f5db] text-[#151e0f] rounded-xl text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1b4332]" />
                Logo KKN Berhasil Diperbarui!
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#414844] uppercase mb-1">
                    Upload File Gambar Logo (PNG/JPG)
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
                  <span className="shrink-0 mx-2 text-[10px] text-gray-400 uppercase">Atau URL Logo</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <form onSubmit={handleUrlSubmit} className="flex gap-1.5">
                  <input
                    type="url"
                    placeholder="https://.../logo.png"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#1b4332]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#012d1d] text-white text-xs font-bold rounded-xl hover:bg-[#1b4332]"
                  >
                    Set
                  </button>
                </form>

                {logoUrl && (
                  <button
                    onClick={removeCustomLogo}
                    className="w-full py-1 text-[10px] text-red-600 hover:underline text-center font-medium"
                  >
                    Hapus Logo KKN Custom
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isCurrent = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`text-sm font-medium transition-all py-1 relative ${
                  isCurrent
                    ? 'text-[#012d1d] font-semibold'
                    : 'text-[#414844] hover:text-[#012d1d]'
                }`}
              >
                {link.name}
                {isCurrent && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#012d1d] rounded-full"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Button Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Backup & Cloud Sync Data Button */}
          <button
            onClick={() => setIsBackupModalOpen(true)}
            className="px-3.5 py-2 rounded-full text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 transition-all shadow-2xs hover:scale-105 cursor-pointer"
            title="Kelola & Sinkronkan Data Cloud ke Vercel"
          >
            <Database className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span>Backup & Cloud Sync</span>
          </button>

          {/* Admin Toggle Button */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 border shadow-xs hover:scale-105 cursor-pointer ${
              isAdmin
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                : 'bg-[#e8f5e9] text-[#012d1d] border-emerald-300 hover:bg-[#c8e6c9]'
            }`}
            title={isAdmin ? 'Kelola Akun Admin' : 'Masuk atau Daftar Admin'}
          >
            {isAdmin ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>ADMIN AKTIF ({currentAdmin?.name.split(' ')[0] || 'Admin'})</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#012d1d] shrink-0" />
                <span>Masuk / Daftar Admin</span>
              </>
            )}
          </button>

          <a
            href="#guestbook"
            onClick={(e) => scrollToSection(e, '#guestbook')}
            className="px-5 py-2.5 rounded-full bg-[#012d1d] text-white text-xs font-semibold hover:bg-[#1b4332] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            Isi Buku Tamu
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#012d1d] hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-200 overflow-hidden shadow-xl"
          >
            <div className="px-5 py-5 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
              {/* Admin Button at top of mobile menu */}
              <div className="pb-2 border-b border-gray-100 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsBackupModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 text-xs font-extrabold rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 flex items-center justify-center gap-2 shadow-2xs"
                >
                  <Database className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>SINKRONKAN DATA CLOUD & BACKUP</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className={`w-full py-2.5 px-4 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 border shadow-sm ${
                    isAdmin
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-[#e8f5e9] text-[#012d1d] border-emerald-300 hover:bg-[#c8e6c9]'
                  }`}
                >
                  {isAdmin ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>ADMIN AKTIF ({currentAdmin?.name.split(' ')[0] || 'Aktif'})</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#012d1d] shrink-0" />
                      <span>MASUK / DAFTAR ADMIN</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 pt-1 pb-1">
                Navigasi Posko KKN
              </div>

              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const isCurrent = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'bg-[#012d1d] text-white shadow-xs'
                        : 'text-[#414844] hover:bg-[#f3f4f5] hover:text-[#012d1d]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent
                        className={`w-4 h-4 ${
                          isCurrent ? 'text-[#c1ecd4]' : 'text-gray-400'
                        }`}
                      />
                      <span>{link.name}</span>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] bg-[#1b4332] text-[#c1ecd4] px-2 py-0.5 rounded-full font-extrabold">
                        Aktif
                      </span>
                    )}
                  </a>
                );
              })}

              <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className={`w-full py-3 px-4 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 border shadow-2xs ${
                    isAdmin
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-[#e8f5e9] text-[#012d1d] border-emerald-300 hover:bg-[#c8e6c9]'
                  }`}
                >
                  {isAdmin ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>ADMIN AKTIF ({currentAdmin?.name || 'Aktif'})</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#012d1d] shrink-0" />
                      <span>MASUK / DAFTAR ADMIN</span>
                    </>
                  )}
                </button>

                <a
                  href="#guestbook"
                  onClick={(e) => scrollToSection(e, '#guestbook')}
                  className="w-full py-3 text-center bg-[#012d1d] hover:bg-[#1b4332] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#c1ecd4]" />
                  Isi Buku Tamu Digital
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Data Backup & Restore Modal */}
      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />
    </header>
  );
};

