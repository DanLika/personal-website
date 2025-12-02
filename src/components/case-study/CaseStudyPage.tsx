import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { projectsData, getNextProject, type ProjectData } from "../../data/projects";
import SimpleGallery from "../ui/SimpleGallery";
import { SubProjectCard } from "./SubProjectCard";
import { Particles } from "../ui/ParticleBg";
import { Footer } from "../layout/Footer";
import { SEO } from "../seo/SEO";

interface CaseStudyPageProps {
  project?: ProjectData;
}

// Icons that need brightness boost (dark icons) - different levels
const DARK_ICONS_HIGH = ['resend', 'webflow', 'seo']; // Need more brightness
const DARK_ICONS_LOW = ['figma', 'tailwind']; // Need less brightness

const TechIcon: React.FC<{ tech: string; index: number }> = ({ tech, index }) => {
  const techLower = tech.toLowerCase();
  const isHighBrightness = DARK_ICONS_HIGH.includes(techLower);
  const isLowBrightness = DARK_ICONS_LOW.includes(techLower);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        type: "spring",
        stiffness: 200
      }}
      whileHover={{ scale: 1.1 }}
      className="relative group cursor-pointer"
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
        {/* Tech Label */}
        <span className="text-white/60 text-xs font-medium tracking-wide">
          {tech}
        </span>
      </div>
    </motion.div>
  );
};

