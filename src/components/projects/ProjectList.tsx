import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MagnetButton } from "../ui/MagnetButton";
import { TiltedCard } from "../ui/TiltedCard";
import React from "react";
import { projectsData } from "../../data/projects";

// Map project IDs to mockup images
const MOCKUP_IMAGES: Record<string, string> = {
  'rabbooking': '/pizzeria-mockup.avif',
  'saasDashboard': '/ironlife-mockup.avif',
  'aiChatbot': '/flutterflow-mockup.avif',
  'uiuxDesign': '/flutterflow-mockup.avif'
};

// Convert projectsData to PROJECTS format for ProjectList
const PROJECTS = Object.values(projectsData).map(project => ({
  id: project.id,
  title: project.title,
  tag: project.category,
  description: project.description,
  tech: project.techStack,
  mockupType: 'laptop' as const, // Default to laptop, can be customized per project
  imageUrl: project.galleryImages[0],
  mockupImage: MOCKUP_IMAGES[project.id] || '/pizzeria-mockup.avif'
}));

const TechIcon: React.FC<{ tech: string }> = ({ tech }) => {
  const getIcon = () => {
    const icons: Record<string, React.ReactElement> = {
      React: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      ),
      Flutter: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      Firebase: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      NodeJS: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      MongoDB: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      Tailwind: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      TypeScript: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      Chartjs: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      Nextjs: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      Webflow: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      Figma: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      JavaScript: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      CSS: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      AI: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      Stripe: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      FlutterFlow: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      "UI/UX Design": (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      )
    };

    return icons[tech] || (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
      </svg>
    );
  };

  return (
    <MagnetButton
      magnetStrength={6}
      padding={30}
      activeTransition="transform 0.2s ease-out"
      inactiveTransition="transform 0.4s ease-in-out"
      className="relative group"
    >
      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-all duration-300">
        <div className="text-cyan-400">
          {getIcon()}
        </div>
      </div>
    </MagnetButton>
  );
};

interface MockupImageProps {
  src: string;
  alt: string;
  className?: string;
}

const MockupImage: React.FC<MockupImageProps> = ({ src, alt, className = "" }) => {
  return (
    <TiltedCard
      rotateAmplitude={15}
      scaleOnHover={1.05}
      showMobileWarning={false}
      showTooltip={false}
      displayOverlayContent={false}
    >
      <motion.div
        className={`relative w-[240px] h-[180px] md:w-[280px] md:h-[210px] rounded-[20px] overflow-hidden border-2 border-neon/40 shadow-[0_0_30px_rgba(59,201,255,0.4)] ${className}`}
        whileHover={{ scale: 1.02 }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
        {/* Glass shine overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)'
          }}
        />
      </motion.div>
    </TiltedCard>
  );
};

export const ProjectList = () => {
  const { t } = useTranslation();

  return (
    <section id="projects" className="relative w-full py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-space text-white mb-4">
            {t("projects.list.title", "More Projects")}
          </h2>
          <p className="text-white/60 text-lg">
            {t("projects.list.subtitle", "Explore my recent work and side projects")}
          </p>
        </motion.div>

        {/* Projects Stack */}
        <div className="space-y-6">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 0.61, 0.36, 1]
              }}
              className="group"
            >
              <Link to={`/case-study/${project.id}`} className="block">
                {/* Spotlight Effect Container */}
                <div className="relative">
                  {/* Outer spotlight glow that follows mouse */}
                  <div
                    className="absolute -inset-[2px] rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 201, 255, 0.4) 0%, transparent 50%)',
                      filter: 'blur(30px)'
                    }}
                  />

                  {/* Glass Card */}
                  <motion.div
                    className="relative bg-[#0A0A0A]/40 backdrop-blur-md border border-[#3BC9FF]/30 rounded-[30px] overflow-hidden transition-all duration-500 cursor-pointer"
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

                      // Dynamic border glow on hover
                      e.currentTarget.style.boxShadow = `0 0 0 1px rgba(59, 201, 255, 0.6) inset, 0 0 40px rgba(59, 201, 255, 0.2)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 0 1px rgba(59, 201, 255, 0) inset';
                    }}
                  >

                    {/* Glass Sheen */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                      style={{
                        background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)'
                      }}
                    />

                    {/* Content Container */}
                    <div className="relative z-10 grid md:grid-cols-5 gap-8 p-8">

                      {/* Left Side - Content (60% on desktop) */}
                      <div className="md:col-span-3 space-y-4">
                        {/* Tag */}
                        <div className="inline-flex">
                          <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40">
                            <span className="text-cyan-400 text-xs font-semibold tracking-wider">
                              {project.tag}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-bold font-space text-white group-hover:text-cyan-400 transition-colors duration-300">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-white/60 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-3 pt-2">
                          {project.tech.map((tech) => (
                            <TechIcon key={tech} tech={tech} />
                          ))}
                        </div>
                      </div>

                      {/* Right Side - Mockup (40% on desktop) */}
                      <div className="md:col-span-2 flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="transform group-hover:translate-y-[-8px] transition-transform duration-500"
                        >
                          <MockupImage
                            src={project.mockupImage}
                            alt={`${project.title} Mockup`}
                            className="transform rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500"
                          />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
