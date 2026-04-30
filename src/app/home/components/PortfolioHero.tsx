"use client";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageProvider";
import type { Database } from "@/utils/supabase/database.types";
import { translateWithDeepL } from "@/utils/translation";

type HeroContent = Database["public"]["Tables"]["hero_content"]["Row"];

interface PortfolioHeroProps {
  data?: HeroContent | null;
}

export default function PortfolioHero({ data }: PortfolioHeroProps) {
  const { t, language, useDeepLTranslate } = useLanguage();
  const [translatedData, setTranslatedData] = useState<HeroContent | null>(null);

  useEffect(() => {
    const translateDynamicData = async () => {
      if (language === 'en' && useDeepLTranslate && data) {
        const textsToTranslate = [
          data.title || "",
          data.subtitle || "",
          data.description || "",
          data.badge_text || ""
        ];

        const translated = await translateWithDeepL(textsToTranslate, 'en', 'fr');

        setTranslatedData({
          ...data,
          title: translated['0'] || data.title,
          subtitle: translated['1'] || data.subtitle,
          description: translated['2'] || data.description,
          badge_text: translated['3'] || data.badge_text,
        });
      } else {
        setTranslatedData(null);
      }
    };

    translateDynamicData();
  }, [language, useDeepLTranslate, data]);

  const activeData = translatedData || data;

  // Use Supabase data if available, fallback to i18n
  const title = activeData?.title || t("hero.hi");
  const subtitle = activeData?.subtitle || t("hero.role");
  const description = activeData?.description || t("hero.description");
  const badgeText = activeData?.badge_text || t("hero.available");
  const badgeStatus = activeData?.badge_status || "available";
  const statYears = data?.stat_years || "5+";
  const statProjects = data?.stat_projects || "30+";
  const statClients = data?.stat_clients || "12+";
  const imageUrl = data?.image_url;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Atmospheric gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 70% 40%, rgba(59,130,246,0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 20% 70%, rgba(168,173,181,0.04) 0%, transparent 60%)",
        }}
      />
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#A8ADB5 1px, transparent 1px), linear-gradient(90deg, #A8ADB5 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center min-h-[85vh]">
          {/* 60% — Text content */}
          <div className="lg:col-span-3 flex flex-col justify-center order-2 lg:order-1">
            {/* Eyebrow */}
            <div className="phase-in flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2 bg-signal-blue/10 border border-signal-blue/20 rounded-full px-4 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-signal-blue animate-pulse" />
                <span className="text-signal-blue text-xs font-semibold tracking-wide">
                  {t("hero.available")}
                </span>
              </div>
            </div>

            {/* Main headline */}
            <h1 className="phase-in-delay font-display font-light text-titanium leading-[0.92] mb-8 tracking-tight">
              <span className="block text-5xl lg:text-6xl xl:text-7xl">
                {t("hero.hi")}
              </span>
              <span className="block text-5xl lg:text-6xl xl:text-7xl text-signal-blue">
                Ali Issa Yacouba
              </span>
              <span className="block text-4xl lg:text-5xl xl:text-6xl text-chromium mt-2">
                {title}
              </span>
            </h1>

            {/* Sub */}
            <p className="phase-in-late text-chromium text-base lg:text-lg leading-relaxed max-w-lg mb-10">
              {description}
            </p>

            {/* CTAs */}
            <div className="phase-in-late flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="cta-pill inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold"
              >
                {t("hero.viewWork")}
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
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-chromium hover:text-titanium transition-colors duration-200 group"
              >
                {t("hero.getInTouch")}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="group-hover:translate-x-0.5 transition-transform"
                >
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            {/* Stats bar */}
            <div className="phase-in-late mt-12 pt-8 border-t border-chromium/10 flex flex-wrap items-center gap-6">
              {[
                { value: statYears, label: t("hero.stats.years") },
                { value: statProjects, label: t("hero.stats.projects") },
                { value: statClients, label: t("hero.stats.clients") },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <span className="font-display text-xl font-light text-titanium">
                    {stat.value}
                  </span>
                  <span className="text-chromium/60 text-xs">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 40% — Photo */}
          <div className="lg:col-span-2 phase-in-delay order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 70%)",
                  transform: "scale(1.15)",
                }}
              />
              {/* Photo frame */}
              <div className="relative w-72 h-80 lg:w-80 lg:h-96 rounded-2xl overflow-hidden border border-chromium/20 bg-gunmetal-mid">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gunmetal-mid to-gunmetal-light">
                    <div className="w-24 h-24 rounded-full bg-signal-blue/15 border-2 border-signal-blue/30 flex items-center justify-center">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                      >
                        <circle
                          cx="20"
                          cy="15"
                          r="7"
                          stroke="#3B82F6"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14"
                          stroke="#3B82F6"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-chromium/50 text-xs font-medium tracking-wider uppercase">
                      {t("hero.photoHere")}
                    </span>
                  </div>
                )}

                {/* Decorative corner accent */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-signal-blue animate-pulse" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-gunmetal/80 backdrop-blur-sm border border-chromium/15 rounded-full px-3 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-signal-blue animate-pulse" />
                  <span className="text-titanium text-xs font-semibold">
                    {t("hero.openToWork")}
                  </span>
                </div>
              </div>

              {/* Floating tech badge */}
              <div className="absolute -bottom-4 -right-4 bg-gunmetal-mid border border-chromium/20 rounded-xl px-4 py-3 shadow-xl">
                <div className="section-label mb-1">{t("hero.stack")}</div>
                <div className="text-titanium text-sm font-semibold">
                  Django · Node
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="section-label">{t("hero.scroll")}</span>
        <div className="w-px h-8 bg-chromium/40 relative overflow-hidden">
          <div
            className="absolute top-0 w-full bg-signal-blue"
            style={{
              height: "40%",
              animation: "scrollDot 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  );
}
