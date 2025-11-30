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

  // Handle touch movement for 3D tilt (mobile)
  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const touch = event.touches[0];
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((touch.clientX - centerX) / rect.width);
    mouseY.set((touch.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Pulsing glow animation variants (reduced intensity from 0.4 to 0.2)
  const glowVariants: Variants = {
    initial: {
      boxShadow: `0 0 30px rgba(59, 201, 255, 0.2), 0 0 60px rgba(59, 201, 255, 0.1), inset 0 0 20px rgba(59, 201, 255, 0.05)`,
    },
    animate: {
      boxShadow: [
        `0 0 30px rgba(59, 201, 255, 0.2), 0 0 60px rgba(59, 201, 255, 0.1), inset 0 0 20px rgba(59, 201, 255, 0.05)`,
        `0 0 50px rgba(59, 201, 255, 0.3), 0 0 100px rgba(59, 201, 255, 0.15), inset 0 0 30px rgba(59, 201, 255, 0.08)`,
        `0 0 30px rgba(59, 201, 255, 0.2), 0 0 60px rgba(59, 201, 255, 0.1), inset 0 0 20px rgba(59, 201, 255, 0.05)`,
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
      onTouchMove={handleTouchMove}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={handleTouchEnd}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px] lg:w-[280px] lg:h-[280px] cursor-pointer"
    >
      {/* Outer glow layer - soft ambient light (reduced intensity) */}
      <div
        className="absolute -inset-4 rounded-[40px] md:rounded-[48px] blur-2xl opacity-60 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(59, 201, 255, 0.15) 0%, rgba(59, 201, 255, 0.08) 40%, transparent 70%)`,
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
          background: `linear-gradient(180deg, transparent 0%, rgba(59, 201, 255, 0.19) 30%, rgba(59, 201, 255, 0.31) 50%, rgba(59, 201, 255, 0.19) 70%, transparent 100%)`,
        }}
      />

      {/* Main avatar container with animated border glow */}
      <motion.div
        variants={enablePulsingGlow ? glowVariants : undefined}
        initial="initial"
        animate={enablePulsingGlow ? "animate" : "initial"}
        whileHover={{
          scale: 1.02,
          boxShadow: `0 0 50px rgba(59, 201, 255, 0.35), 0 0 100px rgba(59, 201, 255, 0.2), inset 0 0 30px rgba(59, 201, 255, 0.1)`,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
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
            background: `linear-gradient(135deg, rgba(59, 201, 255, 0.13) 0%, transparent 50%, rgba(59, 201, 255, 0.06) 100%)`,
          }}
        />

        {/* The actual avatar image */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover relative z-10"
          loading="eager"
        />

        {/* Shimmer effect removed */}

        {/* Inner border glow accent */}
        <div
          className="absolute inset-0 z-15 pointer-events-none rounded-[30px] md:rounded-[38px]"
          style={{
            boxShadow: `inset 0 0 20px rgba(59, 201, 255, 0.19), inset 0 0 40px rgba(59, 201, 255, 0.08)`,
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