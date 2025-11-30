import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { CaseStudyPage } from "./case-study/CaseStudyPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/case-study/:project" element={<CaseStudyPage />} />
    </Routes>
  );
};
