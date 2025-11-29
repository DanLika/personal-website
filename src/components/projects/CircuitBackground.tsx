import { motion } from "framer-motion";

export const CircuitBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Circuit Lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="circuitGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3BC9FF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3BC9FF" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="circuitGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#3BC9FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal Circuit Lines */}
        <motion.path
          d="M 0 100 L 300 100 L 350 150 L 600 150"
          stroke="url(#circuitGradient1)"
          strokeWidth="2"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        />
        
        <motion.path
          d="M 700 200 L 900 200 L 950 250 L 1200 250"
          stroke="url(#circuitGradient2)"
          strokeWidth="1.5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.8 }}
        />

        {/* Vertical Circuit Lines */}
        <motion.path
          d="M 200 0 L 200 200 L 250 250 L 250 400"
          stroke="url(#circuitGradient2)"
          strokeWidth="1.5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
        />
        
        <motion.path
          d="M 800 300 L 800 500 L 850 550 L 850 700"
          stroke="url(#circuitGradient1)"
          strokeWidth="2"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2.2, ease: "easeInOut", delay: 1.2 }}
        />

        {/* Diagonal Circuit Lines */}
        <motion.path
          d="M 100 400 L 300 600 L 400 600"
          stroke="url(#circuitGradient2)"
          strokeWidth="1.5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 1.8, ease: "easeInOut", delay: 1.5 }}
        />
        
        <motion.path
          d="M 600 100 L 800 300 L 900 300"
          stroke="url(#circuitGradient1)"
          strokeWidth="1.5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 1.8 }}
        />

        {/* Circuit Nodes (Connection Points) */}
        {[...Array(12)].map((_, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={Math.random() * 1200}
            cy={Math.random() * 800}
            r="3"
            fill="#3BC9FF"
            filter="url(#glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ 
              duration: 0.5, 
              delay: 2 + i * 0.1,
              type: "spring",
              stiffness: 200
            }}
          >
            <animate
              attributeName="opacity"
              values="0.8;0.3;0.8"
              dur={`${3 + Math.random() * 2}s`}
              repeatCount="indefinite"
              begin={`${i * 0.5}s`}
            />
          </motion.circle>
        ))}
      </svg>

      {/* Animated Glow Orbs */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle, ${i % 2 === 0 ? '#3BC9FF' : '#06B6D4'} 0%, transparent 70%)`,
              left: `${20 + (i * 15)}%`,
              top: `${10 + (i * 12)}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Mobile: Reduce intensity */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
    </div>
  );
};
