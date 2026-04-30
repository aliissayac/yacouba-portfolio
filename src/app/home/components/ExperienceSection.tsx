'use client';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageProvider';
import { translateWithDeepL } from '@/utils/translation';
import type { Database } from '@/utils/supabase/database.types';

type Experience = Database['public']['Tables']['experience']['Row'];

interface ExperienceSectionProps {
  data?: Experience[];
}

const DEFAULT_EXPERIENCE: Experience[] = [
  {
    id: '1', company: 'Vercel', role: 'Senior Software Engineer', location: 'Remote',
    start_date: '2023', end_date: 'Present',
    description: 'Leading the Edge Functions team, optimizing cold start times and developer experience for serverless deployments.',
    highlights: ['Improved cold start by 40%', 'Led migration to new runtime isolation model', 'Mentored 3 junior engineers'],
    tech_stack: ['Rust', 'TypeScript', 'Go'],
    sort_order: 1, created_at: null,
  },
  {
    id: '2', company: 'Stripe', role: 'Software Engineer II', location: 'Paris, FR',
    start_date: '2021', end_date: '2023',
    description: 'Built and maintained payment processing microservices handling millions of transactions daily.',
    highlights: ['Reduced payment latency by 25%', 'Implemented real-time fraud detection pipeline', 'Led PCI-DSS compliance audit'],
    tech_stack: ['Ruby', 'Go', 'gRPC'],
    sort_order: 2, created_at: null,
  },
  {
    id: '3', company: 'Freelance', role: 'Full-Stack Developer', location: 'Remote',
    start_date: '2019', end_date: '2021',
    description: 'Delivered 12+ projects for startups and SMEs, from MVP to production-ready applications.',
    highlights: ['Built headless CMS for media company', 'Shipped e-commerce platform processing €50K/mo', '100% client satisfaction rate'],
    tech_stack: ['React', 'Node.js', 'PostgreSQL'],
    sort_order: 3, created_at: null,
  },
  {
    id: '4', company: 'Doctolib', role: 'Junior Frontend Engineer', location: 'Paris, FR',
    start_date: '2018', end_date: '2019',
    description: 'Contributed to the patient-facing booking flow used by millions of users across Europe.',
    highlights: ['Optimized booking funnel conversion by 15%', 'Migrated legacy jQuery components to React', 'Implemented accessibility standards (WCAG 2.1)'],
    tech_stack: ['React', 'Ruby on Rails', 'TypeScript'],
    sort_order: 4, created_at: null,
  },
];

