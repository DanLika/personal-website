import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Target, Lightbulb, TrendingUp } from "lucide-react";
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

// Project-specific SEO keywords (Bosnian primary)
const PROJECT_KEYWORDS: Record<string, string> = {
  'bookbed-saas': 'BookBed, SaaS platforma, booking sistem, Flutter aplikacija, Firebase, rezervacije smještaja, iCal sinhronizacija, Stripe plaćanja, Banja Luka',
  'ironlife': 'IronLife, fitness web stranica, Webflow razvoj, SEO optimizacija, Figma dizajn, nutricionizam, zdrav život, Banja Luka',
  'pizzeria-bestek': 'Pizzeria Bestek, naručivanje hrane online, React aplikacija, Supabase, restoran web stranica, admin dashboard, Banja Luka',
  'flutterflow-templates': 'FlutterFlow templates, marketplace, booking app, kalendar sinhronizacija, PDF viewer, Firebase, Stripe, low-code development'
};

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
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 flex items-center justify-center transition-all duration-300 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(59,201,255,0.4)]">
          <img
            src={`/${tech.toLowerCase()}.avif`}
            alt={tech}
            title={tech}
            width={40}
            height={40}
            loading="lazy"
            className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] ${isHighBrightness ? 'brightness-[1.8] contrast-[1.1]' : ''} ${isLowBrightness ? 'brightness-[1.3]' : ''}`}
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
        <span className="text-white/60 text-[10px] sm:text-xs font-medium tracking-wide">
          {tech}
        </span>
      </div>
    </motion.div>
  );
};

// Impact Card Component for the Quick Impact Strip
interface ImpactCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  accentColor?: string;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ icon, title, description, index, accentColor = "cyan" }) => {
  const colorClasses = {
    cyan: {
      bg: "from-cyan-500/10 to-cyan-500/5",
      border: "border-cyan-400/30",
      icon: "bg-cyan-500/20 border-cyan-400/50 text-cyan-400",
      hover: "hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(59,201,255,0.3)]"
    },
    purple: {
      bg: "from-purple-500/10 to-purple-500/5",
      border: "border-purple-400/30",
      icon: "bg-purple-500/20 border-purple-400/50 text-purple-400",
      hover: "hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
    },
    green: {
      bg: "from-emerald-500/10 to-emerald-500/5",
      border: "border-emerald-400/30",
      icon: "bg-emerald-500/20 border-emerald-400/50 text-emerald-400",
      hover: "hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]"
    }
  };

  const colors = colorClasses[accentColor as keyof typeof colorClasses] || colorClasses.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-gradient-to-br ${colors.bg} backdrop-blur-sm rounded-2xl sm:rounded-3xl border ${colors.border} p-4 sm:p-5 md:p-6 transition-all duration-300 ${colors.hover}`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl ${colors.icon} border flex items-center justify-center mb-3 sm:mb-4`}>
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-white font-bold text-base sm:text-lg mb-1.5 sm:mb-2 line-clamp-1">{title}</h3>
      <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-3">{description}</p>
    </motion.div>
  );
};

export const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ project }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [particleKey, setParticleKey] = useState(0);
  const [particlesReady, setParticlesReady] = useState(false);

  // Detect mobile for particle optimization
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Defer particles initialization to reduce main thread blocking
  useEffect(() => {
    const initParticles = () => setParticlesReady(true);
    if ('requestIdleCallback' in window) {
      const id = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(initParticles, { timeout: 1000 });
      return () => (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
    } else {
      const id = setTimeout(initParticles, 500);
      return () => clearTimeout(id);
    }
  }, []);

  // Scroll to top when project changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  // Handle page visibility - reinitialize particles when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became visible, reinitialize particles to fix any WebGL context issues
        setParticleKey(prev => prev + 1);
      }
    };

    const handleContextLost = () => {
      // WebGL context was lost, reinitialize particles
      setParticleKey(prev => prev + 1);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('particles-context-lost', handleContextLost);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('particles-context-lost', handleContextLost);
    };
  }, []);

  // Window-level mouse/touch tracking for particles with RAF throttling
  useEffect(() => {
    let rafId: number | null = null;
    let lastUpdate = 0;
    const THROTTLE_MS = 16;
    let pendingX = 0;
    let pendingY = 0;

    const updatePosition = () => {
      rafId = null;
      lastUpdate = performance.now();
      mouseRef.current = { x: pendingX, y: pendingY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = (e.clientX / window.innerWidth) * 2 - 1;
      pendingY = -((e.clientY / window.innerHeight) * 2 - 1);
      const now = performance.now();
      if (now - lastUpdate < THROTTLE_MS) {
        if (!rafId) rafId = requestAnimationFrame(updatePosition);
        return;
      }
      lastUpdate = now;
      mouseRef.current = { x: pendingX, y: pendingY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        pendingX = (touch.clientX / window.innerWidth) * 2 - 1;
        pendingY = -((touch.clientY / window.innerHeight) * 2 - 1);
        const now = performance.now();
        if (now - lastUpdate < THROTTLE_MS) {
          if (!rafId) rafId = requestAnimationFrame(updatePosition);
          return;
        }
        lastUpdate = now;
        mouseRef.current = { x: pendingX, y: pendingY };
      }
    };

    const handleEnd = () => {
      mouseRef.current = { x: 0, y: 0 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleEnd);
    window.addEventListener('touchend', handleEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleEnd);
      window.removeEventListener('touchend', handleEnd);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Get project from URL parameter or use default
  const currentProject = projectId ? projectsData[projectId] : (project || projectsData['bookbed-saas']);
  const nextProject = getNextProject(currentProject.id);

  // Get i18n content for SEO and display
  const projectTitle = t(`caseStudies.${currentProject.id}.title`, currentProject.title);
  const projectTagline = t(`caseStudies.${currentProject.id}.tagline`, currentProject.description);
  const challengeText = t(`caseStudies.${currentProject.id}.challenge_text`, currentProject.overview.join(' '));
  const solutionText = t(`caseStudies.${currentProject.id}.solution_text`, currentProject.solutions.join(' '));

  // Get first result for the impact strip
  const i18nResults = t(`caseStudies.${currentProject.id}.results`, { returnObjects: true });
  const results = Array.isArray(i18nResults) ? i18nResults : currentProject.results.map(r => ({ title: r, desc: '' }));
  const firstResult = results[0];
  const keyResultTitle = typeof firstResult === 'string' ? firstResult : firstResult?.title || '';
  const keyResultDesc = typeof firstResult === 'string' ? '' : firstResult?.desc || '';

  return (
    <div ref={sectionRef} className="relative min-h-screen bg-[#0A0A0A]">
      {/* Dynamic SEO for Case Study */}
      <SEO
        title={`${projectTitle} | Dusko Licanin`}
        description={projectTagline}
        keywords={PROJECT_KEYWORDS[currentProject.id]}
        url={`https://duskolicanin.com/case-study/${currentProject.id}`}
        image={currentProject.galleryImages[0]}
        type="article"
      />

      {/* Single Particle Background for entire page */}
      {/* Fallback gradient background in case Particles fail */}
      <div className="fixed inset-0 z-0 bg-[#0A0A0A]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 0%, rgba(59, 201, 255, 0.08) 0%, transparent 50%),
              linear-gradient(to bottom, #0A0A0A, #0A0A0A)
            `
          }}
        />
        {particlesReady && (
          <Particles
            key={particleKey}
            particleCount={isMobile ? 50 : 70}
            particleSpread={10}
            speed={isMobile ? 0.15 : 0.3}
            particleColors={["#ffffff", "#3BC9FF", "#5DD9FF", "#a0e7ff"]}
            moveParticlesOnHover={true}
            particleHoverFactor={2}
            alphaParticles={true}
            particleBaseSize={isMobile ? 60 : 80}
            sizeRandomness={1}
            cameraDistance={20}
            disableRotation={isMobile}
            externalMouseRef={mouseRef}
          />
        )}
      </div>

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-6 sm:pb-8 px-4 sm:px-6 md:px-12 lg:px-16 z-10">

        <div className="relative z-10 text-center space-y-6 sm:space-y-8 max-w-6xl mx-auto">

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-space text-white leading-tight"
          >
            {projectTitle}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2"
          >
            {projectTagline}
          </motion.p>

          {/* View Live Site Button */}
          {currentProject.liveUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
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
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 backdrop-blur-sm hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/60 flex items-center gap-2"
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
              <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl sm:rounded-3xl md:rounded-[40px] border border-cyan-400/30 shadow-[0_0_40px_rgba(59,201,255,0.2)] overflow-hidden">
                {/* Screen */}
                <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                  <img
                    src={currentProject.galleryImages[0]}
                    alt={currentProject.title}
                    title={currentProject.title}
                    width={1200}
                    height={900}
                    loading="eager"
                    className="w-full h-auto object-cover rounded-xl sm:rounded-2xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%231A1A1A'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%233BC9FF' font-family='Arial' font-size='16'%3EProject Screenshot%3C/text%3E%3C/svg%3E";
                      target.alt = "";
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

      {/* QUICK IMPACT STRIP - 3 Cards: Challenge | Solution | Key Result */}
      <section className="relative w-full py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-16 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Challenge Card */}
            <ImpactCard
              icon={<Target className="w-5 h-5 sm:w-6 sm:h-6" />}
              title={t("caseStudies.impact.challenge", "The Challenge")}
              description={challengeText.length > 120 ? challengeText.slice(0, 120) + '...' : challengeText}
              index={0}
              accentColor="cyan"
            />

            {/* Solution Card */}
            <ImpactCard
              icon={<Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />}
              title={t("caseStudies.impact.solution", "The Solution")}
              description={solutionText.length > 120 ? solutionText.slice(0, 120) + '...' : solutionText}
              index={1}
              accentColor="purple"
            />

            {/* Key Result Card */}
            <ImpactCard
              icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
              title={keyResultTitle || t("caseStudies.impact.result", "Key Result")}
              description={keyResultDesc || t("caseStudies.impact.result_desc", "Measurable business impact delivered.")}
              index={2}
              accentColor="green"
            />
          </div>
        </div>
      </section>

      {/* GALLERY SECTION - Moved up, more prominent */}
      {currentProject.id !== 'flutterflow-templates' && (
        <section className="relative w-full py-8 sm:py-10 md:py-14 px-4 sm:px-6 md:px-12 lg:px-16 z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
                {t("caseStudies.gallery_title", "Project Gallery")}
              </h2>

              <SimpleGallery images={currentProject.galleryImages} title={currentProject.title} />
            </motion.div>
          </div>
        </section>
      )}

      {/* SUB-PROJECTS SECTION (Conditional - only for FlutterFlow Templates) */}
      {currentProject.subProjects && currentProject.subProjects.length > 0 && (
        <section className="relative w-full py-8 sm:py-10 md:py-14 px-4 sm:px-6 md:px-12 lg:px-16 z-10">
          <div className="max-w-7xl mx-auto">
            {/* Section Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-space text-white mb-3 sm:mb-4">
                {t("projects.flutterflow.collection.title", "Template Collection")}
              </h2>
              <p className="text-white/60 text-sm sm:text-base md:text-lg">
                {t("projects.flutterflow.collection.subtitle", "Explore the premium FlutterFlow templates")}
              </p>
            </motion.div>

            {/* Sub-Projects List */}
            <div className="space-y-8 sm:space-y-10 md:space-y-12">
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

      {/* RESULTS SECTION - More prominent with better cards */}
      <section className="relative w-full py-8 sm:py-10 md:py-14 px-4 sm:px-6 md:px-12 lg:px-16 z-10">
        <div className="max-w-6xl mx-auto">

          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold font-space text-white text-center mb-6 sm:mb-8"
          >
            {t("caseStudies.results_title", "Project Results")}
          </motion.h2>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {results.map((result: { title: string; desc: string } | string, index: number) => {
              const title = typeof result === 'string' ? result : result.title;
              const desc = typeof result === 'string' ? '' : result.desc;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ scale: 1.03 }}
                  className="relative bg-gradient-to-br from-cyan-500/10 to-blue-500/5 rounded-2xl sm:rounded-3xl border border-cyan-400/30 p-4 sm:p-5 md:p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(59,201,255,0.3)]"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mb-3 sm:mb-4">
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                  </div>

                  {/* Content */}
                  <h3 className="text-white font-bold text-base sm:text-lg mb-1.5 sm:mb-2 line-clamp-2">
                    {title}
                  </h3>
                  {desc && (
                    <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {desc}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECH STACK SECTION - Simplified, moved to bottom */}
      <section className="relative w-full py-8 sm:py-10 md:py-14 px-4 sm:px-6 md:px-12 lg:px-16 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl font-bold font-space text-white/80 text-center mb-6 sm:mb-8"
          >
            {t("caseStudies.tech_stack_title", "Built With")}
          </motion.h2>

          {/* Tech Icons - Centered row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {currentProject.techStack.map((tech, index) => (
              <TechIcon key={tech} tech={tech} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* NEXT PROJECT SECTION */}
      {nextProject && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full py-8 sm:py-10 md:py-14 px-4 sm:px-6 md:px-12 lg:px-16 z-10"
        >
          <div className="max-w-4xl mx-auto">
            <Link
              to={`/case-study/${nextProject.id}`}
              className="group block"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 overflow-hidden cursor-pointer transition-all duration-300 group-hover:border-cyan-400/40"
                style={{
                  background: 'linear-gradient(to bottom right, rgba(6,182,212,0.03), transparent, rgba(59,130,246,0.03)), rgba(0,0,0,0.4)',
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.05)'
                }}
              >

                <div className="relative z-10 p-4 sm:p-5 md:p-6 flex items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white/60 text-[10px] sm:text-xs md:text-sm font-medium mb-0.5 sm:mb-1 line-clamp-1">{t("caseStudies.next_project", "Next Project")}</p>
                      <h3 className="text-white text-base sm:text-lg md:text-xl font-bold line-clamp-1">{t(`caseStudies.${nextProject.id}.title`, nextProject.title)}</h3>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-cyan-400 text-[10px] sm:text-xs md:text-sm font-medium group-hover:text-cyan-300 transition-colors whitespace-nowrap">
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
