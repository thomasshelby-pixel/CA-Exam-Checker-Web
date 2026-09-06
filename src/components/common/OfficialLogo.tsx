import React from 'react';

interface OfficialLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'header';
  className?: string;
  showTagline?: boolean;
}

export const OfficialLogo: React.FC<OfficialLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  showTagline = true,
}) => {
  // Dimensions
  const emblemSizes = {
    sm: { width: 36, height: 36 },
    md: { width: 48, height: 48 },
    lg: { width: 72, height: 72 },
    xl: { width: 104, height: 104 },
  };

  const { width, height } = emblemSizes[size] || emblemSizes.md;

  // The Emblem SVG
  const EmblemSVG = (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-sm transition-transform duration-300"
    >
      <defs>
        {/* Blue Metallic Gradient for CA monogram */}
        <linearGradient id="caGradPrimary" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="35%" stopColor="#0284C7" />
          <stop offset="70%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#0F2B5C" />
        </linearGradient>

        <linearGradient id="caGradSecondary" x1="100" y1="40" x2="190" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="60%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#091E42" />
        </linearGradient>

        <linearGradient id="swooshGrad" x1="30" y1="130" x2="170" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        <linearGradient id="penGrad" x1="120" y1="90" x2="160" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B192C" />
          <stop offset="80%" stopColor="#1E3E62" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>

        {/* Paper drop shadow */}
        <filter id="paperShadow" x="50" y="40" width="85" height="95" filterUnits="userSpaceOnUse">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Sparkle 1 */}
      <path
        d="M165 24C165 32 173 40 173 40C173 40 165 48 165 56C165 48 157 40 157 40C157 40 165 32 165 24Z"
        fill="#0284C7"
      />
      {/* Sparkle 2 */}
      <path
        d="M182 52C182 56 186 60 186 60C186 60 182 64 182 68C182 64 178 60 178 60C178 60 182 56 182 52Z"
        fill="#38BDF8"
      />

      {/* Letter 'C' outer curve */}
      <path
        d="M130 50C105 32 60 38 42 62C24 86 26 122 46 144C66 166 102 166 125 152L116 136C99 146 72 146 58 131C44 116 42 88 56 70C70 52 101 48 119 60L130 50Z"
        fill="url(#caGradPrimary)"
      />

      {/* Letter 'A' structure */}
      <path
        d="M142 42L95 156H116L126 132H162L172 156H193L156 42H142ZM144 86L156 116H132L144 86Z"
        fill="url(#caGradSecondary)"
      />

      {/* Evaluated Paper Sheet with Drop Shadow */}
      <g filter="url(#paperShadow)">
        <path
          d="M66 52C78 50 115 54 122 58C126 76 124 104 119 116C105 120 74 122 66 114C62 98 63 68 66 52Z"
          fill="#FFFFFF"
          stroke="#0284C7"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Evaluation Item 1: Green Checkmark */}
        <circle cx="78" cy="68" r="4.5" fill="#10B981" />
        <path d="M76 68L77.5 69.5L80.5 66.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="86" y1="68" x2="112" y2="68" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" />

        {/* Evaluation Item 2: Orange Circle */}
        <circle cx="78" cy="84" r="4.5" fill="#F59E0B" />
        <circle cx="78" cy="84" r="2.2" fill="#FFFFFF" />
        <line x1="86" y1="84" x2="112" y2="84" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" />

        {/* Evaluation Item 3: Red Cross */}
        <circle cx="78" cy="100" r="4.5" fill="#EF4444" />
        <path d="M76 98L80 102M80 98L76 102" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="86" y1="100" x2="106" y2="100" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* Dynamic Swoosh */}
      <path
        d="M66 124C85 142 135 144 175 110C165 126 125 148 66 124Z"
        fill="url(#swooshGrad)"
      />
      <path
        d="M66 124C85 142 135 144 175 110"
        stroke="#0284C7"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Modern Executive Pen */}
      <g transform="rotate(32 145 95)">
        {/* Pen Body */}
        <path d="M141 60L149 60L148 110L142 110Z" fill="url(#penGrad)" />
        {/* Pen Clip */}
        <path d="M143 65L143 85L145 85L145 65Z" fill="#38BDF8" />
        {/* Pen Nib Collar */}
        <path d="M142 110L148 110L145 122Z" fill="#E2E8F0" />
        {/* Pen Fine Tip */}
        <path d="M144.5 120L145.5 120L145 125Z" fill="#000000" />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{EmblemSVG}</div>;
  }

  // Header variant for Navbar
  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-2.5 sm:gap-3 text-left ${className}`}>
        {EmblemSVG}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="font-serif font-black tracking-tight text-sm sm:text-base leading-none text-[#1A1A1A] dark:text-[#F4F3EE]">
              CA EXAM CHECKER
            </span>
            <span className="font-sans font-black text-xs sm:text-sm text-[#0284C7] leading-none">
              AI
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.14em] uppercase text-[#1A1A1A]/70 dark:text-[#F4F3EE]/70 mt-0.5">
            Checked Like An Examiner
          </span>
        </div>
      </div>
    );
  }

  // Full official logo display with brand text, tagline, and blue badge
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {EmblemSVG}

      <div className="mt-2 flex flex-col items-center">
        <h1 className="font-serif font-black tracking-tight text-xl sm:text-2xl lg:text-3xl text-[#0F172A] dark:text-[#F8FAFC] leading-none">
          CA EXAM CHECKER <span className="text-[#0284C7]">AI</span>
        </h1>

        {showTagline && (
          <>
            {/* Tagline with thin rules */}
            <div className="w-full flex items-center justify-center gap-2 my-2">
              <span className="h-[1px] w-8 sm:w-12 bg-[#0284C7]/60"></span>
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.22em] text-[#0F172A] dark:text-[#F1F5F9]">
                Checked Like An Examiner
              </span>
              <span className="h-[1px] w-8 sm:w-12 bg-[#0284C7]/60"></span>
            </div>

            {/* Rounded Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0284C7] text-white text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
              <span>Accurate</span>
              <span className="opacity-60">•</span>
              <span>Reliable</span>
              <span className="opacity-60">•</span>
              <span>Examiner Style Evaluation</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
