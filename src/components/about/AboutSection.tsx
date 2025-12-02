import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MagnetButton } from "../ui/MagnetButton";
import { useSpotlight } from "../../hooks/useSpotlight";

const TECH_STACK = [
  "Flutter",
  "FlutterFlow",
  "React",
  "Tailwind",
  "Supabase",
  "Firebase"
];

interface TechIconProps {
  tech: string;
  index: number;
}

// Icons that need brightness boost (dark icons) - different levels
const DARK_ICONS_HIGH = ['resend', 'webflow', 'seo']; // Need more brightness
const DARK_ICONS_LOW = ['figma', 'tailwind']; // Need less brightness

const TechIcon: React.FC<TechIconProps> = ({ tech, index }) => {
  const techLower = tech.toLowerCase();
  const isHighBrightness = DARK_ICONS_HIGH.includes(techLower);
  const isLowBrightness = DARK_ICONS_LOW.includes(techLower);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: 0.8 + index * 0.1,
        type: "spring",
        stiffness: 200
      }}
      className="relative group cursor-pointer"
    >
      <MagnetButton
        magnetStrength={8}
        padding={40}
        activeTransition="transform 0.2s ease-out"
        inactiveTransition="transform 0.4s ease-in-out"
        className="relative group"
      >
        <div className="flex flex-col items-center space-y-2">
          {/* Icon Container */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 flex items-center justify-center transition-all duration-300 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(59,201,255,0.4)]">
            <img
              src={`/${tech.toLowerCase()}.avif`}
              alt={tech}
              className={`w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] ${isHighBrightness ? 'brightness-[1.8] contrast-[1.1]' : ''} ${isLowBrightness ? 'brightness-[1.3]' : ''}`}
              onError={(e) => {
                // Fallback to text if image not found
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-cyan-400 text-xs font-bold">${tech.slice(0, 3).toUpperCase()}</span>`;
                }
              }}
            />
          </div>
          {/* Tech Name */}
          <span className="text-white/70 text-xs font-medium text-center">
            {tech}
          </span>
        </div>
      </MagnetButton>
    </motion.div>
  );
};

export const AboutSection = () => {
  const { t } = useTranslation();
  const { handleMouseMove, handleTouchMove, cleanup } = useSpotlight();

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <section id="about" className="relative w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-transparent overflow-hidden">

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto group">
        {/* Spotlight Effect Container */}
        <div className="relative">
          {/* Outer spotlight glow that follows mouse/touch */}
          <div
            className="absolute -inset-[2px] rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 201, 255, 0.2) 0%, transparent 50%)',
              filter: 'blur(30px)'
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden transition-all duration-500"
            style={{
              background: 'linear-gradient(to bottom right, rgba(6,182,212,0.05), transparent, rgba(59,130,246,0.05)), rgba(0,0,0,0.4)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.1)'
            }}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >

          {/* Content - Centered Vertical Layout */}
          <div className="relative z-10 flex flex-col items-center text-center p-6 sm:p-8 md:p-10 lg:p-12 space-y-6 sm:space-y-8">

            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 blur-2xl opacity-60" />

              {/* Photo Container */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-cyan-400/30 shadow-[0_0_30px_rgba(59,201,255,0.3)]">
                <img
                  src="/about_me.avif"
                  alt="Developer Photo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg width='160' height='160' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='160' height='160' fill='%230A0A0A'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%233BC9FF' font-family='Arial' font-size='14'%3EPhoto%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold font-space text-white leading-tight line-clamp-2"
            >
              {t("about.title")}
            </motion.h2>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 backdrop-blur-sm">
                <span className="text-cyan-400 text-sm font-semibold tracking-wider">
                  {t("about.badge")}
                </span>
              </div>
            </motion.div>

            {/* Body Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-2xl space-y-5"
            >
              <p className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed">
                {t("about.p1")}
              </p>
              <p className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed">
                {t("about.p2")}
              </p>
              <p className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed">
                {t("about.p3")}
              </p>
            </motion.div>

            {/* Tech Stack Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="w-full space-y-6 pt-4"
            >
              <h3 className="text-white/50 text-sm font-medium tracking-wider uppercase">
                {t("about.tech_stack")}
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                {TECH_STACK.map((tech, index) => (
                  <TechIcon key={tech} tech={tech} index={index} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Glass Border Highlight - Removed border-image due to rendering issues */}
        </motion.div>
      </div>
    </div>
    </section>
  );
};
