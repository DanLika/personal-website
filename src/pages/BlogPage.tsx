import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { BlogCard } from "../components/blog/BlogCard";
import { getAllBlogs } from "../data/blogs";
import { Particles } from "../components/ui/ParticleBg";
import { Footer } from "../components/layout/Footer";

export const BlogPage = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "bs";
  const allPosts = getAllBlogs();

  const pageRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mouse tracking for particles
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = page.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };

    const handleMouseLeave = () => {
      mouseRef.current = null;
    };

    page.addEventListener("mousemove", handleMouseMove);
    page.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      page.removeEventListener("mousemove", handleMouseMove);
      page.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {lang === "bs"
            ? "Blog | Licanin - Tech, SaaS i AI Insights"
            : "Blog | Licanin - Tech, SaaS & AI Insights"}
        </title>
        <meta
          name="description"
          content={
            lang === "bs"
              ? "Pročitajte najnovije članke o web razvoju, SaaS-u, mobilnim aplikacijama i AI-potpomognutom programiranju."
              : "Read the latest articles about web development, SaaS, mobile apps, and AI-assisted programming."
          }
        />
      </Helmet>

      <div ref={pageRef} className="relative min-h-screen bg-[#0A0A0A]">
        {/* Particle Background */}
        <div className="fixed inset-0 z-0">
          <Particles
            particleCount={150}
            particleSpread={10}
            speed={0.1}
            particleColors={["#ffffff", "#3BC9FF", "#5DD9FF", "#a0e7ff"]}
            moveParticlesOnHover={true}
            particleHoverFactor={1}
            alphaParticles={true}
            particleBaseSize={80}
            sizeRandomness={1}
            cameraDistance={20}
            disableRotation={false}
            externalMouseRef={mouseRef}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <main className="pt-24 sm:pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
              {/* Page Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 md:mb-16"
              >
                {/* Badge */}
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold uppercase tracking-wider rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-400/20"
                  style={{
                    textShadow: "0 0 10px rgba(59, 201, 255, 0.5)",
                  }}
                >
                  {t("blog.page.badge")}
                </motion.span>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                  {t("blog.page.title")}
                </h1>

                {/* Subtitle */}
                <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto">
                  {t("blog.page.subtitle")}
                </p>
              </motion.div>

              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {allPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>

              {/* Empty State */}
              {allPosts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <p className="text-white/40 text-lg">
                    {lang === "bs"
                      ? "Nema dostupnih članaka."
                      : "No articles available."}
                  </p>
                </motion.div>
              )}
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
};
