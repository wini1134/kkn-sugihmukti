import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play } from 'lucide-react';
import { VideoMemory } from '../types';

interface VideoModalProps {
  video: VideoMemory | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl z-10 border border-white/10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 bg-black/60 text-white hover:bg-white hover:text-black rounded-full transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Video Container */}
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={video.embedUrl}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Details below video */}
          <div className="p-6 bg-[#012d1d] text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#c1ecd4] text-[#002114] text-xs font-bold rounded-full uppercase tracking-wider">
                {video.category}
              </span>
              <span className="text-xs text-white/60">Durasi: {video.duration}</span>
            </div>
            <h3 className="text-xl font-bold font-heading mb-2">{video.title}</h3>
            <p className="text-sm text-white/80 leading-relaxed">{video.description}</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
