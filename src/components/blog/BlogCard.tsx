import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, Clock } from "lucide-react";
import type { BlogPost } from "../../data/blogs";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

export const BlogCard = ({ post, index = 0 }: BlogCardProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "bs";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "bs" ? "bs-BA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link to={`/blog/${post.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: "easeOut",
        }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ y: -8 }}
        className="group relative h-full"
      >
        {/* Outer Glow Effect on Hover */}
        <div
          className="absolute -inset-[1px] rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(135deg, rgba(59, 201, 255, 0.3) 0%, rgba(59, 201, 255, 0.1) 50%, rgba(59, 201, 255, 0.3) 100%)",
            filter: "blur(8px)",
          }}
        />

        {/* Glass Card - Same pattern as FeaturedProject/CaseStudy */}
        <div
          className="relative h-full overflow-hidden rounded-[24px] backdrop-blur-xl border border-white/10 transition-all duration-500 group-hover:border-cyan-400/40"
          style={{
            background: 'linear-gradient(to bottom right, rgba(6,182,212,0.05), transparent, rgba(59,130,246,0.05)), rgba(0,0,0,0.5)',
            boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.1)",
          }}
        >

          {/* Cover Image */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title[lang]}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Image Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span
                className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 backdrop-blur-sm"
                style={{
                  textShadow: "0 0 10px rgba(59, 201, 255, 0.5)",
                }}
              >
                {post.category[lang]}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="relative p-6">
            {/* Title */}
            <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
              {post.title[lang]}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-white/60 mb-4 line-clamp-2 leading-relaxed">
              {post.excerpt[lang]}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs text-white/60">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime[lang]}</span>
              </div>
            </div>

            {/* Read More Arrow */}
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <span className="text-cyan-400 text-lg">→</span>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};
