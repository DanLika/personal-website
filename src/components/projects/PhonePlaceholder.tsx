import { motion } from "framer-motion";

export const PhonePlaceholder = () => {
  return (
    <motion.div
      initial={{ rotateY: 0 }}
      whileHover={{ rotateY: 15 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-64 h-[520px] aspect-[9/19] max-w-full"
      style={{ perspective: "1000px" }}
    >
      {/* Phone Frame */}
      <div className="absolute inset-0 rounded-[40px] bg-gradient-to-b from-gray-900 to-black border-2 border-cyan-400/30 shadow-[0_0_40px_rgba(59,201,255,0.2)] overflow-hidden">
        
        {/* Top Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
        
        {/* Screen */}
        <div className="absolute inset-2 rounded-[32px] overflow-hidden">
          {/* Screen Background with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-black/20 to-transparent" />
            
            {/* Screen Content Placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4">
              {/* App Icon Placeholder */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(59,201,255,0.4)]"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-400/20 border border-cyan-300/50" />
              </motion.div>
              
              {/* App Name */}
              <div className="text-center space-y-2">
                <div className="w-32 h-4 bg-white/20 rounded-full mx-auto" />
                <div className="w-24 h-3 bg-white/10 rounded-full mx-auto" />
              </div>
              
              {/* UI Elements */}
              <div className="w-full space-y-3">
                <div className="w-full h-3 bg-white/10 rounded-full" />
                <div className="w-3/4 h-3 bg-white/10 rounded-full" />
                <div className="w-1/2 h-3 bg-white/10 rounded-full" />
              </div>
              
              {/* Button Placeholder */}
              <div className="w-28 h-10 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full border border-cyan-400/40 shadow-[0_0_15px_rgba(59,201,255,0.3)]" />
            </div>
          </div>
          
          {/* Screen Reflection */}
          <div 
            className="absolute inset-0 rounded-[32px] pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.05) 50%, transparent 65%)'
            }}
          />
        </div>
        
        {/* Side Buttons */}
        <div className="absolute right-0 top-24 w-1 h-12 bg-gray-800 rounded-l-full shadow-[inset_-1px_0_2px_rgba(0,0,0,0.5)]" />
        <div className="absolute right-0 top-40 w-1 h-8 bg-gray-800 rounded-l-full shadow-[inset_-1px_0_2px_rgba(0,0,0,0.5)]" />
        
        {/* Bottom Speaker Grille */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 flex gap-1 justify-center">
          <div className="w-1 h-1 bg-gray-600 rounded-full" />
          <div className="w-1 h-1 bg-gray-600 rounded-full" />
          <div className="w-1 h-1 bg-gray-600 rounded-full" />
          <div className="w-1 h-1 bg-gray-600 rounded-full" />
          <div className="w-1 h-1 bg-gray-600 rounded-full" />
          <div className="w-1 h-1 bg-gray-600 rounded-full" />
          <div className="w-1 h-1 bg-gray-600 rounded-full" />
        </div>
      </div>
      
      {/* Phone Glow Effect */}
      <motion.div
        animate={{ 
          boxShadow: [
            '0 0 20px rgba(59, 201, 255, 0.3)',
            '0 0 40px rgba(59, 201, 255, 0.5)',
            '0 0 20px rgba(59, 201, 255, 0.3)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-[40px] pointer-events-none"
      />
    </motion.div>
  );
};
