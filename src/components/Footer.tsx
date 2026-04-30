'use client';
import React from 'react';
import AppLogo from '@/components/ui/AppLogo';
import { useLanguage } from '@/context/LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-chromium/15 bg-gunmetal">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo + links */}
        <div className="flex items-center gap-8">
          <AppLogo size={120} className="text-chromium" />
          <nav className="flex items-center gap-6">
            {[
              { label: t('nav.about'), href: '#about' },
              { label: t('nav.projects'), href: '#projects' },
              { label: t('nav.experience'), href: '#experience' },
              { label: t('nav.contact'), href: '#contact' }
            ]?.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-chromium/60 hover:text-titanium transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right: social + copyright */}
        <div className="flex items-center gap-5">
          {/* Twitter/X */}
          <a href="#" className="text-chromium/50 hover:text-signal-blue transition-colors" aria-label="Twitter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          {/* LinkedIn */}
          <a href="#" className="text-chromium/50 hover:text-signal-blue transition-colors" aria-label="LinkedIn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <span className="text-chromium/40 text-xs font-medium">
            {t('footer.copyright')}
          </span>
        </div>
      </div>
    </footer>
  );
}