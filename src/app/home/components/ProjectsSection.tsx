"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageProvider";
import { translateWithDeepL } from "@/utils/translation";
import type { Database } from "@/utils/supabase/database.types";

type Project = Database["public"]["Tables"]["projects"]["Row"];

interface ProjectsSectionProps {
  data?: Project[];
}

const DEFAULT_PROJECTS = [
  {
    id: "1",
    title: "DevFlow — CI/CD Dashboard",
    slug: "devflow",
    short_description:
      "A real-time pipeline monitoring dashboard for engineering teams. Built with Next.js, WebSockets, and PostgreSQL. Reduced mean time to detect failures by 60%.",
    content: null,
    image_url: null,
    repo_url: "#",
    live_url: "#",
    tech_stack: ["Next.js", "TypeScript", "WebSockets", "PostgreSQL"],
    kpi_users: null,
    kpi_latency: null,
    kpi_uptime: null,
    sort_order: 1,
    is_featured: true,
    role: "Lead Developer",
    year: "2024",
    status: "Production",
    created_at: null,
    updated_at: null,
  },
  {
    id: "2",
    title: "Cartify — E-commerce Platform",
    slug: "cartify",
    short_description:
      "Headless commerce solution for a fashion brand. Integrated Stripe, built a custom CMS, and optimized Core Web Vitals to achieve a 98 Lighthouse score.",
    content: null,
    image_url: null,
    repo_url: "#",
    live_url: "#",
    tech_stack: ["React", "Node.js", "Stripe", "GraphQL"],
    kpi_users: null,
    kpi_latency: null,
    kpi_uptime: null,
    sort_order: 2,
    is_featured: true,
    role: "Full Stack Developer",
    year: "2024",
    status: "Production",
    created_at: null,
    updated_at: null,
  },
  {
    id: "3",
    title: "Synapse — AI Note-taking App",
    slug: "synapse",
    short_description:
      "An AI-powered knowledge management tool with semantic search and auto-tagging. Used by 2,000+ researchers and writers. Built with React, Supabase, and OpenAI.",
    content: null,
    image_url: null,
    repo_url: "#",
    live_url: "#",
    tech_stack: ["React", "Supabase", "OpenAI", "Tailwind"],
    kpi_users: null,
    kpi_latency: null,
    kpi_uptime: null,
    sort_order: 3,
    is_featured: true,
    role: "Frontend Developer",
    year: "2023",
    status: "Production",
    created_at: null,
    updated_at: null,
  },
  {
    id: "4",
    title: "PulseAPI — Monitoring Service",
    slug: "pulseapi",
    short_description:
      "Uptime and performance monitoring API with alerting, SLA tracking, and a public status page builder. Handles 50M+ checks per month.",
    content: null,
    image_url: null,
    repo_url: "#",
    live_url: "#",
    tech_stack: ["Node.js", "Redis", "Docker", "AWS"],
    kpi_users: null,
    kpi_latency: null,
    kpi_uptime: null,
    sort_order: 4,
    is_featured: true,
    role: "Backend Developer",
    year: "2023",
    status: "Production",
    created_at: null,
    updated_at: null,
  },
];

