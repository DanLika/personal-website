import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Eager load HomePage (users always see this first)
import { HomePage } from "./pages/HomePage";

// Lazy load all other routes for better initial bundle size
const CaseStudyPage = lazy(() =>
  import("./case-study/CaseStudyPage").then(m => ({ default: m.CaseStudyPage }))
);
const BlogPage = lazy(() =>
  import("../pages/BlogPage").then(m => ({ default: m.BlogPage }))
);
const BlogPostPage = lazy(() =>
  import("../pages/BlogPostPage").then(m => ({ default: m.BlogPostPage }))
);
const Apartman1Page = lazy(() =>
  import("../pages/ApartmanPage").then(m => ({ default: m.Apartman1Page }))
);
const Apartman2Page = lazy(() =>
  import("../pages/ApartmanPage").then(m => ({ default: m.Apartman2Page }))
);
const Apartman3Page = lazy(() =>
  import("../pages/ApartmanPage").then(m => ({ default: m.Apartman3Page }))
);
const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage").then(m => ({ default: m.NotFoundPage }))
);

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/case-study/:projectId" element={<CaseStudyPage />} />
        <Route path="/apartman-1" element={<Apartman1Page />} />
        <Route path="/apartman-2" element={<Apartman2Page />} />
        <Route path="/apartman-3" element={<Apartman3Page />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
