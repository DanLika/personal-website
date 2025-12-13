import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import { getBlogBySlug, getNextBlog } from "../data/blogs";
import { Particles } from "../components/ui/ParticleBg";
import { Footer } from "../components/layout/Footer";

export const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "bs" ? "bs-BA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
        <title>{post.title[lang]} | Licanin Blog</title>
        <meta name="description" content={post.excerpt[lang]} />
        <meta property="og:title" content={post.title[lang]} />
        <meta property="og:description" content={post.excerpt[lang]} />
        <meta property="og:image" content={post.coverImage} />
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

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-white
                  prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mt-12 prose-h1:mb-6 prose-h1:leading-tight
                  prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-4
                  prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-cyan-400
                  prose-p:text-white/80 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base prose-p:md:text-lg
                  prose-strong:text-cyan-400 prose-strong:font-semibold
                  prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                  prose-ul:text-white/80 prose-ul:my-6 prose-ul:pl-6
                  prose-ol:text-white/80 prose-ol:my-6 prose-ol:pl-6
                  prose-li:mb-3 prose-li:text-base prose-li:md:text-lg
                  prose-img:my-10 prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl
                  prose-code:text-cyan-400 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl"
              >
                <ReactMarkdown>{post.content[lang]}</ReactMarkdown>
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
