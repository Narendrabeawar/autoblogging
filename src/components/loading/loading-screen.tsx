"use client";

import { usePathname } from "next/navigation";

const isEn = (pathname: string | null) => pathname?.startsWith("/en") ?? false;

interface LoadingScreenProps {
  /** Use for /en routes so server-rendered loading shows English */
  label?: string;
}

export function LoadingScreen({ label: labelOverride }: LoadingScreenProps = {}) {
  const pathname = usePathname();
  const en = isEn(pathname);
  const label = labelOverride ?? (en ? "Loading..." : "लोड हो रहा है...");

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4"
      aria-hidden
    >
      {/* Train-waiting scene: platform, person, train approaching */}
      <div className="relative h-24 w-48 sm:h-28 sm:w-56" aria-hidden>
        <svg
          viewBox="0 0 220 100"
          className="h-full w-full text-foreground/80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track */}
          <line
            x1="20"
            y1="72"
            x2="200"
            y2="72"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-40"
          />
          {/* Sleepers */}
          {[30, 50, 70, 90, 110, 130, 150, 170, 190].map((x) => (
            <line
              key={x}
              x1={x}
              y1="68"
              x2={x}
              y2="76"
              stroke="currentColor"
              strokeWidth="1.5"
              className="opacity-30"
            />
          ))}
          {/* Person waiting (standing figure) */}
          <g className="animate-pulse">
            <circle cx="42" cy="58" r="6" fill="currentColor" className="opacity-90" />
            <rect x="38" y="64" width="8" height="20" rx="2" fill="currentColor" className="opacity-80" />
            <line x1="42" y1="84" x2="32" y2="72" stroke="currentColor" strokeWidth="2" className="opacity-70" />
            <line x1="42" y1="84" x2="52" y2="72" stroke="currentColor" strokeWidth="2" className="opacity-70" />
          </g>
          {/* Train (approaching from right) */}
          <g className="animate-train-approach">
            <rect
              x="140"
              y="42"
              width="70"
              height="32"
              rx="4"
              fill="currentColor"
              className="opacity-90"
            />
            <rect x="148" y="48" width="12" height="10" rx="1" fill="var(--background)" className="opacity-90" />
            <rect x="168" y="48" width="12" height="10" rx="1" fill="var(--background)" className="opacity-90" />
            <rect x="188" y="48" width="12" height="10" rx="1" fill="var(--background)" className="opacity-90" />
            {/* Front light */}
            <circle cx="208" cy="58" r="3" fill="currentColor" className="opacity-60" />
          </g>
        </svg>
      </div>
      <p className="text-sm font-medium text-muted-foreground" aria-live="polite">
        {label}
      </p>
    </div>
  );
}
