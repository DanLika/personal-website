import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ParticleBg } from "./ParticleBg";
import { HeroAvatar } from "./HeroAvatar";
import { NeonButton } from "../ui/NeonButton";
import { DecryptedText } from "../ui/DecryptedText";
import { MagnetButton } from "../ui/MagnetButton";

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

  // Helper to render title with DecryptedText effect
  const renderDecryptedTitle = () => {
    const fullTitle = t("hero.title");

    return (
      <DecryptedText
        text={fullTitle}
        animateOn="view"
        revealDirection="start"
        speed={50}
        maxIterations={8}
        sequential={true}
        className="text-white"
        encryptedClassName="text-white/60"
        parentClassName="inline"
      />
    );
  };

  return (
    <section id="hero" className="relative w-full min-h-screen bg-[#0A0A0A] text-white font-space overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 z-0">
        <ParticleBg />
      </div>

      {/* Centered Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 md:px-12 lg:px-24 pt-32 pb-20">
        {/* Glass Morphism Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative w-full max-w-[900px] mx-auto"
        >
          {/* Glass Frame with backdrop blur */}
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-[48px] p-8 md:p-12 lg:p-14 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] overflow-hidden">
            {/* Upright Reflection Behind Avatar - 90% width, 50% height */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[50%] opacity-50 blur-2xl pointer-events-none z-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(59,201,255,0.7) 0%, rgba(59,201,255,0.4) 30%, rgba(59,201,255,0.2) 50%, transparent 70%)',
              }}
            />

            {/* Inner content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center text-center gap-5 md:gap-6 relative z-10"
            >
              {/* Avatar */}
              <motion.div variants={itemVariants}>
                <HeroAvatar />
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={itemVariants}
                className="font-bold font-space text-white leading-tight md:whitespace-nowrap line-clamp-2 md:line-clamp-1"
                style={{
                  fontSize: 'clamp(1.35rem, 3vw, 2.2rem)'
                }}
              >
                {renderDecryptedTitle()}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-sm md:text-base text-white/70 max-w-[600px] px-4"
              >
                {t("hero.subtitle")}
              </motion.p>

              {/* CTA Button */}
              <motion.div variants={itemVariants}>
                <MagnetButton
                  magnetStrength={3}
                  padding={100}
                  activeTransition="transform 0.3s ease-out"
                  inactiveTransition="transform 0.4s ease-in-out"
                  className="overflow-visible"
                >
                  <NeonButton
                    variant="primary"
                    className="px-8 md:px-10 py-3 md:py-4 text-sm md:text-base font-semibold shadow-[0_0_20px_rgba(59,201,255,0.4)] hover:shadow-[0_0_30px_rgba(59,201,255,0.6)] rounded-full transition-shadow duration-300"
                    onClick={() => {
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    {t("hero.cta")}
                  </NeonButton>
                </MagnetButton>
              </motion.div>
            </motion.div>

            {/* Glass shine effect */}
            <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Outer glow */}
          <div className="absolute -inset-[1px] bg-gradient-to-br from-neon/20 to-neon/5 rounded-[48px] blur-xl -z-10" />
        </motion.div>
      </div>
      {/* Bottom Gradient Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
};
