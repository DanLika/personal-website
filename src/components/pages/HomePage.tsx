import { useEffect, useRef, useState, useMemo } from "react";
import { Hero } from "../hero/Hero";
import { FeaturedProject } from "../projects/FeaturedProject";
import { ProjectList } from "../projects/ProjectList";
import { AboutSection } from "../about/AboutSection";
import { BlogSection } from "../blog/BlogSection";
import { FAQSection } from "../faq/FAQSection";
import { Contact } from "../contact/Contact";
import { Footer } from "../layout/Footer";
import { Particles } from "../ui/ParticleBg";
import { SEO } from "../seo/SEO";

export const HomePage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef<{ x: number; y: number } | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [particleKey, setParticleKey] = useState(0);
    const [particlesReady, setParticlesReady] = useState(false);

    // Detect mobile for particle optimization
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Defer particles initialization to reduce main thread blocking during initial load
    useEffect(() => {
        // Use requestIdleCallback if available, otherwise setTimeout
        const initParticles = () => setParticlesReady(true);

        if ('requestIdleCallback' in window) {
            const id = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(initParticles, { timeout: 1000 });
            return () => (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
        } else {
            const id = setTimeout(initParticles, 500);
            return () => clearTimeout(id);
        }
    }, []);

    useEffect(() => {
        // Handle hash-based navigation (e.g., /#about)
        const hash = window.location.hash.substring(1); // Remove the '#'
        if (hash) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, []);

    /**
     * Page-level mouse and touch tracking for particle interaction
     * Track mouse/touch on entire window to ensure particles react even when hovering/touching over empty space
     * Uses RAF throttling to reduce main thread blocking
     */
    useEffect(() => {
        let rafId: number | null = null;
        let lastUpdate = 0;
        const THROTTLE_MS = 16; // ~60fps throttle
        let pendingX = 0;
        let pendingY = 0;

        const updateMousePosition = () => {
            rafId = null;
            lastUpdate = performance.now();
            mouseRef.current = { x: pendingX, y: pendingY };
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Store latest position
            pendingX = (e.clientX / window.innerWidth) * 2 - 1;
            pendingY = -((e.clientY / window.innerHeight) * 2 - 1);

            const now = performance.now();
            if (now - lastUpdate < THROTTLE_MS) {
                // Schedule update if not already scheduled
                if (!rafId) {
                    rafId = requestAnimationFrame(updateMousePosition);
                }
                return;
            }

            // Immediate update
            lastUpdate = now;
            mouseRef.current = { x: pendingX, y: pendingY };
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                pendingX = (touch.clientX / window.innerWidth) * 2 - 1;
                pendingY = -((touch.clientY / window.innerHeight) * 2 - 1);
                mouseRef.current = { x: pendingX, y: pendingY };
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                pendingX = (touch.clientX / window.innerWidth) * 2 - 1;
                pendingY = -((touch.clientY / window.innerHeight) * 2 - 1);

                const now = performance.now();
                if (now - lastUpdate < THROTTLE_MS) {
                    if (!rafId) {
                        rafId = requestAnimationFrame(updateMousePosition);
                    }
                    return;
                }

                lastUpdate = now;
                mouseRef.current = { x: pendingX, y: pendingY };
            }
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: 0, y: 0 };
        };

        const handleTouchEnd = () => {
            mouseRef.current = { x: 0, y: 0 };
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('touchend', handleTouchEnd);
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
        };
    }, []);

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

    // Memoize particle config to prevent unnecessary re-renders
    const particleConfig = useMemo(() => ({
        particleCount: isMobile ? 50 : 70, // Reduced for better main thread performance
        particleSpread: 10,
        speed: isMobile ? 0.15 : 0.3,
        particleColors: ["#ffffff", "#3BC9FF", "#5DD9FF", "#a0e7ff"],
        moveParticlesOnHover: true, // Enable for both desktop and mobile
        particleHoverFactor: 2, // Increased from 1 to make movement more visible
        alphaParticles: true,
        particleBaseSize: isMobile ? 60 : 80,
        sizeRandomness: 1,
        cameraDistance: 20,
        disableRotation: isMobile,
    }), [isMobile]);

    return (
        <div ref={pageRef} className="relative w-full bg-[#0A0A0A]">
            {/* Dynamic SEO Meta Tags */}
            <SEO />

            {/* Single Particle Background for entire page */}
            {/* Fallback gradient background in case Particles fail */}
            <div className="fixed inset-0 z-0 bg-[#0A0A0A] pointer-events-none">
                <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 50% 0%, rgba(59, 201, 255, 0.08) 0%, transparent 50%),
                            linear-gradient(to bottom, #0A0A0A, #0A0A0A)
                        `
                    }}
                />
                {particlesReady && (
                    <Particles
                        key={particleKey}
                        {...particleConfig}
                        externalMouseRef={mouseRef}
                    />
                )}
            </div>

            {/* All sections with transparent backgrounds */}
            <main id="main-content" className="relative z-10">
                <Hero />
                <FeaturedProject />
                <ProjectList />
                <AboutSection />
                <BlogSection />
                <FAQSection />
                <Contact />
                <Footer />
            </main>
        </div>
    );
};

