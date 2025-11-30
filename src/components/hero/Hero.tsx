import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";

// Components
import { Particles } from "../ui/ParticleBg";
import { HeroAvatar } from "./HeroAvatar";
import { DecryptedText } from "../ui/DecryptedText";
import { CTAButton } from "../ui/CTAButton";

/**
 * Glass morphism configuration constants
 */
const GLASS_CONFIG = {
  containerOpacity: 0.02,
  borderOpacity: 0.06,
  blurOpacity: 0.25,
  blurAmount: 12,
  glowReflectionOpacity: 0.3,
} as const;

/**
 * Animation configuration constants
 */
const ANIMATION_CONFIG = {
  staggerChildren: 0.15,
  delayChildren: 0.2,
  itemDuration: 0.7,
  itemEase: [0.22, 0.61, 0.36, 1] as const,
} as const;

/**
 * Animation variants for staggered content reveal
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: ANIMATION_CONFIG.staggerChildren,
      delayChildren: ANIMATION_CONFIG.delayChildren,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: `blur(${GLASS_CONFIG.blurAmount}px)`
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: ANIMATION_CONFIG.itemDuration,
      ease: ANIMATION_CONFIG.itemEase
    },
  },
};

/**
 * Glass card animation for the main container
 */
const glassCardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 40,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
};

/**
 * Hero - Main hero section component
 * 
 * Features:
 * - Interactive particle background (ReactBits style)
 * - Glass morphism card container
 * - Animated avatar with neon glow and reflection effects
 * - Decrypted text animation for title
 * - Magnetic CTA button with neon styling
 * - Fully responsive layout
 * 
 * @example
 * ```tsx
 * <Hero />
 * ```
 */
