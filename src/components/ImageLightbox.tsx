import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Calendar } from 'lucide-react';
import { GalleryItem } from '../types';

interface ImageLightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-w-4xl w-full flex flex-col items-center z-10"
        >
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-2xl max-h-[75vh] overflow-hidden flex items-center justify-center">
            <img
              src={item.image}
              alt={item.title}
              className="max-h-[65vh] w-auto object-contain rounded-lg"
            />
          </div>

          <div className="mt-4 text-center text-white max-w-xl">
            <span className="text-[#c1ecd4] text-xs font-bold uppercase tracking-widest block mb-1">
              {item.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{item.title}</h3>
            <p className="text-sm text-white/80 mb-3">{item.caption}</p>

            <div className="flex justify-center items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {item.date}
              </span>
              {item.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.location}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
