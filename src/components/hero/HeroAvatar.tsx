import { motion } from "framer-motion";

interface HeroAvatarProps {
  fullWidthOnMobile?: boolean;
}

export const HeroAvatar = ({ fullWidthOnMobile }: HeroAvatarProps) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
      whileHover={{ scale: 1.05 }}
      className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[350px] md:h-[350px]"
    >
      {/* Neon Glow Behind Avatar */}
      <div className="absolute -inset-2 bg-neon/30 rounded-[32px] md:rounded-[40px] blur-2xl" />

      {/* Avatar Container with Neon Border */}
      <div className="relative w-full h-full rounded-[32px] md:rounded-[40px] overflow-hidden border-2 border-neon shadow-[0_0_30px_rgba(59,201,255,0.6)]">
        {/* The User Photo */}
        <img
          src="/hero-me.avif"
          alt="Portrait"
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  );
};
