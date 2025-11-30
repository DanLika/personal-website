import { useEffect } from "react";
import { Hero } from "../hero/Hero";
import { FeaturedProject } from "../projects/FeaturedProject";
import { ProjectList } from "../projects/ProjectList";
import { AboutSection } from "../about/AboutSection";
import { Contact } from "../contact/Contact";
import { Footer } from "../layout/Footer";

export const HomePage = () => {
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

    return (
        <>
            <Hero />
            <FeaturedProject />
            <ProjectList />
            <AboutSection />
            <Contact />
            <Footer />
        </>
    );
};
