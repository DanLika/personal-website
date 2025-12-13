import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Particles } from "../components/ui/ParticleBg";
import { Footer } from "../components/layout/Footer";

interface ApartmanPageProps {
  apartmanNumber: number;
  unitId: string;
}

// Placeholder images using picsum - different seeds for each apartman
const getGalleryImages = (apartmanNumber: number) => [
  `https://picsum.photos/seed/apt${apartmanNumber}-1/800/600`,
  `https://picsum.photos/seed/apt${apartmanNumber}-2/800/600`,
  `https://picsum.photos/seed/apt${apartmanNumber}-3/800/600`,
  `https://picsum.photos/seed/apt${apartmanNumber}-4/800/600`,
  `https://picsum.photos/seed/apt${apartmanNumber}-5/800/600`,
  `https://picsum.photos/seed/apt${apartmanNumber}-6/800/600`,
  `https://picsum.photos/seed/apt${apartmanNumber}-7/800/600`,
  `https://picsum.photos/seed/apt${apartmanNumber}-8/800/600`,
];

export const ApartmanPage: React.FC<ApartmanPageProps> = ({ apartmanNumber, unitId }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [particleKey, setParticleKey] = useState(0);

  const galleryImages = getGalleryImages(apartmanNumber);

  // Detect mobile for particle optimization
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  // Handle page visibility - reinitialize particles when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became visible, reinitialize particles to fix any WebGL context issues
        setParticleKey(prev => prev + 1);
      }
    };

    const handleContextLost = () => {
      // WebGL context was lost, reinitialize particles
      setParticleKey(prev => prev + 1);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('particles-context-lost', handleContextLost);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('particles-context-lost', handleContextLost);
    };
  }, []);

  // Window-level mouse/touch tracking for particles with RAF throttling
  useEffect(() => {
    let rafId: number | null = null;
    let lastUpdate = 0;
    const THROTTLE_MS = 16;
    let pendingX = 0;
    let pendingY = 0;

    const updatePosition = () => {
      rafId = null;
      lastUpdate = performance.now();
      mouseRef.current = { x: pendingX, y: pendingY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = (e.clientX / window.innerWidth) * 2 - 1;
      pendingY = -((e.clientY / window.innerHeight) * 2 - 1);
      const now = performance.now();
      if (now - lastUpdate < THROTTLE_MS) {
        if (!rafId) rafId = requestAnimationFrame(updatePosition);
        return;
      }
      lastUpdate = now;
      mouseRef.current = { x: pendingX, y: pendingY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        pendingX = (touch.clientX / window.innerWidth) * 2 - 1;
        pendingY = -((touch.clientY / window.innerHeight) * 2 - 1);
        const now = performance.now();
        if (now - lastUpdate < THROTTLE_MS) {
          if (!rafId) rafId = requestAnimationFrame(updatePosition);
          return;
        }
        lastUpdate = now;
        mouseRef.current = { x: pendingX, y: pendingY };
      }
    };

    const handleEnd = () => {
      mouseRef.current = { x: 0, y: 0 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleEnd);
    window.addEventListener('touchend', handleEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleEnd);
      window.removeEventListener('touchend', handleEnd);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative min-h-screen bg-[#0A0A0A]">
      {/* Particle Background */}
      {/* Fallback gradient background in case Particles fail */}
      <div className="fixed inset-0 z-0 bg-[#0A0A0A]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 0%, rgba(59, 201, 255, 0.08) 0%, transparent 50%),
              linear-gradient(to bottom, #0A0A0A, #0A0A0A)
            `
          }}
        />
        <Particles
          key={particleKey}
          particleCount={isMobile ? 80 : 100}
          particleSpread={10}
          speed={isMobile ? 0.15 : 0.3}
          particleColors={["#ffffff", "#3BC9FF", "#5DD9FF", "#a0e7ff"]}
          moveParticlesOnHover={true}
          particleHoverFactor={2}
          alphaParticles={true}
          particleBaseSize={isMobile ? 60 : 80}
          sizeRandomness={1}
          cameraDistance={20}
          disableRotation={isMobile}
          externalMouseRef={mouseRef}
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative w-full pt-24 sm:pt-32 pb-12 px-4 sm:px-6 md:px-12 lg:px-16 z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden mb-8"
          >
            <img
              src={`https://picsum.photos/seed/apartman${apartmanNumber}-hero/1200/500`}
              alt={`Apartman ${apartmanNumber}`}
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-space text-white">
                Apartman {apartmanNumber}
              </h1>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 mb-12"
            style={{
              background: 'linear-gradient(to bottom right, rgba(6,182,212,0.05), transparent, rgba(59,130,246,0.05)), rgba(0,0,0,0.4)',
            }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Welcome to Apartman {apartmanNumber}
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Experience the perfect blend of modern comfort and stunning views in our luxurious apartment located in the heart of Zagreb.
              Our spacious accommodation features contemporary design, fully equipped kitchen, and a cozy living area perfect for relaxation.
            </p>
            <p className="text-white/70 leading-relaxed">
              Whether you're visiting for business or leisure, our apartment offers everything you need for a memorable stay.
              Enjoy easy access to local attractions, restaurants, and public transportation. Book your stay today and discover
              the charm of Croatian hospitality!
            </p>
          </motion.div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="relative w-full py-8 px-4 sm:px-6 md:px-12 lg:px-16 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-8"
          >
            Photo Gallery
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
              >
                <img
                  src={img}
                  alt={`Apartment photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING WIDGET SECTION */}
      <section className="relative w-full py-12 px-4 sm:px-6 md:px-12 lg:px-16 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-8"
          >
            Book Your Stay
          </motion.h2>

          {/* BookBed Booking Widget */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden"
          >
            <iframe
              src={`https://bookbed.io/?property=fg5nlt3aLlx4HWJeqliq&unit=${unitId}&embed=true`}
              style={apartmanNumber === 1
                ? { width: '100%', border: 'none', aspectRatio: '1/1.6', minHeight: '560px', maxHeight: '950px' }
                : { width: '100%', border: 'none', aspectRatio: '1/1.4', minHeight: '500px', maxHeight: '850px' }
              }
              allowFullScreen
              title={`Apartman ${apartmanNumber} - Booking`}
            />
          </motion.div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="relative w-full py-12 px-4 sm:px-6 md:px-12 lg:px-16 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-8"
          >
            Location
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden border border-white/10"
          >
            {/* OpenStreetMap iframe - Zagreb, Croatia */}
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=15.9513%2C45.8006%2C15.9913%2C45.8206&amp;layer=mapnik&amp;marker=45.8106%2C15.9713"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map - Zagreb"
              className="w-full h-[300px] sm:h-[400px]"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-sm mt-4 text-center"
          >
            Zagreb, Croatia - City Center
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

// Export individual apartman pages
export const Apartman1Page = () => <ApartmanPage apartmanNumber={1} unitId="Ot2PzlJYSNXjJIGvicHY" />;
export const Apartman2Page = () => <ApartmanPage apartmanNumber={2} unitId="nDEVcN9gEUxDu2O4KyiO" />;
export const Apartman3Page = () => <ApartmanPage apartmanNumber={3} unitId="gMIOos56siO74VkCsSwY" />;
