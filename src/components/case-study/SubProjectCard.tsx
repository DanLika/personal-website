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
      {/* Glass Card Container - Matching Project Overview Style */}
      <div
        className="relative backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom right, rgba(6,182,212,0.05), transparent, rgba(59,130,246,0.05)), rgba(0,0,0,0.4)',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.1)'
        }}
      >

        {/* Content */}
        <div className="relative z-10 space-y-6 p-6 md:p-8">
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
