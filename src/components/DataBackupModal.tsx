import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Upload, Database, X, Check, AlertCircle, RefreshCw, Cloud, Zap } from 'lucide-react';
import { syncAllLocalToFirebase, setPersistentItem, getPersistentItem } from '../utils/imageStorage';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOCAL_STORAGE_KEYS = [
  'kkn_admin_users_v2',
  'kkn_hero_bg',
  'kkn_about_img',
  'kkn_navbar_logo',
  'kkn_team_members_v1',
  'kkn_gallery_items_v1',
  'kkn_polaroids_v1',
  'kkn_programs_v1',
  'kkn_testimonials_v2',
  'kkn_guestbook_entries_v1',
  'kkn_programs_v2',
  'kkn_gallery_v2',
  'kkn_team_v2',
  'kkn_hero_banner_v2',
  'kkn_guestbook_v2',
  'kkn_about_stats_v2',
  'kkn_timeline_v2',
  'kkn_polaroids_v2'
];

export const DataBackupModal: React.FC<DataBackupModalProps> = ({ isOpen, onClose }) => {
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  // Manual Cloud Sync to Firebase Firestore
  const handleCloudSync = async () => {
    setIsSyncing(true);
    setStatusMsg(null);
    try {
      const count = await syncAllLocalToFirebase();
      setStatusMsg({
        type: 'success',
        text: `🔥 Berhasil mensinkronkan ${count} modul data ke Firebase Cloud! Tampilan di Vercel/HP sekarang otomatis terupdate secara Real-Time.`
      });
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'Gagal sinkronisasi data ke Firebase Cloud.' });
    } finally {
      setIsSyncing(false);
    }
  };

  // Export/Download JSON
  const handleExport = async () => {
    try {
      const backupData: Record<string, any> = {};
      let keysFound = 0;

      for (const key of LOCAL_STORAGE_KEYS) {
        const value = await getPersistentItem(key, '');
        if (value) {
          try {
            backupData[key] = JSON.parse(value);
          } catch {
            backupData[key] = value;
          }
          keysFound++;
        }
      }

      if (keysFound === 0) {
        setStatusMsg({
          type: 'error',
          text: 'Belum ada data kustom yang tersimpan di browser ini. Ubah foto atau data terlebih dahulu.'
        });
        return;
      }

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kkn-sugihmukti-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMsg({
        type: 'success',
        text: `Berhasil mengunduh file backup (${keysFound} modul data). Simpan file ini sebagai cadangan lokal.`
      });
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'Gagal mengunduh backup data.' });
    }
  };

  // Import/Restore JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('Format file JSON tidak valid.');
        }

        let restoredCount = 0;
        const keys = Object.keys(parsed);
        for (const key of keys) {
          const val = parsed[key];
          if (val !== undefined && val !== null) {
            await setPersistentItem(key, val);
            restoredCount++;
          }
        }

        setStatusMsg({
          type: 'success',
          text: `Berhasil memuat & menyimpan ${restoredCount} modul data ke Firebase Cloud! Halaman akan dimuat ulang...`
        });

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        console.error(err);
        setStatusMsg({
          type: 'error',
          text: 'Gagal membaca file JSON. Pastikan Anda mengupload file backup .json yang benar.'
        });
      }
    };
    reader.readAsText(file);
  };

  // Reset to default
  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data kustom lokal dan kembali ke data default?')) {
      LOCAL_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
      setStatusMsg({
        type: 'success',
        text: 'Data lokal berhasil direset. Memuat ulang halaman...'
      });
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-gray-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-100 text-[#012d1d] rounded-2xl">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#012d1d]">
                  Kelola & Backup Data Website
                </h3>
                <p className="text-xs text-gray-500">
                  Export & Import data (Foto, Program, Tim, Banner)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Alert */}
          {statusMsg && (
            <div
              className={`mb-5 p-3.5 rounded-2xl text-xs font-semibold flex items-start gap-2.5 leading-relaxed border ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-red-50 text-red-900 border-red-200'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Instructions Box */}
          <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed space-y-1.5">
            <p className="font-bold flex items-center gap-1.5 text-emerald-900">
              🔥 Firebase Firestore Real-Time Cloud Online:
            </p>
            <p className="text-[11px] text-emerald-800">
              Database Cloud sudah terhubung! Semua foto, tim, dan program kerja tersimpan permanen di cloud dan otomatis tampil di Vercel secara real-time.
            </p>
            <p className="text-[11px] font-bold text-emerald-950">
              💡 Klik tombol <strong>"Sinkronkan Data ke Firebase Cloud"</strong> di bawah jika ingin memastikan semua data lokal saat ini langsung diupload ke Vercel!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Sync to Firebase Cloud Button */}
            <button
              onClick={handleCloudSync}
              disabled={isSyncing}
              className="w-full py-4 px-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-bold text-xs transition-all flex items-center justify-between shadow-lg shadow-emerald-900/10 hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <Cloud className={`w-5 h-5 text-emerald-200 ${isSyncing ? 'animate-bounce' : ''}`} />
                <div className="text-left">
                  <div className="font-extrabold text-sm flex items-center gap-1.5">
                    <span>Sinkronkan Data ke Firebase Cloud</span>
                    <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  </div>
                  <div className="text-[10.5px] text-emerald-100 font-normal">
                    {isSyncing ? 'Sedang mengupload ke Cloud...' : 'Upload semua foto & teks lokal langsung agar otomatis tampil di Vercel'}
                  </div>
                </div>
              </div>
            </button>

            {/* Download/Export Button */}
            <button
              onClick={handleExport}
              className="w-full py-3.5 px-5 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded-2xl font-bold text-xs transition-all flex items-center justify-between shadow-md hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="font-extrabold">Download Backup Data (Export JSON)</div>
                  <div className="text-[10px] text-gray-300 font-normal">Unduh semua foto & perubahan data ke file offline di HP/Komputer</div>
                </div>
              </div>
            </button>

            {/* Upload/Import Button */}
            <label className="w-full py-3.5 px-5 bg-emerald-50 hover:bg-emerald-100 text-[#012d1d] border border-emerald-200 rounded-2xl font-bold text-xs transition-all flex items-center justify-between cursor-pointer hover:scale-[1.01]">
              <div className="flex items-center gap-3">
                <Upload className="w-4 h-4 text-emerald-700" />
                <div className="text-left">
                  <div className="font-extrabold text-[#012d1d]">Restore / Upload Backup (Import JSON)</div>
                  <div className="text-[10px] text-emerald-800 font-normal">Pilih file .json hasil download untuk menerapkan data</div>
                </div>
              </div>
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImport}
              />
            </label>

            {/* Reset Button */}
            <button
              onClick={handleResetData}
              className="w-full py-2.5 px-4 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-500 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data Lokal ke Awal (Default)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
