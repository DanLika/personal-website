import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import { getBlogBySlug, getNextBlog } from "../data/blogs";
import { Particles } from "../components/ui/ParticleBg";
import { Footer } from "../components/layout/Footer";
import { BlogHeader } from "../components/blog/BlogHeader";
import { BlogContent } from "../components/blog/BlogContent";

export const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "bs";

  const post = slug ? getBlogBySlug(slug) : undefined;
  const nextPost = slug ? getNextBlog(slug) : null;

  const pageRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [particleKey, setParticleKey] = useState(0);

  // Detect mobile for particle optimization
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to top on mount or slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Handle page visibility - reinitialize particles when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became visible, reinitialize particles to fix any WebGL context issues
        setParticleKey(prev => prev + 1);
      }
    };

    const handleContextLost = () => {
      // WebGL context was lost, reinitialize particles
      setParticleKey(prev => prev + 1);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('particles-context-lost', handleContextLost);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('particles-context-lost', handleContextLost);
    };
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

  // 404 State
  if (!post) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-white/60 mb-8">
            {lang === "bs"
              ? "Članak nije pronađen."
              : "Article not found."}
          </p>
          <Link
            to="/blog"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {t("blog.post.backToBlog")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title[lang].length > 50 ? `${post.title[lang].substring(0, 50)}...` : post.title[lang]} | Licanin</title>
        <meta name="description" content={post.excerpt[lang]} />
        <link rel="canonical" href={`https://licanin.dev/blog/${slug}`} />
        <meta property="og:url" content={`https://licanin.dev/blog/${slug}`} />
        <meta property="og:title" content={post.title[lang]} />
        <meta property="og:description" content={post.excerpt[lang]} />
        <meta property="og:image" content={`https://licanin.dev${post.coverImage}`} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div ref={pageRef} className="relative min-h-screen bg-[#0A0A0A]">
        {/* Particle Background */}
        {/* Fallback gradient background in case Particles fail */}
        <div className="fixed inset-0 z-0 bg-[#0A0A0A]">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 0%, rgba(59, 201, 255, 0.08) 0%, transparent 50%),
                linear-gradient(to bottom, #0A0A0A, #0A0A0A)
              `
            }}
          />
          <Particles
            key={particleKey}
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
            <article className="max-w-3xl mx-auto px-6 md:px-12">
              <BlogHeader post={post} lang={lang} />

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <BlogContent content={post.content[lang]} />
              </motion.div>

              {/* Next Post Navigation */}
              {nextPost && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-16 pt-10 border-t border-white/10"
                >
                  <p className="text-white/60 text-sm mb-4 uppercase tracking-wider">
                    {t("blog.post.nextArticle")}
                  </p>
                  <Link
                    to={`/blog/${nextPost.slug}`}
                    className="group block"
                  >
                    <div className="flex items-center justify-between gap-4 p-6 rounded-[20px] bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all duration-300">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 mb-1">
                          {nextPost.title[lang]}
                        </h3>
                        <p className="text-sm text-white/50">
                          {nextPost.category[lang]}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-cyan-400 transition-all duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              )}
            </article>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
};
