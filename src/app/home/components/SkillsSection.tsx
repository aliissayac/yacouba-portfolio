"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageProvider";
import { translateWithDeepL } from "@/utils/translation";
import type { Database } from "@/utils/supabase/database.types";

type Skill = Database["public"]["Tables"]["skills"]["Row"];
type ProjectTag = Database["public"]["Tables"]["project_tags"]["Row"];

interface SkillsSectionProps {
  data?: Skill[];
  tagsData?: ProjectTag[];
}

const DEFAULT_CATEGORIES = [
  { label: "Frontend", accent: "#3B82F6" },
  { label: "Backend", accent: "#60A5FA" },
  { label: "DevOps", accent: "#93C5FD" },
];

const DEFAULT_TOOLS = [
  "Git",
  "Figma",
  "Prisma",
  "Supabase",
  "Vercel",
  "Linear",
  "Jest",
  "Playwright",
  "Storybook",
  "NgRx",
  "tRPC",
  "Zod",
  "Nx",
  "NestJS",
];

export default function SkillsSection({ data, tagsData }: SkillsSectionProps) {
  const { t, language } = useLanguage();

  const [translatedData, setTranslatedData] = useState<Skill[] | undefined>(data);
  const [translatedTagsData, setTranslatedTagsData] = useState<ProjectTag[] | undefined>(tagsData);

  useEffect(() => {
    let isMounted = true;

    const translateData = async () => {
      if (language === 'fr') {
        if (isMounted) {
          setTranslatedData(data);
          setTranslatedTagsData(tagsData);
        }
        return;
      }

      try {
        const allTexts: string[] = [];
        
        // Data mappings
        const dataMap: any[] = [];
        if (data && data.length > 0) {
          data.forEach((skill) => {
            const indices: any = {};
            if (skill.category) { indices.category = allTexts.length; allTexts.push(skill.category); }
            if (skill.name) { indices.name = allTexts.length; allTexts.push(skill.name); }
            dataMap.push(indices);
          });
        }

        // Tags mapping
        const tagsMap: any[] = [];
        if (tagsData && tagsData.length > 0) {
          tagsData.forEach((tag) => {
            const indices: any = {};
            if (tag.name) { indices.name = allTexts.length; allTexts.push(tag.name); }
            tagsMap.push(indices);
          });
        }

        const transDict = allTexts.length > 0 ? await translateWithDeepL(allTexts, 'EN') : {};

        if (data && data.length > 0) {
          const transData = data.map((skill, i) => ({
            ...skill,
            category: skill.category ? transDict[dataMap[i].category.toString()] : skill.category,
            name: skill.name ? transDict[dataMap[i].name.toString()] : skill.name,
          }));
          if (isMounted) setTranslatedData(transData);
        }

        if (tagsData && tagsData.length > 0) {
          const transTags = tagsData.map((tag, i) => ({
            ...tag,
            name: tag.name ? transDict[tagsMap[i].name.toString()] : tag.name,
          }));
          if (isMounted) setTranslatedTagsData(transTags);
        }
      } catch (error) {
        console.error('Skills translation failed:', error);
        if (isMounted) {
          setTranslatedData(data);
          setTranslatedTagsData(tagsData);
        }
      }
    };

    translateData();

    return () => {
      isMounted = false;
    };
  }, [language, data, tagsData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Group skills by category using translated data
  const groupedSkills: Record<string, { name: string; level: number }[]> = {};
  if (translatedData && translatedData.length > 0) {
    translatedData.forEach((skill) => {
      const cat = skill.category;
      if (!groupedSkills[cat]) groupedSkills[cat] = [];
      groupedSkills[cat].push({
        name: skill.name,
        level: skill.proficiency ?? 0,
      });
    });
  }

  const categories = DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    skills: groupedSkills[cat.label] || [],
  })).filter((cat) => cat.skills.length > 0);

  // If no Supabase data, use defaults
  const tools =
    translatedTagsData && translatedTagsData.length > 0
      ? translatedTagsData.map((tag) => tag.name)
      : DEFAULT_TOOLS;

  // If no categories from Supabase, fall back to hardcoded defaults
  const displayCategories =
    categories.length > 0
      ? categories
      : [
        {
          label: "Frontend",
          accent: "#3B82F6",
          skills: [
            { name: "React / Next.js", level: 95 },
            { name: "TypeScript", level: 92 },
            { name: "Tailwind CSS", level: 90 },
            { name: "Vue.js", level: 75 },
          ],
        },
        {
          label: "Backend",
          accent: "#60A5FA",
          skills: [
            { name: "Node.js / Express", level: 90 },
            { name: "PostgreSQL", level: 85 },
            { name: "GraphQL", level: 80 },
            { name: "Redis", level: 72 },
          ],
        },
        {
          label: "DevOps & Cloud",
          accent: "#93C5FD",
          skills: [
            { name: "Docker / K8s", level: 78 },
            { name: "AWS (EC2, S3, Lambda)", level: 82 },
            { name: "CI/CD (GitHub Actions)", level: 88 },
            { name: "Terraform", level: 65 },
          ],
        },
      ];

  return (
    <section
      id="skills"
      className="py-24 lg:py-32 px-6 lg:px-10 max-w-7xl mx-auto"
    >
      <div className="mb-14 reveal">
        <span className="section-label block mb-2">{t("skills.frame")}</span>
        <h2 className="font-display text-3xl lg:text-4xl font-light text-titanium">
          {t("skills.titleP1")}
          <em className="text-signal-blue not-italic">{t("skills.titleP2")}</em>
        </h2>
      </div>

      {/* Bento grid — asymmetric */}
      <div className="grid lg:grid-cols-3 gap-5 reveal reveal-delay-1">
        {displayCategories.map((cat, idx) => (
          <div
            key={cat.label}
            className={`gallery-frame rounded-2xl p-7 bg-gunmetal-light ${idx === 0 ? "lg:row-span-1" : ""}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: cat.accent }}
              />
              <span className="section-label">{cat.label}</span>
            </div>
            <div className="space-y-4">
              {cat.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-titanium text-sm font-medium">
                      {skill.name}
                    </span>
                    <span className="text-chromium/60 text-xs font-mono">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-1 bg-gunmetal-mid rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${skill.level}%`,
                        background: `linear-gradient(90deg, ${cat.accent}80, ${cat.accent})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tools chip cloud - horizontal scroll */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .scroll-container {
          animation: scroll 20s linear infinite;
        }
        .scroll-container:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="mt-6 w-full overflow-hidden py-6 reveal reveal-delay-2">
        <div className="section-label mb-5">{t("skills.toolsLabel")}</div>
        <div className="flex scroll-container gap-3 w-max">
          {[...tools, ...tools].map((tool, idx) => (
            <span
              key={`${tool}-${idx}`}
              className="text-sm font-medium text-chromium/80 bg-gunmetal-light rounded-full px-5 py-2 whitespace-nowrap hover:text-titanium transition-all duration-200"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
