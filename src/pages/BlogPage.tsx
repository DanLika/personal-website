import { useEffect, useRef, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for particle optimization
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Window-level mouse/touch tracking for particles with RAF throttling
  useEffect(() => {
    let rafId: number | null = null;
    let lastUpdate = 0;
    const THROTTLE_MS = 16;
    let pendingX = 0;
    let pendingY = 0;

    const updatePosition = () => {
      rafId = null;
      lastUpdate = performance.now();
      mouseRef.current = { x: pendingX, y: pendingY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = (e.clientX / window.innerWidth) * 2 - 1;
      pendingY = -((e.clientY / window.innerHeight) * 2 - 1);
      const now = performance.now();
      if (now - lastUpdate < THROTTLE_MS) {
        if (!rafId) rafId = requestAnimationFrame(updatePosition);
        return;
      }
      lastUpdate = now;
      mouseRef.current = { x: pendingX, y: pendingY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        pendingX = (touch.clientX / window.innerWidth) * 2 - 1;
        pendingY = -((touch.clientY / window.innerHeight) * 2 - 1);
        const now = performance.now();
        if (now - lastUpdate < THROTTLE_MS) {
          if (!rafId) rafId = requestAnimationFrame(updatePosition);
          return;
        }
        lastUpdate = now;
        mouseRef.current = { x: pendingX, y: pendingY };
      }
    };

    const handleEnd = () => {
      mouseRef.current = { x: 0, y: 0 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleEnd);
    window.addEventListener('touchend', handleEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleEnd);
      window.removeEventListener('touchend', handleEnd);
      if (rafId) cancelAnimationFrame(rafId);
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
        <link rel="canonical" href="https://licanin.dev/blog" />
        <meta property="og:url" content="https://licanin.dev/blog" />
      </Helmet>

      <div ref={pageRef} className="relative min-h-screen bg-[#0A0A0A]">
        {/* Particle Background */}
        <div className="fixed inset-0 z-0">
          <Particles
            particleCount={isMobile ? 80 : 100}
            particleSpread={10}
            speed={isMobile ? 0.15 : 0.3}
            particleColors={["#ffffff", "#3BC9FF", "#5DD9FF", "#a0e7ff"]}
            moveParticlesOnHover={true}
            particleHoverFactor={2}
            alphaParticles={true}
            particleBaseSize={isMobile ? 60 : 80}
            sizeRandomness={1}
            cameraDistance={20}
            disableRotation={isMobile}
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
                  <p className="text-white/60 text-lg">
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
