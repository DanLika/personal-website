import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

// Components
import { HeroAvatar } from "./HeroAvatar";
import { CTAButton } from "../ui/CTAButton";

/**
 * Glass morphism configuration constants
 */
const GLASS_CONFIG = {
  containerOpacity: 0.02,
  borderOpacity: 0.06,
  blurOpacity: 0.35,
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
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.itemDuration,
      ease: ANIMATION_CONFIG.itemEase
    },
  },
};

/**
 * Glass card animation for the main container
 * NOTE: Only animate opacity, let children handle transforms to avoid competing animations
 */
const glassCardVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
};

/**
 * Hero - Main hero section component
 *
 * Features:
 * - Content-based height (no viewport constraints)
 * - Glass morphism card container
 * - Animated avatar with neon glow and reflection effects
 * - Decrypted text animation for title (desktop only)
 * - AutoSizeText subtitle (max 2 lines, auto-shrinks to fit)
 * - Magnetic CTA button with neon styling
 * - Fully responsive layout (360px → 2000px)
 *
 * Layout Strategy:
 * - Hero sizes to content, allowing FeaturedProject to peek in on initial load
 * - Top padding clears navbar (80px mobile → 96px desktop)
 * - Bottom padding creates breathing room before next section
 */
export const Hero = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

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

  // Get title and ensure "with AI" / "uz AI" stays together (non-breaking space)
  // This prevents orphaned "AI" word on second line
  const heroTitle = t("hero.title")
    .replace(/ with AI$/, "\u00A0with\u00A0AI")  // EN: keep "with AI" together
    .replace(/ uz AI$/, "\u00A0uz\u00A0AI");     // BS: keep "uz AI" together

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full bg-transparent text-white overflow-hidden"
      aria-label="Hero section"
    >

      {/* ===== MAIN CONTENT ===== */}
      {/*
        Layout Strategy:
        - Content-based height (no viewport constraints)
        - Top padding clears navbar: 80px mobile, 88px sm, 96px md+
        - Bottom padding creates space before FeaturedProject
        - On tall devices, FeaturedProject peeks in at ~20-30%
      */}
      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 md:px-12 lg:px-16 pt-20 sm:pt-[88px] md:pt-24 pb-8 sm:pb-10 md:pb-12">
        {/* Glass morphism card container - sizes to content, not viewport */}
        <motion.div
          variants={glassCardVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-[95%] sm:max-w-[90%] md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1200px]"
        >
          {/* Outer subtle glow */}
          <div
            className="absolute -inset-px rounded-[24px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] blur-xl opacity-20 -z-10"
            style={{
              background: `linear-gradient(135deg, rgba(59, 201, 255, 0.2) 0%, rgba(59, 201, 255, 0.05) 50%, rgba(59, 201, 255, 0.15) 100%)`,
            }}
          />

          {/* Glass card - content-sized with responsive padding */}
          <div
            className="relative rounded-[20px] sm:rounded-[28px] md:rounded-[36px] lg:rounded-[44px] xl:rounded-[48px] p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 overflow-hidden"
            style={{
              background: `rgba(255, 255, 255, ${GLASS_CONFIG.containerOpacity})`,
              border: `1px solid rgba(255, 255, 255, ${GLASS_CONFIG.borderOpacity})`,
              boxShadow: `0 4px 24px 0 rgba(0, 0, 0, 0.2)`,
            }}
          >
            {/* Blurred hero image as card background - creates reflection effect */}
            <div
              className="absolute inset-0 rounded-[20px] sm:rounded-[28px] md:rounded-[36px] lg:rounded-[44px] xl:rounded-[48px] overflow-hidden pointer-events-none flex items-center justify-center"
              style={{ zIndex: 0 }}
            >
              {/* Inner container - responsive sizing aligned with avatar */}
              <div
                className="relative w-[300px] h-[320px] sm:w-[380px] sm:h-[420px] md:w-[460px] md:h-[520px] lg:w-[540px] lg:h-[620px] xl:w-[580px] xl:h-[680px]"
                style={{ marginTop: '-30px' }}
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
              className="absolute w-[60%] sm:w-[55%] md:w-[50%] h-[90%] blur-3xl pointer-events-none"
              style={{
                left: '50%',
                top: 'calc(50% - 20px)',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
                opacity: GLASS_CONFIG.glowReflectionOpacity,
                background: `
                  radial-gradient(
                    ellipse 100% 150% at 50% 30%,
                    rgba(59, 201, 255, 0.2) 0%,
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
              className="flex flex-col items-center text-center relative z-10 py-4 sm:py-6 md:py-8 lg:py-10"
            >
              {/* Avatar with all effects */}
              <motion.div variants={itemVariants}>
                <HeroAvatar
                  imageSrc="/hero-me.avif"
                  imageAlt="Portrait"
                  glowColor="#3BC9FF"
                />
              </motion.div>

              {/* Title - Responsive sizing: 34px → 72px (H1 must be largest on page) */}
              <motion.h1
                variants={itemVariants}
                className="font-extrabold font-space text-white leading-tight mt-5 sm:mt-6 md:mt-8 lg:mt-10 text-[34px] sm:text-[38px] md:text-5xl lg:text-[56px] xl:text-[64px] 2xl:text-[72px] px-2 sm:px-4 max-w-full text-center break-words"
                style={{ textWrap: 'balance' }}
              >
                {heroTitle}
              </motion.h1>

              {/* Subtitle - Fixed smaller size */}
              <motion.p
                variants={itemVariants}
                className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 text-white/70 text-sm sm:text-base md:text-lg lg:text-xl max-w-[90%] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[640px] px-2 text-center leading-relaxed"
              >
                {t("hero.subtitle")}
              </motion.p>

              {/* CTA Button - Filled cyan style */}
              <motion.div variants={itemVariants} className="mt-6 sm:mt-7 md:mt-8 lg:mt-10">
                <CTAButton onClick={handleCtaClick}>
                  <span>{t("hero.cta")}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </CTAButton>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
