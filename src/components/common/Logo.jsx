export default function Logo({ isCollapsed }) {
  return (
    <div className="flex items-center gap-3 overflow-hidden select-none">
      {/* Minimalist "M" in a perfect circle (Claude-style) */}
      <div className="shrink-0 flex items-center justify-center shadow-sm rounded-full">
        <svg 
          width={isCollapsed ? "36" : "32"} 
          height={isCollapsed ? "36" : "32"} 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-300"
        >
          {/* Perfect straight circle background */}
          <circle cx="16" cy="16" r="16" fill="url(#m-bg-gradient)" />
          
          {/* Elegant geometric "M" */}
          <path 
            d="M10 21.5V11L16 16.5L22 11V21.5" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          <defs>
            {/* Subtle gradient for depth while maintaining a flat, modern look */}
            <linearGradient id="m-bg-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6d56f0" /> {/* Your exact accent color */}
              <stop offset="1" stopColor="#4c39b3" /> {/* Slightly darker for depth */}
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* App Name & Tagline (Hidden when sidebar is collapsed) */}
      {!isCollapsed && (
        <div className="flex flex-col truncate mt-0.5">
          <span className="text-[17px] font-extrabold tracking-tight text-ink leading-none">
            ModelFlux
          </span>
          <span className="text-[9.5px] font-bold text-accent tracking-[0.2em] uppercase mt-1 opacity-80">
            AI Gateway
          </span>
        </div>
      )}
    </div>
  );
}