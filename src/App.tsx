import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AppRoutes } from "./components/Routes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

// AppContent component handles the loading logic and page content
function AppContent() {
  const location = useLocation();
  const [heroLoaded, setHeroLoaded] = useState(location.pathname !== "/");
  const isLoading = location.pathname === "/" && !heroLoaded;

  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    let observer: IntersectionObserver | null = null;
    let checkTimeout: ReturnType<typeof setTimeout> | null = null;
    let fallbackTimeout: ReturnType<typeof setTimeout> | null = null;
    let checkAttempts = 0;
    const MAX_CHECK_ATTEMPTS = 20;

    const setupHeroObserver = () => {
      const heroSection = document.getElementById("home");

      if (!heroSection) {
        checkAttempts++;
        if (checkAttempts >= MAX_CHECK_ATTEMPTS) {
          console.warn("Hero section not found, hiding loader.");
          setHeroLoaded(true);
          return;
        }
        checkTimeout = setTimeout(setupHeroObserver, 100);
        return;
      }

      const rect = heroSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(() => setHeroLoaded(true), 300);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setTimeout(() => setHeroLoaded(true), 300);
            observer?.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(heroSection);
    };

    const initialDelay = setTimeout(setupHeroObserver, 50);

    fallbackTimeout = setTimeout(() => {
      console.warn("Fallback timeout, hiding loader.");
      setHeroLoaded(true);
    }, 2000);

    return () => {
      clearTimeout(initialDelay);
      if (checkTimeout) clearTimeout(checkTimeout);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      observer?.disconnect();
    };
  }, [location.pathname]);

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      <Navbar />
      <AppRoutes />
    </>
  );
}

// App component now wraps AppContent with a key to force re-mount on navigation
function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0A0A0A]">
        <AppContent key={location.pathname} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
