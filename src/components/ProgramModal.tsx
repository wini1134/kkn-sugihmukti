import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Users, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { Program } from '../types';

interface ProgramModalProps {
  program: Program | null;
  onClose: () => void;
}

export const ProgramModal: React.FC<ProgramModalProps> = ({ program, onClose }) => {
  if (!program) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col"
        >
          {/* Image Header */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0">
            <img
              src={program.image}
              alt={program.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge & Title */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="inline-block px-3 py-1 bg-[#c1ecd4] text-[#002114] text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                {program.tag}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading">{program.title}</h2>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-[#191c1d]">
            {/* Location & Beneficiaries Meta */}
            <div className="flex flex-wrap gap-4 p-4 bg-[#f3f4f5] rounded-2xl text-sm font-medium text-[#414844]">
              {program.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1b4332]" />
                  <span>{program.location}</span>
                </div>
              )}
              {program.beneficiariesCount && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#1b4332]" />
                  <span>Penerima Manfaat: ~{program.beneficiariesCount} Warga</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold font-heading text-[#012d1d] mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1b4332]" />
                Deskripsi Program Kerja
              </h3>
              <p className="text-[#414844] leading-relaxed text-base">
                {program.description}
              </p>
            </div>

            {/* Impact Report */}
            <div className="p-5 bg-[#e9f5db] border border-[#a5d0b9] rounded-2xl">
              <h3 className="text-base font-bold font-heading text-[#012d1d] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#1b4332]" />
                Laporan Dampak & Hasil (Impact Report)
              </h3>
              <p className="text-[#151e0f] font-medium leading-relaxed">
                {program.impactReport}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#1b4332] text-white rounded-full font-medium hover:bg-[#012d1d] transition-colors flex items-center gap-2 text-sm"
              >
                Tutup Detail
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
