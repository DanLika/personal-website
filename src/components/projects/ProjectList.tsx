import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MagnetButton } from "../ui/MagnetButton";
import React from "react";
import { projectsData } from "../../data/projects";

// Convert projectsData to PROJECTS format for ProjectList
const PROJECTS = Object.values(projectsData).map(project => ({
  id: project.id,
  title: project.title,
  tag: project.category,
  description: project.description,
  tech: project.techStack,
  mockupType: 'laptop' as const, // Default to laptop, can be customized per project
  imageUrl: project.galleryImages[0]
}));

const TechIcon: React.FC<{ tech: string }> = ({ tech }) => {
  const getIcon = () => {
    const icons: Record<string, React.ReactElement> = {
      React: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      ),
      Flutter: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      Firebase: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      NodeJS: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      MongoDB: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      Tailwind: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      TypeScript: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      Chartjs: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      Nextjs: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      Webflow: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      Figma: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      JavaScript: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      CSS: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      AI: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      Stripe: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      FlutterFlow: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
      "UI/UX Design": (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      )
    };

    return icons[tech] || (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
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

interface DeviceMockupProps {
  type: 'laptop' | 'phone' | 'tablet';
  className?: string;
}

const DeviceMockup: React.FC<DeviceMockupProps> = ({ type, className = "" }) => {
  const baseClasses = "bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-400/30 shadow-[0_0_20px_rgba(59,201,255,0.2)]";

  if (type === 'laptop') {
    return (
      <div className={`relative ${className}`}>
        <div className={`${baseClasses} rounded-t-xl w-48 h-32 relative overflow-hidden`}>
          {/* Screen */}
          <div className="absolute inset-1 bg-black/80 rounded-t-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
              {/* Screen Content */}
              <div className="p-3 space-y-2">
                <div className="w-full h-2 bg-cyan-400/30 rounded-full" />
                <div className="w-3/4 h-2 bg-cyan-400/20 rounded-full" />
                <div className="w-1/2 h-2 bg-cyan-400/20 rounded-full" />
              </div>
            </div>
            {/* Screen Reflection */}
            <div 
              className="absolute inset-0 rounded-t-lg pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)'
              }}
            />
          </div>
        </div>
        {/* Laptop Base */}
        <div className="w-56 h-2 bg-gray-700 rounded-b-lg mx-auto -mt-1" />
      </div>
    );
  }

  if (type === 'phone') {
    return (
      <div className={`relative ${className}`}>
        <div className={`${baseClasses} rounded-[2rem] w-20 h-36 relative overflow-hidden`}>
          {/* Screen */}
          <div className="absolute inset-1 bg-black/80 rounded-[1.5rem]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
              {/* Screen Content */}
              <div className="p-2 space-y-1">
                <div className="w-full h-1 bg-cyan-400/30 rounded-full" />
                <div className="w-3/4 h-1 bg-cyan-400/20 rounded-full" />
                <div className="w-1/2 h-1 bg-cyan-400/20 rounded-full" />
              </div>
            </div>
            {/* Screen Reflection */}
            <div 
              className="absolute inset-0 rounded-[1.5rem] pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)'
              }}
            />
          </div>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-black rounded-b-2xl" />
        </div>
      </div>
    );
  }

  if (type === 'tablet') {
    return (
      <div className={`relative ${className}`}>
        <div className={`${baseClasses} rounded-xl w-32 h-24 relative overflow-hidden`}>
          {/* Screen */}
          <div className="absolute inset-1 bg-black/80 rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
              {/* Screen Content */}
              <div className="p-2 space-y-1">
                <div className="w-full h-1 bg-cyan-400/30 rounded-full" />
                <div className="w-3/4 h-1 bg-cyan-400/20 rounded-full" />
              </div>
            </div>
            {/* Screen Reflection */}
            <div 
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const ProjectList = () => {
  const { t } = useTranslation();
  
  // 3D tilt state for each project
  const [tiltStates, setTiltStates] = useState<Record<string, { rotateX: number; rotateY: number }>>({});

  const handleTilt = (projectId: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    
    setTiltStates(prev => ({
      ...prev,
      [projectId]: { rotateX: rotateXValue, rotateY: rotateYValue }
    }));
  };

  const handleTiltLeave = (projectId: string) => {
    setTiltStates(prev => ({
      ...prev,
      [projectId]: { rotateX: 0, rotateY: 0 }
    }));
  };

  return (
    <section className="relative w-full py-20 px-6">
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
                  {/* Mouse-following spotlight glow */}
                  <div className="absolute inset-0 rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div 
                      className="absolute inset-0 rounded-[30px]"
                      style={{
                        background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 201, 255, 0.4) 0%, transparent 60%)',
                        filter: 'blur(15px)'
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
                  
                  {/* Glass Card */}
                  <div 
                    className="relative bg-[#0A0A0A]/40 backdrop-blur-md border border-[#3BC9FF]/30 rounded-[30px] overflow-hidden transition-all duration-500 group-hover:border-[#3BC9FF]/60 group-hover:shadow-[0_0_30px_rgba(59,201,255,0.3)] cursor-pointer"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                      e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
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
                      <div
                        onMouseMove={(e) => handleTilt(project.id, e)}
                        onMouseLeave={() => handleTiltLeave(project.id)}
                        style={{
                          transform: `perspective(1000px) rotateX(${tiltStates[project.id]?.rotateX || 0}deg) rotateY(${tiltStates[project.id]?.rotateY || 0}deg)`,
                          transition: 'transform 0.1s ease-out'
                        }}
                      >
                        <DeviceMockup 
                          type={project.mockupType} 
                          className="transform rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
