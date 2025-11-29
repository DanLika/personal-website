import { motion } from "framer-motion";
import { MagnetButton } from "../ui/MagnetButton";

const TECH_STACK = [
  "React",
  "Flutter", 
  "FlutterFlow",
  "Supabase",
  "Firebase",
  "Stripe"
];

interface TechIconProps {
  tech: string;
  index: number;
}

const TechIcon: React.FC<TechIconProps> = ({ tech, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
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
              src={`/${tech.toLowerCase()}.png`}
              alt={tech}
              className="w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
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
  return (
    <section className="relative w-full py-24 px-6">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Spotlight Effect Container */}
        <div className="relative group">
          {/* Mouse-following spotlight glow */}
          <div className="absolute inset-0 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div 
              className="absolute inset-0 rounded-[40px]"
              style={{
                background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.1) 0%, rgba(59, 201, 255, 0.2) 30%, transparent 60%)',
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
          
          {/* Glass Panel */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl group-hover:border-white/20 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] cursor-pointer"
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
          
          {/* Content Grid */}
          <div className="relative z-10 grid md:grid-cols-2 gap-12 lg:gap-16 p-12 lg:p-16">
            
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold font-space text-white"
              >
                About Me
              </motion.h2>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex"
              >
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 backdrop-blur-sm">
                  <span className="text-cyan-400 text-sm font-semibold tracking-wider">
                    AI-Augmented Builder
                  </span>
                </div>
              </motion.div>

              {/* Body Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-6"
              >
                <p className="text-white/70 leading-relaxed text-lg">
                  I'm a full-stack developer who builds modern web and mobile apps using AI-optimized workflows. I combine Flutter, React, Supabase, Firebase and Stripe to deliver fast, scalable and clean solutions.
                </p>
                <p className="text-white/70 leading-relaxed text-lg">
                  I leverage intelligent tools and machine learning to streamline performance and create more intuitive user experiences across all my projects.
                </p>
                <p className="text-white/70 leading-relaxed text-lg">
                  My passion is bringing innovative ideas to life, from concept to ensuring every application is robust, efficient, and future-proof.
                </p>
              </motion.div>

              {/* Tech Stack Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-6"
              >
                <h3 className="text-white/50 text-sm font-medium tracking-wider uppercase">
                  Tech Stack
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-6">
                  {TECH_STACK.map((tech, index) => (
                    <TechIcon key={tech} tech={tech} index={index} />
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center"
            >
              {/* Photo Frame */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-white/20 to-cyan-400/20 blur-xl opacity-60" />
                
                {/* Photo Container */}
                <div className="relative rounded-[40px] overflow-hidden border border-white/20 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                  <img
                    src="/input_file_6.png"
                    alt="Developer at laptop"
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      // Fallback placeholder if image not found
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='400' fill='%230A0A0A'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%233BC9FF' font-family='Arial' font-size='20'%3EDeveloper Photo%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  
                  {/* Glass Overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)'
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Glass Border Highlight */}
          <div className="absolute inset-0 rounded-[40px] border border-transparent [border-image:linear-gradient(45deg,rgba(59,201,255,0.3),rgba(6,182,212,0.1),rgba(59,201,255,0.3))_1] pointer-events-none" />
        </motion.div>
        </div>
      </div>
    </section>
  );
};
