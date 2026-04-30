'use client';

export default function GlobalStyles() {
  return (
    <style jsx global>{`
      @keyframes scrollDot {
        0%   { transform: translateY(-100%); }
        100% { transform: translateY(300%); }
      }
    `}</style>
  );
}
