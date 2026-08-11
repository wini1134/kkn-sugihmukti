import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Instagram, Camera, Plus, Edit3, Trash2, Heart, Award, GraduationCap } from 'lucide-react';
import { TeamMember } from '../types';
import { TEAM_MEMBERS } from '../data/mockData';
import { useAdmin } from '../context/AdminContext';
import { compressImageFile, usePersistentState } from '../utils/imageStorage';
import { TeamMemberModal } from './TeamMemberModal';

export const Team: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [teamMembers, setTeamMembers] = usePersistentState<TeamMember[]>('kkn_team_members_v1', TEAM_MEMBERS);

  const [selectedDivision, setSelectedDivision] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const divisions = [
    'Semua',
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

  const handleMemberPhotoUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 600, 600, 0.65);
        setTeamMembers((prev) =>
          prev.map((m) => (m.id === id ? { ...m, photo: compressed } : m))
        );
      } catch (err) {
        console.error('Failed to compress team member photo', err);
      }
    }
  };

  const handleSaveMember = (member: TeamMember) => {
    setTeamMembers((prev) => {
      const exists = prev.some((m) => m.id === member.id);
      if (exists) {
        return prev.map((m) => (m.id === member.id ? member : m));
      } else {
        return [...prev, member];
      }
    });
  };

  // Delete confirmation state
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  const handleDeleteMember = (member: TeamMember) => {
    setMemberToDelete(member);
  };

  const confirmDeleteMemberAction = () => {
    if (memberToDelete) {
      setTeamMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
      setMemberToDelete(null);
    }
  };

  const filteredTeam = teamMembers.filter((m) => {
    if (selectedDivision === 'Semua') return true;
    return m.division === selectedDivision;
  });

  return (
    <section id="team" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Decorative Warm Nostalgic Glow Backgrounds */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#c1ecd4]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#ffe0b2]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e8f5e9] text-[#1b4332] text-xs font-extrabold uppercase tracking-wider mb-4 border border-[#a5d0b9]/40 shadow-xs">
            <Users className="w-4 h-4 text-[#1b4332]" />
            TIM KKN & PEMBIMBING LAPANGAN ({teamMembers.length} PERSONIL)
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#012d1d] tracking-tight mb-4">
            Wajah di Balik Karya
          </h2>
          <p className="text-[#414844] text-base leading-relaxed">
            15 mahasiswa berdedikasi Universitas Masoem bersama 1 Dosen Pembimbing Lapangan yang mengukir sejarah dan mengabdi untuk kemajuan Desa Sugihmukti.
          </p>

          {/* Admin Add Personil Button */}
          {isAdmin && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setEditingMember(null);
                  setIsModalOpen(true);
                }}
                className="px-6 py-3 bg-[#012d1d] hover:bg-[#1b4332] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4 text-[#c1ecd4]" />
                <span>Tambah Personil / Pembimbing Baru</span>
              </button>
            </div>
          )}
        </div>

        {/* Division Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {divisions.map((div) => (
            <button
              key={div}
              onClick={() => setSelectedDivision(div)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDivision === div
                  ? 'bg-[#012d1d] text-white shadow-xs'
                  : 'bg-[#f3f4f5] text-[#414844] hover:bg-[#e7e8e9]'
              }`}
            >
              {div}
            </button>
          ))}
        </div>

        {/* Team Cards Grid - 16 Kotak */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          <AnimatePresence mode="popLayout">
            {filteredTeam.map((member) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="bg-[#f8f9fa] rounded-3xl overflow-hidden memoir-shadow hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100/90 flex flex-col group relative"
              >
                {/* Photo Header */}
                <div className="relative h-80 w-full overflow-hidden bg-[#e1e3e4]">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Role Badge (Top Left) */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
                    {member.division === 'Pembimbing' || member.division === 'Pembimbing Lapangan' ? (
                      <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Award className="w-3 h-3" />
                        DPL
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[#012d1d] text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-xs">
                        {member.role}
                      </span>
                    )}
                  </div>

                  {/* Admin Actions (Top Right) */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                    {isAdmin && (
                      <>
                        <label
                          title="Ganti Foto"
                          className="p-2 bg-white/90 hover:bg-white text-[#012d1d] rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleMemberPhotoUpload(member.id, e)}
                          />
                        </label>

                        <button
                          onClick={() => {
                            setEditingMember(member);
                            setIsModalOpen(true);
                          }}
                          title="Edit Data Personil"
                          className="p-2 bg-white/90 hover:bg-white text-[#012d1d] rounded-full shadow-md transition-transform hover:scale-110"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteMember(member)}
                          title="Hapus Personil"
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-transform hover:scale-110"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Bottom Overlay Info (Nama, Jabatan & Sosmed) */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white flex flex-col justify-end">
                    <h3 className="font-heading font-extrabold text-xl leading-snug text-white drop-shadow-xs mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#c1ecd4] font-bold mb-1.5 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#a5d0b9]" />
                      {member.major}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/20 mt-1">
                      <span className="text-[11px] text-white/80 font-medium">
                        {member.role}
                      </span>

                      {/* Social Media Link */}
                      {member.instagram ? (
                        <a
                          href={
                            member.instagram.startsWith('http')
                              ? member.instagram
                              : `https://instagram.com/${member.instagram}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-white/20 hover:bg-[#1b4332] hover:text-white text-white text-xs font-bold rounded-full transition-all backdrop-blur-md flex items-center gap-1.5 border border-white/30"
                        >
                          <Instagram className="w-3.5 h-3.5 text-[#e1b382]" />
                          <span>@{member.instagram.replace('https://instagram.com/', '')}</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-white/50 italic">Sosmed N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* CRUD Modal */}
      <TeamMemberModal
        isOpen={isModalOpen}
        editingMember={editingMember}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMember}
      />

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {memberToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMemberToDelete(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-center border border-gray-100"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-[#012d1d] mb-2">
                Hapus Data Personil?
              </h3>
              <p className="text-xs sm:text-sm text-[#414844] mb-6">
                Apakah Anda yakin ingin menghapus data personil <strong className="text-[#012d1d]">"{memberToDelete.name}"</strong>?
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setMemberToDelete(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#414844] text-xs font-bold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteMemberAction}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
