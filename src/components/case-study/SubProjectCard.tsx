import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { type SubProject } from "../../data/projects";
import SimpleGallery from "../ui/SimpleGallery";

interface SubProjectCardProps {
  subProject: SubProject;
  index: number;
}

export const SubProjectCard: React.FC<SubProjectCardProps> = ({ subProject, index }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'en' | 'bs';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 0.61, 0.36, 1]
      }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Glass Card Container */}
      <div className="relative backdrop-blur-xl bg-black/40 border border-white/10 rounded-[30px] p-6 md:p-8 overflow-hidden">

        {/* Inner Glow - Removed hover effect */}
        <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-50 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Title */}
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-space text-white leading-tight line-clamp-2">
            {subProject.title[currentLang]}
          </h3>

          {/* Description */}
          <p className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed line-clamp-3">
            {subProject.description[currentLang]}
          </p>

          {/* Horizontal Gallery */}
          {subProject.galleryImages && subProject.galleryImages.length > 0 && (
            <div className="pt-4 space-y-2">
              <h4 className="text-white/50 text-sm font-medium tracking-wider uppercase">Horizontal Gallery</h4>
              <SimpleGallery
                images={subProject.galleryImages}
                title={`${subProject.title[currentLang]} - Horizontal`}
              />
            </div>
          )}

          {/* Vertical Gallery */}
          {subProject.galleryImagesVertical && subProject.galleryImagesVertical.length > 0 && (
            <div className="pt-4 space-y-2">
              <h4 className="text-white/50 text-sm font-medium tracking-wider uppercase">Vertical Gallery</h4>
              <SimpleGallery
                images={subProject.galleryImagesVertical}
                title={`${subProject.title[currentLang]} - Vertical`}
              />
            </div>
          )}
        </div>

        {/* Glass Border Highlight - Removed border-image due to rendering issues */}
      </div>
    </motion.div>
  );
};
