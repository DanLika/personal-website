import { motion } from "framer-motion";
import { TiltedCard } from "../ui/TiltedCard";

interface HeroAvatarProps {
  fullWidthOnMobile?: boolean;
}

export const HeroAvatar = ({ fullWidthOnMobile }: HeroAvatarProps) => {
  return (
    <TiltedCard
      scaleOnHover={1.05}
      rotateAmplitude={12}
      showMobileWarning={false}
      showTooltip={false}
      displayOverlayContent={false}
      className={`${fullWidthOnMobile ? "w-full" : "w-[350px] h-[350px] md:w-[350px] md:h-[350px] sm:w-[300px] sm:h-[300px]"}`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
        whileHover={{ scale: 1.02 }}
        className="relative group w-full h-full"
      >
        {/* Glass Portal Container */}
        <div className="relative w-full h-full rounded-[40px] overflow-hidden border border-white/20 shadow-[0_0_60px_-10px_rgba(59,201,255,0.5)]">
          
          {/* Layer 1: The Nebula Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0" />
          
          {/* Layer 2: The User Photo */}
          <img
            src="/hero-me.png"
            alt="Portrait"
            className="absolute inset-0 w-full h-full object-cover scale-105 z-10"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Fallback to placeholder if image not found
              target.src = "data:image/svg+xml,%3Csvg width='350' height='350' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='350' height='350' fill='%231A1A1A'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%233BC9FF' font-family='Arial' font-size='20'%3EHero Image%3C/text%3E%3C/svg%3E";
            }}
          />
          
          {/* Layer 3: The Glass Sheen - Front Overlay */}
          <div 
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, transparent 54%)'
            }}
          />

          {/* Additional Hover Effects */}
          <div className="pointer-events-none absolute -inset-10 rounded-[40px] bg-gradient-to-tr from-white/14 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600 [transform:translate3d(-20%,0,0)_rotate(15deg)]" />
          <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-gradient-to-r from-transparent via-white/18 to-transparent -translate-x-full group-hover:animate-shine" />
        </div>
      </motion.div>
    </TiltedCard>
  );
};
