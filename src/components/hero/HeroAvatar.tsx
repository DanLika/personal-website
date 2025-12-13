interface HeroAvatarProps {
  /** Path to the avatar image */
  imageSrc?: string;
  /** Alt text for the image */
  imageAlt?: string;
  /** Primary glow color in hex */
  glowColor?: string;
}

/**
 * HeroAvatar - A simple avatar component with neon glow effects
 *
 * Features:
 * - Static neon border glow
 * - Responsive sizing (220px mobile → 380px 2xl desktop)
 * - No 3D tilt or complex animations
 *
 * Responsive sizes:
 * - xs (360px): 220x220px
 * - sm (640px): 260x260px
 * - md (768px): 300x300px
 * - lg (1024px): 340x340px
 * - xl (1280px): 360x360px
 * - 2xl (1536px): 380x380px
 */
export const HeroAvatar = ({
  imageSrc = "/hero-me.avif",
  imageAlt = "Portrait",
  glowColor = "#3BC9FF",
}: HeroAvatarProps) => {
  return (
    <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px] lg:w-[340px] lg:h-[340px] xl:w-[360px] xl:h-[360px] 2xl:w-[380px] 2xl:h-[380px]">
      {/* Glass panel behind avatar - same size as avatar */}
      <div
        className="absolute inset-0 rounded-[32px] sm:rounded-[36px] md:rounded-[40px] lg:rounded-[44px] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(59, 130, 246, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(59, 201, 255, 0.1)',
        }}
      />

      {/* Outer glow layer - soft ambient light */}
      <div
        className="absolute -inset-4 sm:-inset-5 md:-inset-6 rounded-[40px] sm:rounded-[44px] md:rounded-[48px] lg:rounded-[52px] blur-2xl opacity-60 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(59, 201, 255, 0.15) 0%, rgba(59, 201, 255, 0.08) 40%, transparent 70%)`,
        }}
      />

      {/* Main avatar container */}
      <div
        className="relative w-full h-full rounded-[32px] sm:rounded-[36px] md:rounded-[40px] lg:rounded-[44px] overflow-hidden border-2"
        style={{
          borderColor: glowColor,
          boxShadow: `0 0 30px rgba(59, 201, 255, 0.2), 0 0 60px rgba(59, 201, 255, 0.1)`,
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
          fetchPriority="high"
        />

        {/* Inner border glow accent */}
        <div
          className="absolute inset-0 z-15 pointer-events-none rounded-[30px] sm:rounded-[34px] md:rounded-[38px] lg:rounded-[42px]"
          style={{
            boxShadow: `inset 0 0 20px rgba(59, 201, 255, 0.19), inset 0 0 40px rgba(59, 201, 255, 0.08)`,
          }}
        />
      </div>
    </div>
  );
};

export default HeroAvatar;
