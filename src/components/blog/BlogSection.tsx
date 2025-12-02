import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "./BlogCard";
import { getLatestBlogs } from "../../data/blogs";

export const BlogSection = () => {
  const { t } = useTranslation();
  const latestPosts = getLatestBlogs(3);

  return (
    <section
      id="blog"
      className="relative w-full py-12 sm:py-16 md:py-20 bg-transparent overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Category Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold uppercase tracking-wider rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-400/20"
            style={{
              textShadow: "0 0 10px rgba(59, 201, 255, 0.5)",
            }}
          >
            {t("blog.section.badge")}
          </motion.span>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {t("blog.section.title")}
          </h2>

          {/* Subtitle */}
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto">
            {t("blog.section.subtitle")}
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {latestPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* See All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link to="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-6 py-3 rounded-full transition-all duration-300 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 backdrop-blur-sm hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/60 flex items-center gap-2"
            >
              <span className="text-cyan-400 text-sm font-semibold">
                {t("blog.section.cta")}
              </span>
              <ArrowRight className="w-4 h-4 text-cyan-400 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
