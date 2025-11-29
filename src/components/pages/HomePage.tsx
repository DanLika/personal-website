import { Hero } from "../hero/Hero";
import { FeaturedProject } from "../projects/FeaturedProject";
import { ProjectList } from "../projects/ProjectList";
import { AboutSection } from "../about/AboutSection";
import { Contact } from "../contact/Contact";
import { Footer } from "../layout/Footer";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Hero />
      <FeaturedProject />
      <ProjectList />
      <AboutSection />
      <Contact />
      <Footer />
    </div>
  );
};
