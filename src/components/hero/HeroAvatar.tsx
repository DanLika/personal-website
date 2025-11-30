import { motion, useMotionValue, useTransform, useSpring, type Variants } from "framer-motion";
import { useState, useRef } from "react";

interface HeroAvatarProps {
  /** Path to the avatar image */
  imageSrc?: string;
  /** Alt text for the image */
  imageAlt?: string;
  /** Primary glow color in hex */
  glowColor?: string;
  /** Enable/disable the animated diagonal reflection */
  enableReflection?: boolean;
  /** Enable/disable the pulsing glow animation */
  enablePulsingGlow?: boolean;
}

/**
 * HeroAvatar - An enhanced avatar component with neon glow and glass effects
 * 
 * Features:
 * - Animated pulsing neon border glow
 * - Moving diagonal light reflection overlay
 * - Responsive sizing
 * - Hover interactions with 3D tilt effect
 * 
 * @example
 * ```tsx
 * <HeroAvatar 
 *   imageSrc="/hero-me.avif"
 *   glowColor="#3BC9FF"
 *   enableReflection={true}
 *   enablePulsingGlow={true}
 * />
 * ```
 */
export const HeroAvatar = ({
  imageSrc = "/hero-me.avif",
  imageAlt = "Portrait",
  glowColor = "#3BC9FF",
  enableReflection = true,
  enablePulsingGlow = true,
}: HeroAvatarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for 3D tilt effect on hover
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations for tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 20,
  });

  // Handle mouse movement for 3D tilt
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((event.clientX - centerX) / rect.width);
    mouseY.set((event.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Pulsing glow animation variants
  const glowVariants: Variants = {
    initial: {
      boxShadow: `0 0 30px ${glowColor}66, 0 0 60px ${glowColor}33, inset 0 0 20px ${glowColor}1a`,
    },
    animate: {
      boxShadow: [
        `0 0 30px ${glowColor}66, 0 0 60px ${glowColor}33, inset 0 0 20px ${glowColor}1a`,
        `0 0 50px ${glowColor}80, 0 0 100px ${glowColor}4d, inset 0 0 30px ${glowColor}26`,
        `0 0 30px ${glowColor}66, 0 0 60px ${glowColor}33, inset 0 0 20px ${glowColor}1a`,
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Container entry animation
  const containerVariants: Variants = {
    hidden: {
      scale: 0.85,
      opacity: 0,
      filter: "blur(10px)",
    },
    visible: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.22, 0.61, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px] lg:w-[280px] lg:h-[280px] cursor-pointer"
    >
      {/* Outer glow layer - soft ambient light */}
      <div
        className="absolute -inset-4 rounded-[40px] md:rounded-[48px] blur-2xl opacity-60 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor}40 0%, ${glowColor}20 40%, transparent 70%)`,
        }}
      />

      {/* Secondary glow - vertical elongated reflection like in AI image */}
      <motion.div
        className="absolute -inset-8 rounded-[48px] blur-3xl opacity-40 pointer-events-none"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${glowColor}30 30%, ${glowColor}50 50%, ${glowColor}30 70%, transparent 100%)`,
        }}
      />

      {/* Main avatar container with animated border glow */}
      <motion.div
        variants={enablePulsingGlow ? glowVariants : undefined}
        initial="initial"
        animate={enablePulsingGlow ? "animate" : "initial"}
        className="relative w-full h-full rounded-[32px] md:rounded-[40px] overflow-hidden border-2 transition-all duration-300"
        style={{
          borderColor: glowColor,
          transform: "translateZ(20px)",
        }}
      >
        {/* Background gradient behind image */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, ${glowColor}20 0%, transparent 50%, ${glowColor}10 100%)`,
          }}
        />

        {/* The actual avatar image */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover relative z-10"
          loading="eager"
        />

        {/* Animated diagonal light reflection overlay */}
        {enableReflection && (
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[30px] md:rounded-[38px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Moving reflection shine - more visible */}
            <motion.div
              className="absolute w-[300%] h-[60%]"
              style={{
                background: `linear-gradient(
                  105deg,
                  transparent 0%,
                  transparent 35%,
                  rgba(255, 255, 255, 0.1) 42%,
                  rgba(255, 255, 255, 0.4) 48%,
                  rgba(255, 255, 255, 0.6) 50%,
                  rgba(255, 255, 255, 0.4) 52%,
                  rgba(255, 255, 255, 0.1) 58%,
                  transparent 65%,
                  transparent 100%
                )`,
                top: "-30%",
                left: "-100%",
              }}
              animate={{
                left: ["-150%", "150%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut",
              }}
            />

            {/* Static glass edge highlight - always visible */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(
                  135deg,
                  rgba(255, 255, 255, 0.25) 0%,
                  rgba(255, 255, 255, 0.1) 20%,
                  transparent 50%,
                  transparent 80%,
                  rgba(255, 255, 255, 0.05) 100%
                )`,
              }}
            />
          </motion.div>
        )}

        {/* Inner border glow accent */}
        <div
          className="absolute inset-0 z-15 pointer-events-none rounded-[30px] md:rounded-[38px]"
          style={{
            boxShadow: `inset 0 0 20px ${glowColor}30, inset 0 0 40px ${glowColor}15`,
          }}
        />
      </motion.div>

      {/* Corner accent lights */}
      <motion.div
        className="absolute -top-1 -left-1 w-8 h-8 rounded-full blur-md pointer-events-none"
        style={{ background: glowColor }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full blur-md pointer-events-none"
        style={{ background: glowColor }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [0.8, 1.1, 0.8],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </motion.div>
  );
};

export default HeroAvatar;