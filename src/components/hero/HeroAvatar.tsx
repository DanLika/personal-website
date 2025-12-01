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
 * - Responsive sizing
 * - No 3D tilt or complex animations
 */
export const HeroAvatar = ({
  imageSrc = "/hero-me.avif",
  imageAlt = "Portrait",
  glowColor = "#3BC9FF",
}: HeroAvatarProps) => {
  return (
    <div className="relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px] lg:w-[280px] lg:h-[280px]">
      {/* Outer glow layer - soft ambient light */}
      <div
        className="absolute -inset-4 rounded-[40px] md:rounded-[48px] blur-2xl opacity-60 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(59, 201, 255, 0.15) 0%, rgba(59, 201, 255, 0.08) 40%, transparent 70%)`,
        }}
      />

      {/* Main avatar container */}
      <div
        className="relative w-full h-full rounded-[32px] md:rounded-[40px] overflow-hidden border-2"
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
        />

        {/* Inner border glow accent */}
        <div
          className="absolute inset-0 z-15 pointer-events-none rounded-[30px] md:rounded-[38px]"
          style={{
            boxShadow: `inset 0 0 20px rgba(59, 201, 255, 0.19), inset 0 0 40px rgba(59, 201, 255, 0.08)`,
          }}
        />
      </div>
    </div>
  );
};

export default HeroAvatar;