export const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ project }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  // Scroll to top when project changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  /**
   * Section-level mouse tracking for particle interaction
   */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };

    const handleMouseLeave = () => {
      mouseRef.current = null;
    };

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Get project from URL parameter or use default
  const currentProject = projectId ? projectsData[projectId] : (project || projectsData['syncbooking-saas']);
  const nextProject = getNextProject(currentProject.id);

  // Get i18n content for SEO
  const projectTitle = t(`caseStudies.${currentProject.id}.title`, currentProject.title);
  const projectTagline = t(`caseStudies.${currentProject.id}.tagline`, currentProject.description);

  return (
    <div ref={sectionRef} className="relative min-h-screen bg-[#0A0A0A]">
      {/* Dynamic SEO for Case Study */}
      <SEO
        title={`${projectTitle} | Dusko Licanin`}
        description={projectTagline}
        url={`https://licanin.com/case-study/${currentProject.id}`}
        image={currentProject.galleryImages[0]}
        type="article"
      />

      {/* Single Particle Background for entire page */}
      <div className="fixed inset-0 z-0">
        <Particles
          particleCount={150}
          particleSpread={10}
          speed={0.1}
          particleColors={["#ffffff", "#3BC9FF", "#5DD9FF", "#a0e7ff"]}
          moveParticlesOnHover={true}
          particleHoverFactor={1}
          alphaParticles={true}
          particleBaseSize={80}
          sizeRandomness={1}
          cameraDistance={20}
          disableRotation={false}
          externalMouseRef={mouseRef}
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-8 px-4 sm:px-6 md:px-12 lg:px-16 z-10">

        <div className="relative z-10 text-center space-y-8 max-w-6xl mx-auto">

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-space text-white leading-tight line-clamp-2"
          >
            {t(`caseStudies.${currentProject.id}.title`, currentProject.title)}
          </motion.h1>

          {/* View Live Site Button */}
          {currentProject.liveUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center"
            >
              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-full transition-all duration-300 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 backdrop-blur-sm hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/60 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 text-sm font-semibold">{t("caseStudies.view_live_site", "View Live Site")}</span>
                </motion.button>
              </a>
            </motion.div>
          )}

          {/* Main Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-4xl mx-auto"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              {/* Device Frame */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-[40px] border border-cyan-400/30 shadow-[0_0_40px_rgba(59,201,255,0.2)] overflow-hidden">
                {/* Screen */}
                <div className="p-6 md:p-8 lg:p-10">
                  <img
                    src={currentProject.galleryImages[0]}
                    alt={currentProject.title}
                    className="w-full h-auto object-cover rounded-2xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%231A1A1A'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%233BC9FF' font-family='Arial' font-size='16'%3EProject Screenshot%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>

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
      </section>

      {/* CHALLENGE SECTION */}
      <section className="relative w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">

          {/* Glass Container */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden"
            style={{
              background: 'linear-gradient(to bottom right, rgba(6,182,212,0.05), transparent, rgba(59,130,246,0.05)), rgba(0,0,0,0.4)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.1)'
            }}
          >

            <div className="relative z-10 p-8 md:p-12 lg:p-16 space-y-8">

              {/* Section Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold font-space text-white text-center leading-tight line-clamp-2"
              >
                {t(`caseStudies.${currentProject.id}.challenge_title`, "The Challenge")}
              </motion.h2>

              {/* Challenge Text */}
              <div className="flex items-center justify-center w-full">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-white/80 text-lg leading-relaxed max-w-4xl text-center"
                >
                  {t(`caseStudies.${currentProject.id}.challenge_text`, currentProject.overview.join(' '))}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="relative w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">

          {/* Glass Container */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden"
            style={{
              background: 'linear-gradient(to bottom right, rgba(6,182,212,0.05), transparent, rgba(59,130,246,0.05)), rgba(0,0,0,0.4)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.1)'
            }}
          >

            <div className="relative z-10 p-8 md:p-12 lg:p-16 space-y-8">

              {/* Section Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold font-space text-white text-center leading-tight line-clamp-2"
              >
                {t(`caseStudies.${currentProject.id}.solution_title`, "The Solution")}
              </motion.h2>

              {/* Solution Text */}
              <div className="flex items-center justify-center w-full">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-white/80 text-lg leading-relaxed max-w-4xl text-center"
                >
                  {t(`caseStudies.${currentProject.id}.solution_text`, currentProject.solutions.join(' '))}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SUB-PROJECTS SECTION (Conditional - only for FlutterFlow Templates) */}
      {currentProject.subProjects && currentProject.subProjects.length > 0 && (
        <section className="relative w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Section Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-space text-white mb-4">
                {t("projects.flutterflow.collection.title", "Template Collection")}
              </h2>
              <p className="text-white/60 text-lg">
                {t("projects.flutterflow.collection.subtitle", "Explore the premium FlutterFlow templates")}
              </p>
            </motion.div>

            {/* Sub-Projects List */}
            <div className="space-y-12">
              {currentProject.subProjects.map((subProject, index) => (
                <SubProjectCard
                  key={subProject.id}
                  subProject={subProject}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TECH STACK SECTION */}
      <section className="relative w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">

          {/* Glass Container */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden"
            style={{
              background: 'linear-gradient(to bottom right, rgba(6,182,212,0.05), transparent, rgba(59,130,246,0.05)), rgba(0,0,0,0.4)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.1)'
            }}
          >

            <div className="relative z-10 p-8 md:p-12 lg:p-16 space-y-8">

              {/* Section Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold font-space text-white text-center leading-tight line-clamp-2"
              >
                {t("caseStudies.tech_stack_title", "Technology Stack")}
              </motion.h2>

              {/* Tech Icons - Single row, centered */}
              <div className="flex items-center justify-center w-full">
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                  {currentProject.techStack.map((tech, index) => (
                    <TechIcon key={tech} tech={tech} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GALLERY SECTION - Hidden for FlutterFlow Templates (has subProjects with own galleries) */}
      {currentProject.id !== 'flutterflow-templates' && (
        <section className="relative w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            {/* Gallery Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20 sm:mb-24 md:mb-32"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 sm:mb-12 text-center">
                {t("caseStudies.gallery_title", "Project Gallery")}
              </h2>

              <SimpleGallery images={currentProject.galleryImages} title={currentProject.title} />
            </motion.div>
          </div>
        </section>
      )}

      {/* RESULTS SECTION */}
      <section className="relative w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">

          {/* Glass Container */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative backdrop-blur-xl rounded-[30px] border border-white/20 overflow-hidden"
            style={{
              background: 'linear-gradient(to bottom right, rgba(6,182,212,0.05), transparent, rgba(59,130,246,0.05)), rgba(0,0,0,0.4)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.1)'
            }}
          >

            <div className="relative z-10 p-8 md:p-12 lg:p-16 space-y-8">

              {/* Section Title */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold font-space text-white text-center leading-tight line-clamp-2"
              >
                {t("caseStudies.results_title", "Project Results")}
              </motion.h3>

              {/* Results Grid */}
              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {(() => {
                  const i18nResults = t(`caseStudies.${currentProject.id}.results`, { returnObjects: true });
                  const results = Array.isArray(i18nResults) ? i18nResults : currentProject.results.map(r => ({ title: r, desc: '' }));

                  return results.map((result: { title: string; desc: string } | string, index: number) => {
                    const title = typeof result === 'string' ? result : result.title;
                    const desc = typeof result === 'string' ? '' : result.desc;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.6,
                          delay: 0.3 + index * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                        whileHover={{ scale: 1.05 }}
                        className="relative bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-400/30 p-6 text-center backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(59,201,255,0.5)]"
                      >
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mx-auto mb-4">
                          <ArrowRight className="w-6 h-6 text-cyan-400" />
                        </div>

                        {/* Content */}
                        <div>
                          <h4 className="text-white font-bold text-lg mb-2">
                            {title}
                          </h4>
                          {desc && (
                            <p className="text-white/60 text-sm">
                              {desc}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  });
                })()}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEXT PROJECT SECTION */}
      {nextProject && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16"
        >
          <div className="max-w-4xl mx-auto">
            <Link
              to={`/case-study/${nextProject.id}`}
              className="group block"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative backdrop-blur-xl rounded-[30px] border border-white/20 overflow-hidden cursor-pointer transition-all duration-300 group-hover:border-white/20"
                style={{
                  background: 'linear-gradient(to bottom right, rgba(6,182,212,0.03), transparent, rgba(59,130,246,0.03)), rgba(0,0,0,0.4)',
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.05)'
                }}
              >

                <div className="relative z-10 p-6 md:p-8 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white/60 text-xs md:text-sm font-medium mb-1 line-clamp-1">{t("caseStudies.next_project", "Next Project")}</p>
                      <h3 className="text-white text-lg md:text-xl font-bold line-clamp-1">{t(`caseStudies.${nextProject.id}.title`, nextProject.title)}</h3>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-cyan-400 text-xs md:text-sm font-medium group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                      {t("caseStudies.view_case_study", "View Case Study")}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Removed FloatingParticles - now using Particles from ParticleBg
