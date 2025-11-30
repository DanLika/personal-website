import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MagnetButton } from "../ui/MagnetButton";
import { TiltedCard } from "../ui/TiltedCard";

interface TechIconProps {
  name: string;
  className?: string;
}

const TechIcon: React.FC<TechIconProps> = ({ name, className = "" }) => {
  return (
    <MagnetButton
      magnetStrength={8}
      padding={40}
      activeTransition="transform 0.2s ease-out"
      inactiveTransition="transform 0.4s ease-in-out"
      className={`relative group ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300">
        <img
          src={`/${name.toLowerCase()}.avif`}
          alt={name}
          className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
          onError={(e) => {
            // Fallback to text if image not found
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `<span class="text-cyan-400 text-xs font-bold">${name.slice(0, 3).toUpperCase()}</span>`;
            }
          }}
        />
      </div>
    </MagnetButton>
  );
};

export const FeaturedProject = () => {
  const { t } = useTranslation();

  const techStack = ["Flutter", "Firebase", "Stripe", "iCal Integration"];

  return (
    <section className="relative w-full py-24 px-6 md:px-12 lg:px-24 overflow-hidden bg-transparent">

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <Link to="/case-study/syncbooking-saas" className="block group">
          {/* Spotlight Effect Container */}
          <div className="relative">
            {/* Outer spotlight glow that follows mouse */}
            <div
              className="absolute -inset-[2px] rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 201, 255, 0.2) 0%, transparent 50%)',
                filter: 'blur(30px)'
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
              className="relative bg-black/40 backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden transition-all duration-500 cursor-pointer"
              style={{
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.1)'
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Update CSS custom properties for spotlight
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);

                // Update parent div for outer glow
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.querySelector('div')?.style.setProperty('--mouse-x', `${x}px`);
                  parent.querySelector('div')?.style.setProperty('--mouse-y', `${y}px`);
                }
              }}
            >
              {/* Inner Glow */}
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />

              {/* Content Container */}
              <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 p-6 md:p-12 lg:p-16">

                {/* Left Side - Content */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-6 md:space-y-8"
                >
                  {/* Featured Badge */}
                  <div className="inline-flex">
                    <div className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 backdrop-blur-sm">
                      <span className="text-cyan-400 text-xs md:text-sm font-semibold tracking-wider line-clamp-1">
                        {t("projects.featured.tag")}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-space text-white leading-tight line-clamp-2">
                    {t("projects.featured.title")}
                  </h2>

                  {/* Description */}
                  <p className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed line-clamp-4">
                    {t("projects.featured.desc")}
                  </p>

                  {/* Tech Stack */}
                  <div className="space-y-4">
                    <h3 className="text-white/50 text-sm font-semibold tracking-wider">
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {techStack.map((tech, index) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                          whileHover={{ y: -4, scale: 1.1 }}
                          className="cursor-pointer"
                        >
                          <TechIcon name={tech} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Right Side - Visual */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative flex items-center justify-center"
                >
                  {/* 3D Tilted Mockup Image */}
                  <div className="relative z-10 w-full flex justify-center">
                    <TiltedCard
                      rotateAmplitude={15}
                      scaleOnHover={1.05}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={false}
                      containerHeight="auto"
                      containerWidth="100%"
                      className="w-full max-w-md md:max-w-[56rem]"
                    >
                      <motion.img
                        src="/ironlife-mockup.avif"
                        alt="SyncBooking SaaS Mockup"
                        className="w-full h-auto object-cover rounded-2xl aspect-[4/3] drop-shadow-2xl"
                        initial={{
                          opacity: 0,
                          scale: 0.9,
                          filter: 'brightness(1) drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))'
                        }}
                        whileInView={{
                          opacity: 1,
                          scale: 1,
                          filter: 'brightness(1) drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))'
                        }}
                        whileHover={{
                          filter: 'brightness(1.1) drop-shadow(0 30px 60px rgba(59, 201, 255, 0.3))',
                        }}
                        transition={{ duration: 0.4 }}
                        loading="lazy"
                      />
                    </TiltedCard>
                  </div>

                  {/* Floating Orbs */}
                  <motion.div
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl -translate-y-1/2"
                  />
                  <motion.div
                    animate={{
                      y: [0, 20, 0],
                      rotate: [360, 180, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-1/2 right-0 md:right-10 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl -translate-y-1/2"
                  />
                </motion.div>
              </div>

              {/* Glass Border Highlight - Removed border-image due to rendering issues */}
            </motion.div>
          </div>
        </Link>
      </div>
    </section>
  );
};
