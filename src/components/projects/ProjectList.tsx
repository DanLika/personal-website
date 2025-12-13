import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { MagnetButton } from "../ui/MagnetButton";
import React from "react";
import { projectsData } from "../../data/projects";
import { useSpotlight } from "../../hooks/useSpotlight";
import { ArrowRight } from "lucide-react";

// Map project IDs to mockup images
const MOCKUP_IMAGES: Record<string, string> = {
  'bookbed-saas': '/bookbed-mockup.avif',             // BookBed SaaS platform
  'ironlife': '/ironlife-mockup.avif',                // IronLife Webflow site
  'pizzeria-bestek': '/pizzeria-mockup.avif',         // Pizzeria ordering system
  'flutterflow-templates': '/flutterflow-mockup.avif' // FlutterFlow templates
};

// Get project IDs excluding BookBed (which is featured separately)
const PROJECT_IDS = Object.values(projectsData)
  .filter(project => project.id !== 'bookbed-saas')
  .map(project => project.id);

// Icons that need brightness boost (dark icons) - different levels
const DARK_ICONS_HIGH = ['resend', 'webflow', 'seo']; // Need more brightness
const DARK_ICONS_LOW = ['figma', 'tailwind']; // Need less brightness

const TechIcon: React.FC<{ tech: string }> = ({ tech }) => {
  const techLower = tech.toLowerCase();
  const isHighBrightness = DARK_ICONS_HIGH.includes(techLower);
  const isLowBrightness = DARK_ICONS_LOW.includes(techLower);

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
          className={`w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] ${isHighBrightness ? 'brightness-[1.8] contrast-[1.1]' : ''} ${isLowBrightness ? 'brightness-[1.3]' : ''}`}
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
  const { handleMouseMove, handleTouchMove, cleanup } = useSpotlight();

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Build projects array with i18n translations (inside component so it updates on language change)
  const projects = PROJECT_IDS.map(projectId => {
    const projectData = projectsData[projectId];
    return {
      id: projectId,
      title: t(`caseStudies.${projectId}.title`, projectData.title),
      tag: t(`caseStudies.${projectId}.category`, projectData.category),
      description: t(`caseStudies.${projectId}.tagline`, projectData.description),
      tech: projectData.techStack,
      mockupImage: MOCKUP_IMAGES[projectId] || '/pizzeria-mockup.avif'
    };
  });

  return (
    <section id="projects" className="relative w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-transparent overflow-hidden">

      <div className="max-w-[996px] mx-auto space-y-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-[28px] md:text-[32px] lg:text-4xl xl:text-[40px] 2xl:text-[44px] font-bold font-space text-white mb-4 leading-tight line-clamp-2">
            {t("projects.list.title")}
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-white/60 leading-relaxed">
            {t("projects.list.subtitle")}
          </p>
        </motion.div>

        {/* Projects Stack */}
        <div className="space-y-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 0.61, 0.36, 1]
              }}
              className="group"
            >
              {/* Spotlight Effect Container - No full-card link for better mobile tap feedback */}
              <div className="relative">
                {/* Outer spotlight glow that follows mouse */}
                <div
                  className="absolute -inset-[2px] rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 201, 255, 0.2) 0%, transparent 50%)',
                    filter: 'blur(30px)'
                  }}
                />

                {/* Card with tap feedback */}
                <motion.div
                  className="project-card relative backdrop-blur-xl rounded-[30px] border border-white/10 overflow-visible transition-all duration-300"
                  style={{
                    background: 'linear-gradient(to bottom right, rgba(6,182,212,0.05), transparent, rgba(59,130,246,0.05)), rgba(0,0,0,0.4)',
                    boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.1)'
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                >

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

                      {/* Title - H3 sizing: 20px → 32px (smaller than H2) */}
                      <h3 className="text-xl sm:text-[22px] md:text-2xl lg:text-[28px] xl:text-[30px] 2xl:text-[32px] font-bold font-space text-white group-hover:text-cyan-400 transition-colors duration-300 leading-tight line-clamp-2">
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

                      {/* View Project Button - Only this navigates */}
                      <div className="pt-4">
                        <Link
                          to={`/case-study/${project.id}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 text-cyan-400 text-sm font-semibold transition-all duration-300 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(59,201,255,0.4)] active:scale-95"
                        >
                          <span>{t("projects.viewProject")}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Right Side - Mockup (40% on desktop) */}
                    <div className="md:col-span-2 flex items-center justify-center relative overflow-visible">
                      <img
                        src={project.mockupImage}
                        alt={`${project.title} Mockup`}
                        className="w-full max-w-full h-auto object-cover rounded-2xl aspect-[4/3] drop-shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                        width={550}
                        height={412}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
