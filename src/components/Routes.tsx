import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { CaseStudyPage } from "./case-study/CaseStudyPage";
import { BlogPage } from "../pages/BlogPage";
import { BlogPostPage } from "../pages/BlogPostPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/case-study/:projectId" element={<CaseStudyPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
    </Routes>
  );
};
