import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { projectsData, getNextProject, type ProjectData } from "../../data/projects";
import MasonryGallery, { type MasonryItem } from "../ui/MasonryGallery";
import { SubProjectCard } from "./SubProjectCard";

// Helper component to load images and get dimensions
const GalleryLoader = ({ images, projectTitle }: { images: string[], projectTitle: string }) => {
  const [items, setItems] = useState<MasonryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const loadedItems: MasonryItem[] = [];

      await Promise.all(
        images.map(async (src, index) => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              // Calculate aspect ratio or use height directly. 
              // The Masonry component expects 'height'. 
              // Let's pass the aspect ratio (h/w) as 'height' for our modified logic, 
              // OR pass the raw height if we want to stick to the original logic.
              // In my modified MasonryGallery, I used: const displayHeight = columnWidth * child.height;
              // So 'height' should be aspect ratio (h/w).
              const aspectRatio = img.naturalHeight / img.naturalWidth;

              loadedItems.push({
                id: `img-${index}`,
                img: src,
                height: aspectRatio, // Passing aspect ratio
                title: index === 0 ? `${projectTitle} - Main View` : `${projectTitle} - Image ${index + 1}`
              });
              resolve();
            };
            img.onerror = () => resolve(); // Skip on error but resolve
          });
        })
      );

      // Sort by original index to maintain order
      const sortedItems = loadedItems.sort((a, b) => {
        const indexA = images.indexOf(a.img);
        const indexB = images.indexOf(b.img);
        return indexA - indexB;
      });

      setItems(sortedItems);
      setLoading(false);
    };

    loadImages();
  }, [images]);

  if (loading) {
    return <div className="text-center text-white/60 py-20">Loading gallery...</div>;
  }

  return (
    <div className="w-full min-h-[50vh]">
      <MasonryGallery items={items} />
    </div>
  );
};

interface CaseStudyPageProps {
  project?: ProjectData;
}

const TechIcon: React.FC<{ tech: string; index: number }> = ({ tech, index }) => {
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

  // Scroll to top when project changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  // Get project from URL parameter or use default
  const currentProject = projectId ? projectsData[projectId] : (project || projectsData['syncbooking-saas']);
  const nextProject = getNextProject(currentProject.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#13151A]">

      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Particles */}
        <FloatingParticles />

        <div className="relative z-10 text-center space-y-8 px-6 max-w-6xl mx-auto">

          {/* Category Tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex"
          >
            <div className="px-8 py-4 rounded-full bg-transparent border-2 border-[#3BC9FF] shadow-[0_0_30px_rgba(59,201,255,0.6)] backdrop-blur-sm">
              <span className="text-[#3BC9FF] font-bold text-lg tracking-wider">
                {currentProject.category}
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold font-space text-white leading-tight"
          >
            {currentProject.title}
          </motion.h1>

          {/* View Live Site Button */}
          {currentProject.liveUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex"
            >
              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 backdrop-blur-sm flex items-center gap-2 transition-all duration-300 hover:bg-cyan-500/30 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(59,201,255,0.4)]"
                >
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 text-sm font-semibold">
                    View Live Site
                  </span>
                </motion.div>
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
                <div className="p-8">
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

      {/* OVERVIEW SECTION */}
      <section className="relative w-full py-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Glass Container */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative bg-black/40 backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden"
            style={{
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.1)'
            }}
          >
            {/* Inner Glow */}
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />

            <div className="relative z-10 p-12 space-y-8">

              {/* Section Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl font-bold font-space text-white text-center"
              >
                Project Overview
              </motion.h2>

              {/* Overview Points */}
              <div className="grid md:grid-cols-2 gap-6">
                {currentProject.overview.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                    <p className="text-white/80 leading-relaxed">
                      {point}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SUB-PROJECTS SECTION (Conditional - only for FlutterFlow Templates) */}
      {currentProject.subProjects && currentProject.subProjects.length > 0 && (
        <section className="relative w-full py-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-space text-white mb-4">
                {(() => {
                  const { t } = useTranslation();
                  return t("projects.flutterflow.collection.title", "Template Collection");
                })()}
              </h2>
              <p className="text-white/60 text-lg">
                {(() => {
                  const { t } = useTranslation();
                  return t("projects.flutterflow.collection.subtitle", "Explore the premium FlutterFlow templates");
                })()}
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
      <section className="relative w-full py-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Glass Container */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative bg-black/40 backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden"
            style={{
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.1)'
            }}
          >
            {/* Inner Glow */}
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />

            <div className="relative z-10 p-12 space-y-8">

              {/* Section Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl font-bold font-space text-white text-center"
              >
                Technology Stack
              </motion.h2>

              {/* Tech Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {currentProject.techStack.map((tech, index) => (
                  <TechIcon key={tech} tech={tech} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="relative w-full py-24 px-6">
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
              Project Gallery
            </h2>

            <GalleryLoader images={currentProject.galleryImages} projectTitle={currentProject.title} />
          </motion.div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section className="relative w-full py-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Glass Container */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative bg-black/40 backdrop-blur-xl rounded-[30px] border border-white/20 overflow-hidden"
            style={{
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.1)'
            }}
          >
            {/* Inner Glow */}
            <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />

            <div className="relative z-10 p-12 space-y-8">

              {/* Section Title */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl font-bold font-space text-white text-center"
              >
                Project Results
              </motion.h3>

              {/* Results Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {currentProject.results.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3 + index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 0 20px rgba(59, 201, 255, 0.5)'
                    }}
                    className="relative bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-400/30 p-6 text-center backdrop-blur-sm"
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mx-auto mb-4">
                      <ArrowRight className="w-6 h-6 text-cyan-400" />
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="text-white font-bold text-lg mb-2">
                        {result}
                      </h4>
                    </div>
                  </motion.div>
                ))}
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
          className="relative w-full py-20 px-6"
        >
          <div className="max-w-4xl mx-auto">
            <Link
              to={`/case-study/${nextProject.id}`}
              className="group block"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative bg-black/40 backdrop-blur-xl rounded-[30px] border border-white/20 overflow-hidden cursor-pointer transition-all duration-300 group-hover:border-white/20"
                style={{
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.05)'
                }}
              >
                {/* Inner Glow */}
                <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-cyan-500/3 via-transparent to-blue-500/3 pointer-events-none" />

                <div className="relative z-10 p-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm font-medium mb-1">Next Project</p>
                      <h3 className="text-white text-xl font-bold">{nextProject.title}</h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-cyan-400 text-sm font-medium group-hover:text-cyan-300 transition-colors">
                      View Case Study
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.section>
      )}
    </div>
  );
};

const FloatingParticles: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-cyan-400/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.id * 0.5,
          }}
        />
      ))}
    </div>
  );
};
