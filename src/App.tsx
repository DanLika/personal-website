import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AppRoutes } from "./components/Routes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkAttemptsRef = useRef(0);
  const MAX_CHECK_ATTEMPTS = 20; // Maximum 2 seconds (20 * 100ms)

  // Main effect: Setup loader logic on mount and route changes
  useEffect(() => {
    // Reset state when route changes
    checkAttemptsRef.current = 0;

    // Cleanup any existing observers/timeouts
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
      checkTimeoutRef.current = null;
    }
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }

    // Only show loader on home page
    if (location.pathname !== "/") {
      setIsLoading(false);
      return;
    }

    // On home page, show loader and start checking for hero section
    setIsLoading(true);

    // Function to check and observe hero section (defined inside useEffect to avoid stale closures)
    const setupHeroObserver = () => {
      const heroSection = document.getElementById("home");

      if (!heroSection) {
        checkAttemptsRef.current += 1;

        // If we've tried too many times, give up
        if (checkAttemptsRef.current >= MAX_CHECK_ATTEMPTS) {
          console.warn("Hero section not found after maximum attempts, hiding loader");
          setIsLoading(false);
          return;
        }

        // Try again after a short delay
        checkTimeoutRef.current = setTimeout(setupHeroObserver, 100);
        return;
      }

      // Hero section found, reset attempts counter
      checkAttemptsRef.current = 0;

      // Disconnect any existing observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Check if hero is already visible and has content (in case it rendered before observer was set up)
      const rect = heroSection.getBoundingClientRect();
      const hasContent = heroSection.children.length > 0 || heroSection.textContent?.trim().length > 0;
      const isAlreadyVisible =
        hasContent &&
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.width > 0 &&
        rect.height > 0;

      if (isAlreadyVisible) {
        // Hero is already visible, hide loader after a short delay
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
        return;
      }

      // Create IntersectionObserver to detect when hero becomes visible
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Hero section is visible, hide loader after a short delay for smooth transition
              setTimeout(() => {
                setIsLoading(false);
              }, 300);

              // Disconnect observer once hero is visible
              if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
              }
            }
          });
        },
        {
          threshold: 0.1, // Trigger when 10% of hero is visible
          rootMargin: "0px",
        }
      );

      observerRef.current.observe(heroSection);
    };

    // Small delay to ensure DOM is ready after route change
    const initialDelay = setTimeout(() => {
      setupHeroObserver();
    }, 50);

    // Fallback: Hide loader after maximum 2 seconds even if hero doesn't become visible
    fallbackTimeoutRef.current = setTimeout(() => {
      console.warn("Fallback timeout reached, hiding loader");
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(initialDelay);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
        checkTimeoutRef.current = null;
      }
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }
    };
  }, [location.pathname]); // Re-run when route changes

  return (
    <ErrorBoundary>
      <LoadingSpinner isLoading={isLoading} />
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navbar />
        <AppRoutes />
      </div>
    </ErrorBoundary>
  );
}

export default App;
