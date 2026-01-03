import { useState, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar } from "./components/Navbar";
import { AppRoutes } from "./components/Routes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

function App() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(location.pathname === "/");

  // Update document lang attribute when language changes
  useLayoutEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useLayoutEffect(() => {
    if (location.pathname === "/") {
      // This is a deliberate choice to re-trigger the loading animation on home page navigation.
      // The synchronous update is necessary to avoid a flicker.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <LoadingSpinner isLoading={isLoading} />
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navbar />
        <main id="main-content">
          <AppRoutes />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
