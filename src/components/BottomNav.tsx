import React from 'react';
import { Home, Compass, Users, Image, MessageSquare } from 'lucide-react';

export const BottomNav: React.FC = () => {
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(27,67,50,0.08)]">
      <div className="flex justify-around items-center h-16 px-2 pb-safe">
        <button
          onClick={() => scrollTo('hero')}
          className="flex flex-col items-center justify-center text-[#012d1d] hover:text-[#1b4332] active:scale-95 transition-transform"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </button>

        <button
          onClick={() => scrollTo('programs')}
          className="flex flex-col items-center justify-center text-[#414844] hover:text-[#012d1d] active:scale-95 transition-transform"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Program</span>
        </button>

        <button
          onClick={() => scrollTo('team')}
          className="flex flex-col items-center justify-center text-[#414844] hover:text-[#012d1d] active:scale-95 transition-transform"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Tim</span>
        </button>

        <button
          onClick={() => scrollTo('gallery')}
          className="flex flex-col items-center justify-center text-[#414844] hover:text-[#012d1d] active:scale-95 transition-transform"
        >
          <Image className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Galeri</span>
        </button>

        <button
          onClick={() => scrollTo('guestbook')}
          className="flex flex-col items-center justify-center text-[#414844] hover:text-[#012d1d] active:scale-95 transition-transform"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Buku Tamu</span>
        </button>
      </div>
    </nav>
  );
};
