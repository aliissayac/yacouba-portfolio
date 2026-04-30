"use client";
import React, { useEffect, useRef, useState } from "react";
import AppLogo from "@/components/ui/AppLogo";
import { useTheme } from "@/context/ThemeProvider";
import { useLanguage } from "@/context/LanguageProvider";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 border-b transition-all duration-300 ${scrolled
        ? "bg-gunmetal/97 border-chromium/15 backdrop-blur-xl"
        : "bg-transparent border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <AppLogo
            src="/assets/images/logo.png"
            size={120}
            className="text-titanium"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: t("nav.about"), href: "#about" },
            { label: t("nav.skills"), href: "#skills" },
            { label: t("nav.projects"), href: "#projects" },
            { label: t("nav.experience"), href: "#experience" },
          ]?.map((item) => (
            <a
              key={item?.label}
              href={item?.href}
              className="text-sm font-medium text-chromium hover:text-titanium transition-colors duration-200"
            >
              {item?.label}
            </a>
          ))}
        </nav>

        {/* CTA Pill */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 border-r border-chromium/15 pr-4 mr-2">
            <button
              onClick={toggleLanguage}
              className="text-xs font-bold uppercase w-8 h-8 rounded-full flex items-center justify-center bg-gunmetal-light border border-chromium/15 text-chromium hover:text-titanium transition-colors"
            >
              {language === 'en' ? 'fr' : 'en'}
            </button>
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gunmetal-light border border-chromium/15 text-chromium hover:text-titanium transition-colors"
            >
              {theme === "dark" ? (
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>

          <a
            href="#contact"
            className="cta-pill hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
          >
            {t("nav.getInTouch")}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-chromium hover:text-titanium transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 4l12 12M16 4L4 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M3 5h14M3 10h14M3 15h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gunmetal-light border-t border-chromium/15 px-6 py-6 flex flex-col gap-5">
          <div className="flex items-center gap-4 border-b border-chromium/15 pb-4 mb-2">
            <button
              onClick={toggleLanguage}
              className="text-xs font-bold uppercase px-4 py-2 rounded-full bg-gunmetal-mid border border-chromium/15 text-chromium hover:text-titanium transition-colors"
            >
              {language === "en" ? "Switch to French" : "Passer en Anglais"}
            </button>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-full bg-gunmetal-mid border border-chromium/15 text-chromium hover:text-titanium transition-colors flex items-center gap-2"
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
          {[
            { label: t("nav.about"), href: "#about" },
            { label: t("nav.skills"), href: "#skills" },
            { label: t("nav.projects"), href: "#projects" },
            { label: t("nav.experience"), href: "#experience" },
          ]?.map((item) => (
            <a
              key={item?.label}
              href={item?.href}
              className="text-base font-medium text-chromium hover:text-titanium transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item?.label}
            </a>
          ))}
          <a
            href="#contact"
            className="cta-pill inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold mt-2"
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.getInTouch")}
          </a>
        </div>
      )}
    </header>
  );
}
