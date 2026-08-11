import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Team } from './components/Team';
import { Gallery } from './components/Gallery';
import { Programs } from './components/Programs';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminProvider } from './context/AdminContext';
import { AdminLoginModal } from './components/AdminLoginModal';
import { MemoryParticles } from './components/MemoryParticles';
import { syncAllLocalToFirebase } from './utils/imageStorage';

export default function App() {
  useEffect(() => {
    // Automatically upload any local filled data to Firebase Cloud so all devices (HP, Vercel) display filled content
    syncAllLocalToFirebase().catch(() => {});
  }, []);

  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col font-sans antialiased overflow-x-hidden relative">
        {/* Memory Nostalgic Particle FX */}
        <MemoryParticles />

        {/* Top Fixed Header App Bar */}
        <Navbar />

        {/* Main Section Content */}
        <main className="flex-1">
          <Hero />
          <About />
          <Team />
          <Gallery />
          <Programs />
          <Testimonials />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Admin Login Modal */}
        <AdminLoginModal />
      </div>
    </AdminProvider>
  );
}

