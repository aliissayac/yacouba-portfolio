"use client";
import React from "react";
import { useLanguage } from "@/context/LanguageProvider";
import type { Database } from "@/utils/supabase/database.types";

type HeroContent = Database["public"]["Tables"]["hero_content"]["Row"];

interface AboutSectionProps {
  cvUrl?: HeroContent["cv_url"];
}

export default function AboutSection({ cvUrl }: AboutSectionProps) {
  const { t } = useLanguage();
  return (
    <section
      id="about"
      className="py-24 lg:py-32 px-6 lg:px-10 max-w-7xl mx-auto"
    >
      <div className="flex items-start justify-between mb-14 reveal">
        <div>
          <span className="section-label block mb-2">{t("about.frame")}</span>
          <h2 className="font-display text-3xl lg:text-4xl font-light text-titanium">
            {t("about.titleP1")}
            <em className="text-signal-blue not-italic">
              {t("about.titleP2")}
            </em>
          </h2>
        </div>
      </div>
      <div className="gallery-frame rounded-2xl overflow-hidden reveal reveal-delay-1">
        <div className="grid lg:grid-cols-5">
          {/* 60% — Story */}
          <div className="lg:col-span-3 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-chromium/15">
            <div className="space-y-5 text-chromium text-sm leading-relaxed">
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
              <p>{t("about.p3")}</p>
            </div>

            {/* Values */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {t("about.values")?.map((v: any, index: number) => {
                const icons = ["⚡", "🧩", "🤝", "📐"];
                return (
                  <div
                    key={v?.label}
                    className="flex items-start gap-3 p-4 rounded-xl bg-gunmetal-mid/50 border border-chromium/10"
                  >
                    <span className="text-lg leading-none mt-0.5">
                      {icons[index]}
                    </span>
                    <div>
                      <div className="text-titanium font-semibold text-xs mb-0.5">
                        {v?.label}
                      </div>
                      <div className="text-chromium/60 text-xs">{v?.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 40% — Quick facts */}
          <div className="lg:col-span-2 bg-gunmetal-light p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <div className="section-label mb-6">{t("about.quickFacts")}</div>
              <div className="space-y-5">
                {t("about.facts")?.map((fact: any) => (
                  <div
                    key={fact?.label}
                    className="flex justify-between items-start border-b border-chromium/10 pb-4 last:border-0 last:pb-0"
                  >
                    <span className="section-label">{fact?.label}</span>
                    <span className="text-titanium text-sm font-medium text-right max-w-[55%]">
                      {fact?.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Download CV */}
            <div className="mt-8 pt-6 border-t border-chromium/15">
              <a
                href={cvUrl || "#"}
                target={cvUrl ? "_blank" : "_self"}
                rel={cvUrl ? "noopener noreferrer" : undefined}
                className={`cta-pill inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold w-full justify-center ${!cvUrl ? "pointer-events-none opacity-50" : ""}`}
              >
                {t("about.downloadCv")}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 2v7M4 7l3 3 3-3M2 11h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
