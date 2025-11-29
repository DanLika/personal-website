import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ParticleBg } from "./ParticleBg";
import { HeroAvatar } from "./HeroAvatar";
import { GlassFrame } from "../ui/GlassFrame";
import { NeonButton } from "../ui/NeonButton";
import { DecryptedText } from "../ui/DecryptedText";
import { MagnetButton } from "../ui/MagnetButton";
import { SpotlightCard } from "../ui/SpotlightCard";
import { Navbar } from "../Navbar";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.14,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as const },
  },
};

export const Hero = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Helper to render title with white text and neon blue "AI"
  const renderDecryptedTitle = () => {
    const mainText = "Full-Stack Development Enhanced with ";
    const aiText = "AI";
    
    return (
      <>
        <DecryptedText
          text={mainText}
          animateOn="view"
          revealDirection="start"
          speed={60}
          maxIterations={10}
          sequential={true}
          className="text-white"
          encryptedClassName="text-white/60"
          parentClassName="inline"
        />
        <DecryptedText
          text={aiText}
          animateOn="view"
          revealDirection="start"
          speed={60}
          maxIterations={10}
          sequential={true}
          className="text-neon"
          encryptedClassName="text-neon/60"
          parentClassName="inline"
        />
      </>
    );
  };

  return (
    <section className="relative w-full min-h-screen bg-[#050505] text-white font-space overflow-hidden">
      {/* Deep Space Background */}
      <div className="absolute inset-0 z-0">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-60" 
             style={{
               background: 'radial-gradient(circle at top left, rgba(59,201,255,0.15), transparent 40%)'
             }} />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full opacity-50" 
             style={{
               background: 'radial-gradient(circle at bottom right, rgba(59,201,255,0.12), transparent 50%)'
             }} />
        
        {/* Particles/Stars */}
        <ParticleBg />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center min-h-screen px-6 py-10">
        <SpotlightCard 
          className="w-full max-w-6xl" 
          spotlightColor="rgba(59, 201, 255, 0.4)"
        >
          <GlassFrame className="w-full max-w-6xl">
            <Navbar />

          {/* Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 flex flex-col items-center text-center px-8 pb-16 pt-4 gap-8"
          >
            <motion.div variants={itemVariants}>
              <HeroAvatar />
            </motion.div>

            <div className="space-y-4 max-w-[700px] mx-auto text-center">
              <motion.h1
                variants={itemVariants}
                className="font-bold font-space text-white leading-tight line-clamp-2"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 3.5rem)'
                }}
              >
                {renderDecryptedTitle()}
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-sm md:text-base text-white/70"
              >
                {t("hero.subtitle")}
              </motion.p>
            </div>

            <motion.div variants={itemVariants}>
              <MagnetButton
                magnetStrength={2}
                padding={100}
                activeTransition="transform 0.3s ease-out"
                inactiveTransition="transform 0.4s ease-in-out"
                className="overflow-visible"
              >
                <NeonButton
                  variant="primary"
                  className="px-10 py-4 text-lg font-bold shadow-[0_0_20px_#3BC9FF] rounded-full"
                  onClick={() => window.open("mailto:your.email@example.com", "_blank")}
                >
                  {t("hero.cta")}
                </NeonButton>
              </MagnetButton>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[11px] text-white/50"
            >
              <div className="w-[22px] h-[36px] rounded-full border border-white/30 flex items-start justify-center p-1">
                <motion.div
                  animate={{ y: [0, 10, 0], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-[3px] h-[8px] rounded-full bg-white/70"
                />
              </div>
              <span>{t("hero.scrollLabel", "Scroll")}</span>
            </motion.div>
          </motion.div>
        </GlassFrame>
        </SpotlightCard>
      </div>

      {/* Mobile */}
      <div className="md:hidden relative min-h-screen flex flex-col overflow-x-hidden">
        <Navbar />
        {menuOpen && (
          <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-neon font-semibold text-sm">hadzic</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center"
                aria-label="Close menu"
              >
                <span className="block w-5 h-[2px] bg-white rotate-45 translate-y-[1px]" />
                <span className="block w-5 h-[2px] bg-white -rotate-45 -translate-y-[1px]" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col items-center justify-center gap-6 text-lg text-white/80">
              <button onClick={() => setMenuOpen(false)}>{t("nav.links.home")}</button>
              <button onClick={() => setMenuOpen(false)}>{t("nav.links.projects")}</button>
              <button onClick={() => setMenuOpen(false)}>{t("nav.links.about")}</button>
              <button onClick={() => setMenuOpen(false)}>{t("nav.links.contact")}</button>
            </nav>
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-10 text-center gap-8"
        >
          <motion.div variants={itemVariants} className="w-full max-w-xs mx-auto">
            <HeroAvatar fullWidthOnMobile />
          </motion.div>

          <div className="space-y-4 max-w-[700px] mx-auto text-center px-2">
            <motion.h1
              variants={itemVariants}
              className="font-bold font-space text-white leading-tight line-clamp-2"
              style={{
                fontSize: 'clamp(1.25rem, 5vw, 2rem)'
              }}
            >
              {renderDecryptedTitle()}
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-sm text-white/70"
            >
              {t("hero.subtitle")}
            </motion.p>
          </div>

          <motion.div variants={itemVariants}>
            <MagnetButton 
              padding={100}
              magnetStrength={2}
              disabled={false}
              activeTransition="transform 0.3s ease-out"
              inactiveTransition="transform 0.5s ease-in-out"
              className="overflow-visible"
            >
              <NeonButton 
                variant="secondary"
                className="px-10 py-4 text-lg font-bold shadow-[0_0_20px_#3BC9FF] rounded-full"
              >
                {t("hero.cta")}
              </NeonButton>
            </MagnetButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
