import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

async function getContentCount() {
  const supabase = await createClient();

  const [skills, projects, experience] = await Promise.all([
    supabase.from('skills').select('count').single(),
    supabase.from('projects').select('count').single(),
    supabase.from('experience').select('count').single(),
  ]);

  return {
    skills: skills.data?.count ?? 0,
    projects: projects.data?.count ?? 0,
    experience: experience.data?.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const counts = await getContentCount();

  const sections = [
    {
      title: 'Hero',
      description: 'Modifier la section héro de la page d\'accueil',
      href: '/admin/hero',
      count: '1 section',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      title: 'Skills',
      description: 'Gérer les compétences et technologies',
      href: '/admin/skills',
      count: `${counts.skills} compétences`,
      color: 'bg-green-500/10 text-green-400 border-green-500/20',
    },
    {
      title: 'Projects',
      description: 'Modifier les projets du portfolio',
      href: '/admin/projects',
      count: `${counts.projects} projets`,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
    {
      title: 'Experience',
      description: 'Gérer le parcours professionnel',
      href: '/admin/experience',
      count: `${counts.experience} expériences`,
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--titanium)] font-[Fraunces]">
          Dashboard
        </h1>
        <p className="text-[var(--chromium)] mt-1">
          Bienvenue dans le panneau d&apos;administration de votre portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={`p-6 rounded-xl border ${section.color} hover:opacity-80 transition`}
          >
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            <p className="text-sm opacity-80 mb-4">{section.description}</p>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/10">
              {section.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