export default function ExperienceSection({ data }: ExperienceSectionProps) {
  const { t, language } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);

  const rawExperiences = (data && data.length > 0) ? data : DEFAULT_EXPERIENCE;
  const [translatedExperiences, setTranslatedExperiences] = useState<Experience[]>(rawExperiences);

  useEffect(() => {
    let isMounted = true;

    const translateData = async () => {
      if (language === 'fr') {
        if (isMounted) setTranslatedExperiences(rawExperiences);
        return;
      }

      try {
        const allTexts: string[] = [];
        const map: any[] = []; // stores indices

        rawExperiences.forEach((exp) => {
          const indices: any = {};
          if (exp.company) { indices.company = allTexts.length; allTexts.push(exp.company); }
          if (exp.role) { indices.role = allTexts.length; allTexts.push(exp.role); }
          if (exp.description) { indices.description = allTexts.length; allTexts.push(exp.description); }
          if (exp.location) { indices.location = allTexts.length; allTexts.push(exp.location); }
          if (exp.start_date) { indices.start_date = allTexts.length; allTexts.push(exp.start_date); }
          if (exp.end_date) { indices.end_date = allTexts.length; allTexts.push(exp.end_date); }
          if (exp.highlights && exp.highlights.length > 0) {
            indices.highlights = [];
            exp.highlights.forEach((h) => {
              indices.highlights.push(allTexts.length);
              allTexts.push(h);
            });
          }
          map.push(indices);
        });

        const transDict = allTexts.length > 0 ? await translateWithDeepL(allTexts, 'EN') : {};

        const translated = rawExperiences.map((exp, i) => {
          const mappedHighlights = exp.highlights && map[i].highlights
            ? map[i].highlights.map((idx: number) => transDict[idx.toString()])
            : exp.highlights;

          return {
            ...exp,
            company: exp.company ? transDict[map[i].company.toString()] : exp.company,
            role: exp.role ? transDict[map[i].role.toString()] : exp.role,
            description: exp.description ? transDict[map[i].description.toString()] : exp.description,
            location: exp.location ? transDict[map[i].location.toString()] : exp.location,
            start_date: exp.start_date ? transDict[map[i].start_date.toString()] : exp.start_date,
            end_date: exp.end_date ? transDict[map[i].end_date.toString()] : exp.end_date,
            highlights: mappedHighlights,
          };
        });

        if (isMounted) setTranslatedExperiences(translated);
      } catch (error) {
        console.error('Experience translation failed:', error);
        if (isMounted) setTranslatedExperiences(rawExperiences);
      }
    };

    translateData();

    return () => {
      isMounted = false;
    };
  }, [language, data]); // eslint-disable-line react-hooks/exhaustive-deps

  const experiences = translatedExperiences;
  const active = experiences[activeIdx];
  if (!active) return null;

  const translatedExps = t('experience.items');

  return (
    <section id="experience" className="py-24 lg:py-32 px-6 lg:px-10 max-w-7xl mx-auto">
      <div className="mb-14 reveal">
        <span className="section-label block mb-2">{t('experience.frame')}</span>
        <h2 className="font-display text-3xl lg:text-4xl font-light text-titanium">
          {t('experience.titleP1')}
          <em className="text-signal-blue not-italic">{t('experience.titleP2')}</em>
        </h2>
      </div>

      <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
        {/* Left column — roadmap selector */}
        <div className="lg:col-span-2 space-y-2 reveal">
          {experiences.map((exp, idx) => (
            <button
              key={exp.id}
              onClick={() => setActiveIdx(idx)}
              className={`contact-sheet-item w-full text-left p-5 rounded-xl border transition-all duration-200 ${
                idx === activeIdx
                  ? 'border-signal-blue/40 bg-signal-blue/8'
                  : 'border-chromium/15 bg-gunmetal-light hover:border-chromium/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-colors ${
                    idx === activeIdx
                      ? 'border-signal-blue bg-signal-blue'
                      : 'border-chromium/40 bg-transparent'
                  }`}
                />
                <div>
                  <div className="text-titanium font-semibold text-sm">{exp.company}</div>
                  <div className="text-chromium/60 text-xs">
                    {exp.start_date} → {exp.end_date || 'Present'}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Right column — selected experience highlight */}
        <div className="lg:col-span-3 reveal reveal-delay-1">
          <div className="gallery-frame rounded-2xl p-8 lg:p-10 bg-gunmetal-light">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-signal-blue/15 border border-signal-blue/25 flex items-center justify-center flex-shrink-0">
                <span className="text-signal-blue text-xl font-bold">{active.company.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-light text-titanium leading-tight">
                  {active.role}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-signal-blue text-sm font-medium">{active.company}</span>
                  <span className="text-chromium/30">·</span>
                  <span className="text-chromium/60 text-sm">
                    {active.start_date} → {active.end_date || 'Present'}
                  </span>
                </div>
                {active.location && (
                  <span className="text-chromium/50 text-xs mt-0.5 block">{active.location}</span>
                )}
              </div>
            </div>

            {/* Description */}
            {active.description && (
              <p className="text-chromium text-sm leading-relaxed mb-6">{active.description}</p>
            )}

            {/* Highlights */}
            {active.highlights && active.highlights.length > 0 && (
              <>
                <div className="section-label mb-3">{t('experience.highlights')}</div>
                <ul className="space-y-2 mb-6">
                  {active.highlights.map((hl: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-chromium text-sm leading-relaxed">
                      <svg
                        width="14" height="14" viewBox="0 0 14 14" fill="none"
                        className="mt-1 flex-shrink-0"
                      >
                        <circle cx="7" cy="7" r="6" stroke="#3B82F6" strokeWidth="1.5" />
                        <path d="M4 7l2 2 4-4" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {hl}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Tech stack */}
            {active.tech_stack && active.tech_stack.length > 0 && (
              <>
                <div className="section-label mb-3">{t('experience.stack')}</div>
                <div className="flex flex-wrap gap-2">
                  {active.tech_stack.map((tech: string) => (
                    <span
                      key={tech}
                      className="text-sm font-medium text-chromium/80 bg-gunmetal-mid border border-chromium/15 rounded-full px-3 py-1.5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
