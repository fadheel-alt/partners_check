interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Floating heart icon
export function FloatingHeart({ className = "", size = "md" }: IconProps) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };

  return (
    <svg className={`${sizes[size]} ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            fill="url(#heart-gradient)"
            stroke="#FFB7C5"
            strokeWidth="1" />
      <defs>
        <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB7C5" />
          <stop offset="100%" stopColor="#D8B5FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Sparkle icon for dividers
export function SparkleIcon({ className = "", size = "md" }: IconProps) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };

  return (
    <svg className={`${sizes[size]} ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l1.5 6L12 10l-1.5-2L12 2zM2 12l6 1.5L10 12l-2-1.5L2 12zM12 22l1.5-6L12 14l-1.5 2L12 22zM22 12l-6 1.5L14 12l2-1.5L22 12z"
            fill="url(#sparkle-gradient)"
            opacity="0.9" />
      <defs>
        <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D8B5FF" />
          <stop offset="100%" stopColor="#FFB7C5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Couple heart icon for partner section
export function CoupleHeartIcon({ className = "", size = "md" }: IconProps) {
  const sizes = { sm: "w-5 h-5", md: "w-7 h-7", lg: "w-9 h-9" };

  return (
    <svg className={`${sizes[size]} ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M16.5 3A5.5 5.5 0 0 0 12 5.5 5.5 5.5 0 0 0 7.5 3 5.5 5.5 0 0 0 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5A5.5 5.5 0 0 0 16.5 3z"
            fill="#FFB7C5"
            opacity="0.7" />
      <circle cx="9" cy="9" r="2" fill="white" opacity="0.5" />
      <circle cx="15" cy="9" r="2" fill="white" opacity="0.5" />
    </svg>
  );
}

// Sunrise icon for morning
export function SunriseIcon({ className = "", size = "md" }: IconProps) {
  const sizes = { sm: "w-5 h-5", md: "w-6 h-6", lg: "w-8 h-8" };

  return (
    <svg className={`${sizes[size]} ${className}`} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" fill="#FFA500" opacity="0.8" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="#FFA500"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6" />
    </svg>
  );
}

// Moon & stars icon for evening
export function MoonStarsIcon({ className = "", size = "md" }: IconProps) {
  const sizes = { sm: "w-5 h-5", md: "w-6 h-6", lg: "w-8 h-8" };

  return (
    <svg className={`${sizes[size]} ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="#6366F1"
            opacity="0.7" />
      <path d="M17 3l.5 2 .5-2-.5 2L17 3zM20 8l.3 1.5.3-1.5-.3 1.5L20 8zM22 5l.4 1.8.4-1.8-.4 1.8L22 5z"
            fill="#D8B5FF" />
    </svg>
  );
}
