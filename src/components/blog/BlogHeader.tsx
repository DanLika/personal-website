import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface BlogHeaderProps {
  post: {
    title: { en: string; bs: string };
    category: { en: string; bs: string };
    readTime: { en: string; bs: string };
    coverImage: string;
    date: string;
  };
  lang: "en" | "bs";
}

export const BlogHeader = ({ post, lang }: BlogHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "bs" ? "bs-BA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate("/blog")}
          className="group flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="text-sm">{t("blog.post.backToBlog")}</span>
        </button>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-8 rounded-[24px] overflow-hidden"
        style={{
          boxShadow:
            "0 0 60px rgba(59, 201, 255, 0.1), inset 0 1px 0 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Glass Frame */}
        <div className="absolute inset-0 border border-white/10 rounded-[24px] pointer-events-none z-10" />
        <img
          src={post.coverImage}
          alt={post.title[lang]}
          title={post.title[lang]}
          width={1200}
          height={600}
          loading="eager"
          className="w-full aspect-[2/1] object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </motion.div>

      {/* Category Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-4"
      >
        <span
          className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/30"
          style={{
            textShadow: "0 0 10px rgba(59, 201, 255, 0.5)",
          }}
        >
          {post.category[lang]}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight"
      >
        {post.title[lang]}
      </motion.h1>

      {/* Meta Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center gap-6 text-sm text-white/50 mb-10 pb-10 border-b border-white/10"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(post.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{post.readTime[lang]}</span>
        </div>
      </motion.div>
    </>
  );
};
