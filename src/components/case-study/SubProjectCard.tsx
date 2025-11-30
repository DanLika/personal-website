import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { type SubProject } from "../../data/projects";
import MasonryGallery, { type MasonryItem } from "../ui/MasonryGallery";
import { useState, useEffect } from "react";

interface SubProjectCardProps {
  subProject: SubProject;
  index: number;
}

// Helper component to load images and get dimensions
const GalleryLoader = ({ images, projectTitle }: { images: string[], projectTitle: string }) => {
  const [items, setItems] = useState<MasonryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      const loadedItems: MasonryItem[] = [];

      for (let i = 0; i < images.length; i++) {
        const imgPath = images[i];
        try {
          const img = new Image();
          img.src = imgPath;

          await new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = reject;
          });

          loadedItems.push({
            id: `${projectTitle}-${i}`,
            img: imgPath,
            height: img.naturalHeight / img.naturalWidth,
            title: `${projectTitle} - Screenshot ${i + 1}`
          });
        } catch (error) {
          console.warn(`Failed to load image: ${imgPath}`, error);
        }
      }

      setItems(loadedItems);
      setLoading(false);
    };

    loadImages();
  }, [images, projectTitle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  return <MasonryGallery items={items} />;
};

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
      className="relative group"
    >
      {/* Glass Card Container */}
      <div className="relative backdrop-blur-xl bg-black/40 border border-white/10 rounded-[30px] p-6 md:p-8 overflow-hidden hover:border-cyan-400/40 transition-all duration-500">

        {/* Inner Glow */}
        <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold font-space text-white group-hover:text-cyan-400 transition-colors duration-300">
            {subProject.title[currentLang]}
          </h3>

          {/* Description */}
          <p className="text-white/70 leading-relaxed text-sm md:text-base">
            {subProject.description[currentLang]}
          </p>

          {/* Gallery */}
          <div className="pt-4">
            <GalleryLoader
              images={subProject.galleryImages}
              projectTitle={subProject.title[currentLang]}
            />
          </div>
        </div>

        {/* Glass Border Highlight */}
        <div className="absolute inset-0 rounded-[30px] border border-transparent [border-image:linear-gradient(45deg,rgba(59,201,255,0.2),rgba(6,182,212,0.05),rgba(59,201,255,0.2))_1] pointer-events-none" />
      </div>
    </motion.div>
  );
};
