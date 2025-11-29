import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CircuitBackground } from "./CircuitBackground";
import { PhonePlaceholder } from "./PhonePlaceholder";
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
          src={`/${name.toLowerCase()}.png`}
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

  const techStack = ["React", "Flutter", "Stripe", "Firebase", "NodeJS", "MongoDB"];

  return (
    <section className="relative w-full py-24 px-6 overflow-hidden">
      {/* Sci-Fi Circuit Background */}
      <CircuitBackground />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <Link to="/case-study/rabbooking" className="block group">
          {/* Spotlight Effect Container */}
          <div className="relative">
            {/* Mouse-following spotlight glow */}
            <div className="absolute inset-0 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div 
                className="absolute inset-0 rounded-[40px]"
                style={{
                  background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 201, 255, 0.3) 0%, transparent 50%)',
                  filter: 'blur(20px)'
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
                }}
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
              className="relative backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[40px] overflow-hidden transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_0_40px_rgba(59,201,255,0.2)] cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
              }}
            >
              {/* Inner Glow */}
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
              
              {/* Content Container */}
              <div className="relative z-10 grid md:grid-cols-2 gap-12 p-12 lg:p-16">
                
                {/* Left Side - Content */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-8"
                >
                  {/* Featured Badge */}
                  <div className="inline-flex">
                    <div className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 backdrop-blur-sm">
                      <span className="text-cyan-400 text-sm font-semibold tracking-wider">
                        {t("projects.featured.tag")}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl md:text-5xl font-bold font-space text-white leading-tight">
                    RabBooking App
                  </h2>

                  {/* Description */}
                  <p className="text-white/70 text-lg leading-relaxed">
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
                  {/* 3D Tilted Phone */}
                  <div className="relative z-10">
                    <TiltedCard>
                      <PhonePlaceholder />
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

              {/* Glass Border Highlight */}
              <div className="absolute inset-0 rounded-[40px] border border-transparent [border-image:linear-gradient(45deg,rgba(59,201,255,0.3),rgba(6,182,212,0.1),rgba(59,201,255,0.3))_1] pointer-events-none" />
            </motion.div>
          </div>
        </Link>
      </div>
    </section>
  );
};