export default function ProjectsSection({ data }: ProjectsSectionProps) {
  const { t, language, useDeepLTranslate } = useLanguage();
  const [active, setActive] = useState(0);
  const [translatedData, setTranslatedData] = useState<Project[] | null>(null);

  useEffect(() => {
    const translateDynamicData = async () => {
      const sourceData = data && data.length > 0 ? data : DEFAULT_PROJECTS;
      if (language === 'en' && useDeepLTranslate && sourceData) {
        const textsToTranslate: string[] = [];
        sourceData.forEach(p => {
          textsToTranslate.push(p.title || "");
          textsToTranslate.push(p.short_description || "");
          textsToTranslate.push(p.role || "");
          textsToTranslate.push(p.status || "");
          textsToTranslate.push(p.kpi_latency || "");
        });
        
        const translated = await translateWithDeepL(textsToTranslate, 'en', 'fr');
        
        const newTranslatedData = sourceData.map((p, i) => {
          const baseIdx = i * 5;
          return {
            ...p,
            title: translated[baseIdx.toString()] || p.title,
            short_description: translated[(baseIdx + 1).toString()] || p.short_description,
            role: translated[(baseIdx + 2).toString()] || p.role,
            status: translated[(baseIdx + 3).toString()] || p.status,
            kpi_latency: translated[(baseIdx + 4).toString()] || p.kpi_latency,
          };
        });
        
        setTranslatedData(newTranslatedData);
      } else {
        setTranslatedData(null);
      }
    };
    
    translateDynamicData();
  }, [language, useDeepLTranslate, data]);

  const projects = translatedData || (data && data.length > 0 ? data : DEFAULT_PROJECTS);

  const translatedItems = t("projects.items");
  const displayProjects = projects.map((p, index) => ({
    ...p,
    title: p.title || translatedItems[index]?.title || "",
    desc: p.short_description || translatedItems[index]?.desc || "",
    role: p.role || translatedItems[index]?.role || "",
    status: p.status || translatedItems[index]?.status || "",
    year: p.year || "",
    kpiValue: p.kpi_users || p.kpi_latency || p.kpi_uptime || "",
    kpiLabel: p.kpi_latency || "",
    imageAlt: p.title,
  }));

  const project = displayProjects[active];

  return (
    <section
      id="projects"
      className="py-24 lg:py-32 px-6 lg:px-10 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-14 reveal">
        <div>
          <span className="section-label block mb-2">
            {t("projects.frame")}
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-light text-titanium">
            {t("projects.titleP1")}
            <em className="text-signal-blue not-italic">
              {t("projects.titleP2")}
            </em>
          </h2>
        </div>
        <div className="hidden md:flex gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-8 h-1 rounded-full transition-all duration-300 ${i === active
                ? "bg-signal-blue w-12"
                : "bg-chromium/30 hover:bg-chromium/60"
                }`}
              aria-label={`Project ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 60/40 Asymmetric Frame */}
      <div className="gallery-frame rounded-2xl overflow-hidden reveal reveal-delay-1">
        <div className="grid lg:grid-cols-5">
          {/* 60% — Project detail */}
          <div className="lg:col-span-3 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-chromium/15">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="section-label">{project.year || ""}</span>
                  <span className="text-chromium/30">·</span>
                  <span className="section-label">{project.role}</span>
                </div>
                <h3 className="font-display text-xl lg:text-2xl font-light text-titanium leading-snug">
                  {project.title}
                </h3>
              </div>
              {project.status && (
                <div className="flex items-center gap-1.5 bg-signal-blue/10 border border-signal-blue/20 rounded-full px-3 py-1 flex-shrink-0 ml-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-signal-blue animate-pulse" />
                  <span className="text-signal-blue text-xs font-semibold">
                    {project.status}
                  </span>
                </div>
              )}
            </div>

            <p className="text-chromium text-sm leading-relaxed mb-6 max-w-lg">
              {project.desc}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tech_stack?.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-chromium/80 bg-gunmetal-mid border border-chromium/15 rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-chromium/15">
              {[
                { label: t("projects.year"), value: project.year || "" },
                { label: t("projects.role"), value: project.role },
                { label: t("projects.status"), value: project.status },
              ]
                .filter((m) => m.value)
                .map((m) => (
                  <div key={m.label}>
                    <div className="section-label mb-1">{m.label}</div>
                    <div className="text-titanium font-semibold text-sm">
                      {m.value}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 40% — KPI + link */}
          <div className="lg:col-span-2 bg-gunmetal-light p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <div className="section-label mb-6">
                {t("projects.keyResult")}
              </div>
              {project.kpiValue && (
                <>
                  <div className="font-display text-6xl lg:text-7xl font-light text-signal-blue leading-none mb-2">
                    {project.kpiValue}
                  </div>
                  <div className="text-titanium font-medium text-lg mb-2">
                    {project.kpiLabel}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2 10l4-4 2 2 4-5"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-signal-blue text-sm font-medium">
                      {t("projects.measurableImpact")}
                    </span>
                  </div>
                </>
              )}
            </div>

            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="mt-6 rounded-xl overflow-hidden border border-chromium/15 w-full aspect-video object-cover"
              />
            ) : (
              <div className="mt-6 rounded-xl overflow-hidden border border-chromium/15 bg-gunmetal-mid aspect-video flex items-center justify-center">
                <div className="text-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    className="mx-auto mb-2 opacity-30"
                  >
                    <rect
                      x="2"
                      y="6"
                      width="28"
                      height="20"
                      rx="2"
                      stroke="#A8ADB5"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="10"
                      cy="14"
                      r="3"
                      stroke="#A8ADB5"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M2 22l7-5 5 4 5-6 11 7"
                      stroke="#A8ADB5"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-chromium/40 text-xs">
                    {project.imageAlt}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-chromium/15 flex flex-col gap-3">
              <a
                href={project.live_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-pill inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold w-full justify-center"
              >
                {t("projects.viewProject")}
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
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-pill inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold w-full justify-center bg-transparent border border-chromium/20 text-chromium hover:text-titanium hover:bg-gunmetal-mid"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  {t("projects.viewRepo") || "View Code"}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project switcher — mobile */}
      <div className="flex gap-2 mt-6 md:hidden">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${i === active ? "bg-signal-blue" : "bg-chromium/30"
              }`}
            aria-label={`Project ${i + 1}`}
          />
        ))}
      </div>

      {/* All projects slider */}
      <div className="mt-10 reveal reveal-delay-2">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {displayProjects.map((p, i) => (
            <button
              key={p.id || i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-56 text-left p-4 rounded-xl border transition-all duration-200 ${i === active
                ? "border-signal-blue bg-signal-blue/8"
                : "border-chromium/15 bg-gunmetal-light hover:border-chromium/30"
                }`}
            >
              <div className="section-label mb-2">{p.year || ""}</div>
              <div className="text-titanium font-semibold text-sm leading-snug mb-2">
                {p.title}
              </div>
              <div className="text-chromium/60 text-xs line-clamp-2">
                {p.desc}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
