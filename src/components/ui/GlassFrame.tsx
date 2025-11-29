import type { ReactNode } from "react";

interface GlassFrameProps {
  children: ReactNode;
  className?: string;
}

export const GlassFrame = ({ children, className = "" }: GlassFrameProps) => {
  return (
    <div
      className={`relative rounded-[40px] md:rounded-[40px] sm:rounded-[30px] border border-white/10 border-t-white/20 border-b-white/5 border-l-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden shadow-glass shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] p-8 md:p-12 sm:p-6 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[40px] md:rounded-[40px] sm:rounded-[30px] border border-transparent [border-image:linear-gradient(to_bottom,rgba(255,255,255,0.25),rgba(255,255,255,0.05))_1]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-soft-light bg-[url('/noise.png')]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