export const Hero = () => {
  const { t } = useTranslation();

  /**
   * Smooth scroll to contact section
   */
  const handleCtaClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  /**
   * Renders the title with DecryptedText effect
   * Memoized to prevent unnecessary re-renders
   */
  const renderTitle = useMemo(() => {
    const title = t("hero.title");

    return (
      <DecryptedText
        text={title}
        animateOn="view"
        revealDirection="start"
        speed={45}
        maxIterations={10}
        sequential={true}
        className="text-white"
        encryptedClassName="text-white/50"
        parentClassName="inline"
      />
    );
  }, [t]);

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100svh] md:min-h-screen bg-[#0A0A0A] text-white overflow-hidden"
      aria-label="Hero section"
    >
      {/* ===== BACKGROUND LAYER ===== */}
      {/* Radial gradient base */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 201, 255, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 50% 100%, rgba(59, 201, 255, 0.05) 0%, transparent 50%),
            linear-gradient(180deg, #0A0A0A 0%, #0D1117 50%, #0A0A0A 100%)
          `,
        }}
      />

      {/* Interactive particle background */}
      <div className="absolute inset-0 z-[1]">
        <Particles
          particleCount={150}
          particleSpread={10}
          speed={0.1}
          particleColors={["#ffffff", "#3BC9FF", "#5DD9FF", "#a0e7ff"]}
          moveParticlesOnHover={true}
          particleHoverFactor={1}
          alphaParticles={true}
          particleBaseSize={80}
          sizeRandomness={1}
          cameraDistance={20}
          disableRotation={false}
        />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 flex items-center justify-center min-h-[100svh] md:min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
        {/* Glass morphism card container - responsive width */}
        <motion.div
          variants={glassCardVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-[95%] sm:max-w-[90%] md:max-w-[900px] lg:max-w-[1100px] mx-auto"
        >
          {/* Outer subtle glow */}
          <div
            className="absolute -inset-px rounded-[32px] sm:rounded-[40px] md:rounded-[48px] blur-xl opacity-20 -z-10"
            style={{
              background: `linear-gradient(135deg, rgba(59, 201, 255, 0.2) 0%, rgba(59, 201, 255, 0.05) 50%, rgba(59, 201, 255, 0.15) 100%)`,
            }}
          />

          {/* Glass card - very low opacity */}
          <div
            className="relative rounded-[28px] sm:rounded-[36px] md:rounded-[44px] lg:rounded-[48px] p-5 sm:p-6 md:p-8 lg:p-12 overflow-hidden"
            style={{
              background: `rgba(255, 255, 255, ${GLASS_CONFIG.containerOpacity})`,
              border: `1px solid rgba(255, 255, 255, ${GLASS_CONFIG.borderOpacity})`,
              boxShadow: `0 4px 24px 0 rgba(0, 0, 0, 0.2)`,
            }}
          >
            {/* Blurred hero image as card background - creates reflection effect */}
            <div
              className="absolute inset-0 rounded-[28px] sm:rounded-[36px] md:rounded-[44px] lg:rounded-[48px] overflow-hidden pointer-events-none flex items-center justify-center"
              style={{ zIndex: 0 }}
            >
              {/* Inner container - responsive sizing aligned with avatar */}
              <div
                className="relative w-[160px] h-[200px] sm:w-[200px] sm:h-[250px] md:w-[240px] md:h-[300px] lg:w-[280px] lg:h-[350px]"
              >
                {/* The blurred image layer */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backgroundImage: `url('/hero-me.avif')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 25%',
                    opacity: GLASS_CONFIG.blurOpacity,
                    filter: `blur(${GLASS_CONFIG.blurAmount}px)`,
                  }}
                />
              </div>

              {/* Cyan color overlay to match the neon theme */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(59, 201, 255, 0.05) 0%, rgba(59, 201, 255, 0.02) 50%, rgba(59, 201, 255, 0.04) 100%)',
                  mixBlendMode: 'overlay',
                }}
              />
            </div>

            {/* Vertical glow reflection behind avatar */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[85%] blur-3xl pointer-events-none"
              style={{
                zIndex: 1,
                opacity: GLASS_CONFIG.glowReflectionOpacity,
                background: `
                  radial-gradient(
                    ellipse 100% 150% at 50% 30%,
                    rgba(59, 201, 255, 0.4) 0%,
                    rgba(59, 201, 255, 0.2) 25%,
                    rgba(59, 201, 255, 0.08) 50%,
                    transparent 75%
                  )
                `,
              }}
            />

            {/* Content container with staggered animations */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center text-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 relative z-10"
            >
              {/* Avatar with all effects */}
              <motion.div variants={itemVariants}>
                <HeroAvatar
                  imageSrc="/hero-me.avif"
                  imageAlt="Portrait"
                  glowColor="#3BC9FF"
                  enableReflection={true}
                  enablePulsingGlow={true}
                />
              </motion.div>

              {/* Title - single line on desktop, max 2 lines on mobile */}
              <motion.h1
                variants={itemVariants}
                className="font-extrabold font-space text-white leading-snug md:leading-tight md:whitespace-nowrap px-1 sm:px-2"
                style={{
                  fontSize: "clamp(1rem, 4vw, 2.5rem)",
                }}
              >
                {/* Mobile: allow wrapping, max 2 lines */}
                <span className="md:hidden block line-clamp-2 text-center">
                  {t("hero.title")}
                </span>
                {/* Desktop: single line with DecryptedText effect */}
                <span className="hidden md:block whitespace-nowrap">
                  {renderTitle}
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-xs sm:text-sm md:text-base text-white/60 max-w-[90%] sm:max-w-[500px] md:max-w-[600px] px-1 sm:px-2 leading-relaxed"
              >
                {t("hero.subtitle")}
              </motion.p>

              {/* CTA Button - Filled cyan style */}
              <motion.div
                variants={itemVariants}
                className="mt-1 sm:mt-2"
              >
                <CTAButton onClick={handleCtaClick}>
                  <span>{t("hero.cta")}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </CTAButton>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ===== GRADIENT TRANSITIONS ===== */}
      {/* Bottom fade to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none"
      />

      {/* Top subtle gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0A0A0A] to-transparent z-20 pointer-events-none"
      />
    </section>
  );
};

export default Hero;