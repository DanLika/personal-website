import { motion, AnimatePresence } from "framer-motion";

interface LoadingSpinnerProps {
  isLoading: boolean;
}

/**
 * LoadingSpinner - Custom circular loading spinner with design system colors
 * 
 * Features:
 * - Circular spinner with neon cyan (#3BC9FF) color
 * - Smooth fade in/out animations
 * - Glass morphism background matching site design
 * - Centered full-screen overlay
 */
export const LoadingSpinner = ({ isLoading }: LoadingSpinnerProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-obsidian"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 0%, rgba(59, 201, 255, 0.08) 0%, transparent 50%),
              linear-gradient(to bottom, #0A0A0A, #0A0A0A)
            `
          }}
        >
          {/* Glass morphism container */}
          <div className="relative">
            {/* Outer glow */}
            <div
              className="absolute -inset-8 rounded-full blur-2xl opacity-30"
              style={{
                background: `radial-gradient(circle, rgba(59, 201, 255, 0.4) 0%, transparent 70%)`,
              }}
            />

            {/* Spinner container with glass effect */}
            <div
              className="relative rounded-full p-8 backdrop-blur-sm"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(59, 201, 255, 0.2)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 20px -5px rgba(59, 201, 255, 0.3)",
              }}
            >
              {/* Circular spinner */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(59, 201, 255, 0.1)"
                    strokeWidth="8"
                  />
                  {/* Animated spinner circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3BC9FF"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="212"
                    strokeDashoffset="212"
                    initial={{ strokeDashoffset: 212 }}
                    animate={{
                      strokeDashoffset: [212, 0, 212],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: [0.4, 0, 0.6, 1],
                    }}
                  />
                  {/* Glow effect */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(59, 201, 255, 0.4)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="212"
                    strokeDashoffset="212"
                    initial={{ strokeDashoffset: 212 }}
                    animate={{
                      strokeDashoffset: [212, 0, 212],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: [0.4, 0, 0.6, 1],
                      delay: 0.15,
                    }}
                    style={{
                      filter: "blur(6px)",
                    }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

