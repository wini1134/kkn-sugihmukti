import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Camera,
  Check
} from 'lucide-react';
import { Program, ProgramCategory } from '../types';
import {
  PROGRAMS_DATA,
} from '../data/mockData';
import { ProgramModal } from './ProgramModal';
import { ProgramFormModal } from './ProgramFormModal';
import { useAdmin } from '../context/AdminContext';
import { compressImageFile, usePersistentState } from '../utils/imageStorage';

export const Programs: React.FC = () => {
  const { isAdmin } = useAdmin();
  // Persistent state for programs with IndexedDB + localStorage backing
  const [programs, setPrograms] = usePersistentState<Program[]>('kkn_programs_v1', PROGRAMS_DATA);

  const [selectedCategory, setSelectedCategory] = useState<ProgramCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProgram, setActiveModalProgram] = useState<Program | null>(null);

  // CRUD Form Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  // Quick photo upload state per card
  const [activePhotoUploadId, setActivePhotoUploadId] = useState<string | null>(null);

  const categories: ProgramCategory[] = [
    'Semua',
    'Edukasi',
    'Digital',
    'Lingkungan',
    'Sosial',
    'Infrastruktur',
  ];

  const handleSaveProgram = (updatedOrNewProgram: Program) => {
    setPrograms((prev) => {
      const exists = prev.some((p) => p.id === updatedOrNewProgram.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedOrNewProgram.id ? updatedOrNewProgram : p));
      } else {
        return [updatedOrNewProgram, ...prev];
      }
    });
  };

  // Delete confirmation state
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);

  const handleDeleteProgram = (e: React.MouseEvent, program: Program) => {
    e.stopPropagation();
    setProgramToDelete(program);
  };

  const confirmDeleteProgramAction = () => {
    if (programToDelete) {
      setPrograms((prev) => prev.filter((p) => p.id !== programToDelete.id));
      setProgramToDelete(null);
    }
  };

  const handleQuickImageChange = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1200, 1200, 0.78);
        setPrograms((prev) =>
          prev.map((p) => (p.id === id ? { ...p, image: compressed } : p))
        );
        setActivePhotoUploadId(null);
      } catch (err) {
        console.error('Failed to compress program photo', err);
      }
    }
  };

  const filteredPrograms = programs.filter((p) => {
    const matchesCategory =
      selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="programs" className="py-20 md:py-28 bg-[#f8f9fa] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c1ecd4] text-[#002114] text-xs font-bold uppercase tracking-wider mb-4">
              <Compass className="w-3.5 h-3.5" />
              PORTFOLIO PENGABDIAN ({programs.length} PROGRAM)
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#012d1d] tracking-tight">
              Program Kerja KKN
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-[#414844] max-w-md text-sm sm:text-base leading-relaxed">
              Inisiatif nyata yang dirancang untuk mendorong kemandirian masyarakat Desa Sugihmukti.
            </p>

            {isAdmin && (
              <button
                onClick={() => {
                  setEditingProgram(null);
                  setIsFormModalOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-[#012d1d] text-white text-xs font-bold hover:bg-[#1b4332] transition-colors flex items-center gap-2 shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4 text-[#c1ecd4]" />
                <span>Tambah Proker Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-white p-4 rounded-2xl memoir-shadow mb-10 flex flex-col lg:flex-row gap-4 items-center justify-between border border-gray-100">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto no-scrollbar pb-1 lg:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#012d1d] text-white shadow-xs'
                    : 'bg-[#f3f4f5] text-[#414844] hover:bg-[#e7e8e9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#414844]" />
            <input
              type="text"
              placeholder="Cari program kerja..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-gray-200 rounded-xl text-xs font-medium text-[#191c1d] focus:outline-none focus:border-[#1b4332]"
            />
          </div>
        </div>

        {/* Bento Grid Programs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <AnimatePresence mode="popLayout">
            {filteredPrograms.map((program) => (
              <motion.div
                key={program.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl overflow-hidden memoir-shadow hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group relative"
              >
                {/* Program Image & Action Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Tag Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#012d1d] text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-xs">
                      {program.tag}
                    </span>
                  </div>

                  {/* CRUD Quick Action Buttons Top Right (Admin Only) */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      {/* Quick Image Upload Button */}
                      <label
                        title="Ganti Foto Program"
                        className="p-2 bg-white/90 hover:bg-white text-[#012d1d] rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleQuickImageChange(program.id, e)}
                        />
                      </label>

                      {/* Edit Program Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProgram(program);
                          setIsFormModalOpen(true);
                        }}
                        title="Edit Judul & Data Program"
                        className="p-2 bg-[#012d1d]/90 hover:bg-[#012d1d] text-white rounded-full shadow-md transition-transform hover:scale-110"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Program Button */}
                      <button
                        onClick={(e) => handleDeleteProgram(e, program)}
                        title="Hapus Program"
                        className="p-2 bg-red-600/90 hover:bg-red-600 text-white rounded-full shadow-md transition-transform hover:scale-110"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-[#012d1d] mb-2 group-hover:text-[#1b4332] transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-[#414844] text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                      {program.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    {program.location && (
                      <span className="text-[11px] font-medium text-[#414844] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#1b4332]" />
                        {program.location}
                      </span>
                    )}

                    <button
                      onClick={() => setActiveModalProgram(program)}
                      className="ml-auto text-xs font-bold text-[#1b4332] hover:text-[#012d1d] flex items-center gap-1 group/btn"
                    >
                      Lihat Detail
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Program Detail Modal */}
      <ProgramModal
        program={activeModalProgram}
        onClose={() => setActiveModalProgram(null)}
      />

      {/* Program CRUD Form Modal */}
      <ProgramFormModal
        isOpen={isFormModalOpen}
        editingProgram={editingProgram}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProgram(null);
        }}
        onSave={handleSaveProgram}
      />

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {programToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProgramToDelete(null)}
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
                Hapus Program Kerja?
              </h3>
              <p className="text-xs sm:text-sm text-[#414844] mb-6">
                Apakah Anda yakin ingin menghapus <strong className="text-[#012d1d]">"{programToDelete.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setProgramToDelete(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#414844] text-xs font-bold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteProgramAction}
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

