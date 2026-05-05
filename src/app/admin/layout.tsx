import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  BriefcaseIcon,
  PhotoIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: HomeIcon },
  { href: '/admin/hero', label: 'Hero', icon: PhotoIcon },
  { href: '/admin/skills', label: 'Skills', icon: WrenchScrewdriverIcon },
  { href: '/admin/projects', label: 'Projects', icon: BriefcaseIcon },
  { href: '/admin/experience', label: 'Experience', icon: BriefcaseIcon },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin-login');
  }

  return (
    <div className="min-h-screen bg-[var(--gunmetal)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--titanium)]/5 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-[var(--titanium)] font-[Fraunces]">
            Portfolio CMS
          </h1>
          <p className="text-xs text-[var(--chromium)] mt-1">{user.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--chromium)] hover:text-[var(--titanium)] hover:bg-white/5 transition"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/admin/logout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition w-full"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Déconnexion
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
