import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MagnetButton } from "../ui/MagnetButton";
import { TiltedCard } from "../ui/TiltedCard";
import React from "react";
import { projectsData } from "../../data/projects";

// Map project IDs to mockup images
const MOCKUP_IMAGES: Record<string, string> = {
  'syncbooking-saas': '/syncbooking-mockup.avif',     // SyncBooking SaaS platform
  'ironlife': '/ironlife-mockup.avif',                // IronLife Webflow site
  'pizzeria-bestek': '/pizzeria-mockup.avif',         // Pizzeria ordering system
  'flutterflow-templates': '/flutterflow-mockup.avif' // FlutterFlow templates
};

// Convert projectsData to PROJECTS format for ProjectList
// Exclude SyncBooking since it's featured separately
const PROJECTS = Object.values(projectsData)
  .filter(project => project.id !== 'syncbooking-saas')
  .map(project => ({
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
  return (
    <MagnetButton
      magnetStrength={6}
      padding={30}
      activeTransition="transform 0.2s ease-out"
      inactiveTransition="transform 0.4s ease-in-out"
      className="relative group"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 flex items-center justify-center transition-all duration-300 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(59,201,255,0.4)]">
        <img
          src={`/${tech.toLowerCase()}.avif`}
          alt={tech}
          className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
          onError={(e) => {
            // Fallback to text abbreviation if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `<span class="text-cyan-400 text-xs font-bold">${tech.slice(0, 2).toUpperCase()}</span>`;
            }
          }}
        />
      </div>
    </MagnetButton>
  );
};

// Removed MockupImage component - now using TiltedCard directly with clean images

export const ProjectList = () => {
  const { t } = useTranslation();

  return (
    <section id="projects" className="relative w-full py-20 px-6 md:px-12 lg:px-24 bg-transparent overflow-hidden">

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-space text-white mb-4 leading-tight line-clamp-2">
            {t("projects.list.title", "More Projects")}
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-white/60 leading-relaxed">
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
                      background: 'radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 201, 255, 0.2) 0%, transparent 50%)',
                      filter: 'blur(30px)'
                    }}
                  />

                  {/* Glass Card */}
                  <motion.div
                    className="relative backdrop-blur-md rounded-[30px] overflow-visible transition-all duration-500 cursor-pointer"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      boxShadow: '0 0 0 1px rgba(59, 201, 255, 0) inset, 0 4px 24px 0 rgba(0, 0, 0, 0.2)'
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

                      // Dynamic border glow on hover
                      e.currentTarget.style.boxShadow = `0 0 0 1px rgba(59, 201, 255, 0.6) inset, 0 0 40px rgba(59, 201, 255, 0.2)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 0 1px rgba(59, 201, 255, 0) inset, 0 4px 24px 0 rgba(0, 0, 0, 0.2)';
                    }}
                  >

                    {/* Inner Glow */}
                    <div
                      className="absolute inset-0 rounded-[30px] pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(59, 201, 255, 0.05) 0%, rgba(59, 201, 255, 0.02) 50%, rgba(59, 201, 255, 0.04) 100%)',
                        mixBlendMode: 'overlay'
                      }}
                    />

                    {/* Glass Sheen */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-500 rounded-[30px] overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)'
                      }}
                    />

                    {/* Content Container */}
                    <div className="relative z-10 grid md:grid-cols-5 gap-8 p-8 overflow-visible">

                      {/* Left Side - Content (60% on desktop) */}
                      <div className="md:col-span-3 space-y-4">
                        {/* Tag */}
                        <div className="inline-flex">
                          <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40">
                            <span className="text-cyan-400 text-xs font-semibold tracking-wider line-clamp-1">
                              {project.tag}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-space text-white group-hover:text-cyan-400 transition-colors duration-300 leading-tight line-clamp-2">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm md:text-base lg:text-lg text-white/60 leading-relaxed line-clamp-3">
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
                      <div className="md:col-span-2 flex items-center justify-center relative overflow-visible">
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
                            src={project.mockupImage}
                            alt={`${project.title} Mockup`}
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
