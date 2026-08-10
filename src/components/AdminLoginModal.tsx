import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  X,
  LogOut,
  Mail,
  User,
  UserPlus,
  LogIn,
  Check,
  AlertCircle,
  Key,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdmin,
    currentAdmin,
    loginAdmin,
    registerAdmin,
    logoutAdmin,
    isLoginModalOpen,
    setIsLoginModalOpen,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Messages state
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const res = loginAdmin(loginEmail, loginPassword);
    if (res.success) {
      setSuccessMsg(res.message);
      setLoginEmail('');
      setLoginPassword('');
      setTimeout(() => {
        setIsLoginModalOpen(false);
        setSuccessMsg('');
      }, 1200);
    } else {
      setError(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (regPassword !== regConfirmPassword) {
      setError('Konfirmasi password tidak cocok dengan password yang Anda buat!');
      return;
    }

    const res = registerAdmin(regName, regEmail, regPassword);
    if (res.success) {
      setSuccessMsg(res.message);
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setTimeout(() => {
        setIsLoginModalOpen(false);
        setSuccessMsg('');
      }, 1200);
    } else {
      setError(res.message);
    }
  };

  if (!isLoginModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsLoginModalOpen(false)}
          className="fixed inset-0 bg-black/65 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-gray-100 my-8"
        >
          {/* Close button */}
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-4 right-4 p-2 bg-[#f3f4f5] text-[#414844] hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Icon & Title */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[#c1ecd4] text-[#012d1d] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ShieldCheck className="w-7 h-7 text-[#012d1d]" />
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-[#012d1d]">
              {isAdmin ? 'Mode Admin Aktif' : 'Portal Akses Admin'}
            </h3>
            <p className="text-xs text-[#414844] mt-1">
              {isAdmin
                ? 'Anda dapat mengubah/menambah foto, proker, dan data KKN.'
                : 'Masuk atau daftar dengan Email & Password Anda sendiri untuk akses edit.'}
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-start gap-2 border border-red-100 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-100 leading-relaxed font-bold">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Content Body: IF LOGGED IN */}
          {isAdmin && currentAdmin ? (
            <div className="space-y-4">
              <div className="p-4 bg-[#f8f9fa] rounded-2xl border border-gray-200 text-center space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold">
                  <Check className="w-3.5 h-3.5 text-emerald-700" /> Terautentikasi Sebagai Admin
                </span>
                <div className="pt-1">
                  <p className="text-sm font-extrabold text-[#012d1d]">{currentAdmin.name}</p>
                  <p className="text-xs text-gray-500">{currentAdmin.email}</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[11px] text-[#012d1d] leading-relaxed">
                ✨ <strong>Akses Penuh Terbuka:</strong> Anda sekarang bisa mengubah foto banner, foto anggota tim, menambah/mengedit program kerja, serta mengganti foto galeri.
              </div>

              <button
                onClick={() => {
                  logoutAdmin();
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <LogOut className="w-4 h-4" />
                Keluar Dari Akun Admin
              </button>
            </div>
          ) : (
            /* IF NOT LOGGED IN: TABS MASUK / DAFTAR */
            <div>
              {/* Tabs Switcher */}
              <div className="flex bg-[#f3f4f5] p-1 rounded-2xl mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                  }}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'login'
                      ? 'bg-white text-[#012d1d] shadow-xs'
                      : 'text-gray-500 hover:text-[#012d1d]'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Masuk (Login)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setError('');
                  }}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'register'
                      ? 'bg-[#012d1d] text-white shadow-xs'
                      : 'text-gray-500 hover:text-[#012d1d]'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Daftar Admin Baru
                </button>
              </div>

              {/* TAB 1: MASUK (LOGIN) */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#012d1d] mb-1">
                      Email Admin
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="Masukkan email terdaftar"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#012d1d] focus:outline-none"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#012d1d] mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="Masukkan password Anda"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#012d1d] focus:outline-none"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#012d1d] hover:bg-[#1b4332] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg mt-2 flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Masuk Sebagai Admin
                  </button>
                </form>
              )}

              {/* TAB 2: DAFTAR (REGISTER) */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#012d1d] mb-1">
                      Nama Lengkap / Jabatan Admin
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="contoh: M. Furqon / Ketua KKN"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#012d1d] focus:outline-none"
                      />
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#012d1d] mb-1">
                      Email Anda (Untuk Login)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="contoh: emailku@masoem.ac.id"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#012d1d] focus:outline-none"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#012d1d] mb-1">
                      Buat Password Sendiri
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="Atur password minimal 4 karakter"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#012d1d] focus:outline-none"
                      />
                      <Key className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#012d1d] mb-1">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="Ulangi password di atas"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#012d1d] focus:outline-none"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#012d1d] hover:bg-[#1b4332] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg mt-2 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Daftar & Aktifkan Akses Admin
                  </button>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
