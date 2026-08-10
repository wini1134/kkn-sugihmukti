import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, UserPlus, Edit3, Camera, Instagram, Briefcase, GraduationCap, Users } from 'lucide-react';
import { TeamMember } from '../types';
import { compressImageFile } from '../utils/imageStorage';

interface TeamMemberModalProps {
  isOpen: boolean;
  editingMember: TeamMember | null;
  onClose: () => void;
  onSave: (member: TeamMember) => void;
}

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  isOpen,
  editingMember,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [division, setDivision] = useState('Ketua');
  const [major, setMajor] = useState('');
  const [instagram, setInstagram] = useState('');
  const [photo, setPhoto] = useState('');

  const divisions = [
    'Pembimbing',
    'Ketua',
    'Wakil',
    'Acara',
    'Sekretaris',
    'Bendahara',
    'Humas',
    'Logistik',
    'PDD',
    'Konsumsi',
  ];

  useEffect(() => {
    if (editingMember) {
      setName(editingMember.name);
      setRole(editingMember.role);
      setDivision(editingMember.division);
      setMajor(editingMember.major);
      setInstagram(editingMember.instagram || '');
      setPhoto(editingMember.photo);
    } else {
      setName('');
      setRole('');
      setDivision('Ketua');
      setMajor('');
      setInstagram('');
      setPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80');
    }
  }, [editingMember, isOpen]);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 800, 800, 0.8);
        setPhoto(compressed);
      } catch (err) {
        console.error('Failed to compress image', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    const memberData: TeamMember = {
      id: editingMember ? editingMember.id : `team-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      division: division,
      major: major.trim() || 'Universitas Masoem',
      photo: photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      instagram: instagram.trim().replace('@', ''),
    };

    onSave(memberData);
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
            {editingMember ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-xl text-[#012d1d]">
              {editingMember ? 'Edit Data Personil' : 'Tambah Personil / DPL Baru'}
            </h3>
            <p className="text-xs text-[#414844]">
              {editingMember ? 'Ubah informasi nama, jabatan, foto dan sosmed' : 'Tambahkan anggota tim KKN atau Dosen Pembimbing'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Preview & File Upload */}
          <div className="flex items-center gap-4 p-4 bg-[#f8f9fa] rounded-2xl border border-gray-100">
            <img
              src={photo}
              alt="Preview"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#1b4332] shadow-sm"
            />
            <div className="flex-1">
              <label className="block text-xs font-bold text-[#012d1d] mb-1">Foto Profil Personil</label>
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

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-[#012d1d] mb-1">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: M. Furqon, M.Kom / Raka Abimanyu"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            />
          </div>

          {/* Role / Jabatan */}
          <div>
            <label className="block text-xs font-bold text-[#012d1d] mb-1">Jabatan / Peran *</label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Contoh: Dosen Pembimbing Lapangan / Ketua Kelompok"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            />
          </div>

          {/* Division & Major Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#012d1d] mb-1">Divisi Tim</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332] bg-white"
              >
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#012d1d] mb-1">Jurusan / Instansi</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="Teknik Informatika / DPL"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>
          </div>

          {/* Instagram / Sosmed */}
          <div>
            <label className="block text-xs font-bold text-[#012d1d] mb-1">Username Instagram / Link Sosmed</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400 text-xs font-bold">@</span>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="username_instagram"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>
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
              {editingMember ? 'Simpan Perubahan' : 'Tambah Personil'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
