import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { type SubProject } from "../../data/projects";
import { ExternalLink } from "lucide-react";

interface SubProjectCardProps {
  subProject: SubProject;
  index: number;
}

// Accent colors for each template
const ACCENT_COLORS = [
  {
    name: 'cyan',
    bg: 'from-cyan-500/10 to-cyan-500/5',
    border: 'border-cyan-400/30',
    hoverBorder: 'hover:border-cyan-400/50',
    text: 'text-cyan-400',
    glow: 'hover:shadow-[0_0_30px_rgba(59,201,255,0.2)]',
    badge: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-400',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(0,0,0,0.4) 50%, rgba(59,130,246,0.05) 100%)'
  },
  {
    name: 'purple',
    bg: 'from-purple-500/10 to-purple-500/5',
    border: 'border-purple-400/30',
    hoverBorder: 'hover:border-purple-400/50',
    text: 'text-purple-400',
    glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
    badge: 'bg-purple-500/20 border-purple-400/40 text-purple-400',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(0,0,0,0.4) 50%, rgba(219,39,119,0.05) 100%)'
  },
  {
    name: 'emerald',
    bg: 'from-emerald-500/10 to-emerald-500/5',
    border: 'border-emerald-400/30',
    hoverBorder: 'hover:border-emerald-400/50',
    text: 'text-emerald-400',
    glow: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.2)]',
    badge: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-400',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.08) 0%, rgba(0,0,0,0.4) 50%, rgba(34,197,94,0.05) 100%)'
  }
];

export const SubProjectCard: React.FC<SubProjectCardProps> = ({ subProject, index }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'en' | 'bs';

  // Get accent color based on index
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  // Get all images (combine horizontal and vertical)
  const allImages = [
    ...(subProject.galleryImages || []),
    ...(subProject.galleryImagesVertical || [])
  ];

  // First image is hero, rest are thumbnails
  const heroImage = allImages[0];
  const thumbnailImages = allImages.slice(1, 4); // Max 3 thumbnails

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
      <div
        className={`relative backdrop-blur-xl rounded-2xl sm:rounded-3xl border ${accent.border} overflow-hidden transition-all duration-300 ${accent.hoverBorder} ${accent.glow}`}
        style={{
          background: accent.gradient,
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.08)'
        }}
      >
        <div className="relative z-10 p-4 sm:p-6 md:p-8">

          {/* Header: Title + Features */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Title */}
            <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold font-space text-white leading-tight group-hover:${accent.text} transition-colors duration-300`}>
              {subProject.title[currentLang]}
            </h3>

            {/* Feature Badges */}
            {subProject.features && subProject.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {subProject.features.slice(0, 3).map((feature, idx) => (
                  <span
                    key={idx}
                    className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium border ${accent.badge} whitespace-nowrap`}
                  >
                    {feature[currentLang]}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-4 sm:mb-6 line-clamp-2">
            {subProject.description[currentLang]}
          </p>

          {/* Images Grid: Hero + Thumbnails */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Hero Image - Full width on mobile, 2 cols on desktop */}
            {heroImage && (
              <motion.div
                className="sm:col-span-2 relative rounded-xl sm:rounded-2xl overflow-hidden aspect-video sm:aspect-[16/10] cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={heroImage}
                  alt={subProject.title[currentLang]}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            )}

            {/* Thumbnail Stack - 1 col on desktop */}
            {thumbnailImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-1 gap-2 sm:gap-3">
                {thumbnailImages.map((img, idx) => (
                  <motion.div
                    key={idx}
                    className="relative rounded-lg sm:rounded-xl overflow-hidden aspect-video sm:aspect-[4/3] cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={img}
                      alt={`${subProject.title[currentLang]} ${idx + 2}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Marketplace Link (if available) */}
          {subProject.marketplaceUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 sm:mt-6 flex justify-start"
            >
              <a
                href={subProject.marketplaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border ${accent.badge} text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95`}
              >
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t("projects.flutterflow.viewOnMarketplace", "View on Marketplace")}</span>
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
