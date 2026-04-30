import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioHero from "./components/PortfolioHero";
import AboutSection from "./components/AboutSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import ExperienceSection from "./components/ExperienceSection";
import ContactSection from "./components/ContactSection";
import ScrollReveal from "./components/ScrollReveal";
import GlobalStyles from "./components/GlobalStyles";

async function fetchAllData() {
  const supabase = await createClient();

  const [heroRes, skillsRes, projectsRes, experienceRes, tagsRes] =
    await Promise.all([
      supabase.from("hero_content").select("*").limit(1).single(),
      supabase
        .from("skills")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("experience")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("project_tags")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

  return {
    hero: heroRes.error ? null : heroRes.data,
    skills: skillsRes.error ? [] : skillsRes.data || [],
    projects: projectsRes.error ? [] : projectsRes.data || [],
    experience: experienceRes.error ? [] : experienceRes.data || [],
    tags: tagsRes.error ? [] : tagsRes.data || [],
  };
}

export default async function HomePage() {
  const data = await fetchAllData();

  return (
    <div className="min-h-screen bg-gunmetal text-titanium">
      <Header />
      <ScrollReveal />
      {/* ── HERO ── */}
      <PortfolioHero data={data.hero} />
      {/* ── ABOUT ── */}
      <AboutSection cvUrl={data.hero?.cv_url ?? undefined} />
      {/* ── SKILLS ── */}
      <SkillsSection data={data.skills} tagsData={data.tags} />
      {/* ── PROJECTS ── */}
      <ProjectsSection data={data.projects} />
      {/* ── EXPERIENCE ── */}
      <ExperienceSection data={data.experience} />
      {/* ── CONTACT ── */}
      <ContactSection />
      <Footer />
      <GlobalStyles />
    </div>
  );
}
