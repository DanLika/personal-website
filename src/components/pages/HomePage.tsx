import { useEffect, useRef } from "react";
import { Hero } from "../hero/Hero";
import { FeaturedProject } from "../projects/FeaturedProject";
import { ProjectList } from "../projects/ProjectList";
import { AboutSection } from "../about/AboutSection";
import { BlogSection } from "../blog/BlogSection";
import { FAQSection } from "../faq/FAQSection";
import { Contact } from "../contact/Contact";
import { Footer } from "../layout/Footer";
import { Particles } from "../ui/ParticleBg";

export const HomePage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef<{ x: number; y: number } | null>(null);

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
     * Page-level mouse tracking for particle interaction
     */
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

        page.addEventListener('mousemove', handleMouseMove);
        page.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            page.removeEventListener('mousemove', handleMouseMove);
            page.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div ref={pageRef} className="relative w-full bg-[#0A0A0A]">
            {/* Single Particle Background for entire page */}
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

            {/* All sections with transparent backgrounds */}
            <div className="relative z-10">
                <Hero />
                <FeaturedProject />
                <ProjectList />
                <AboutSection />
                <BlogSection />
                <FAQSection />
                <Contact />
                <Footer />
            </div>
        </div>
    );
};
