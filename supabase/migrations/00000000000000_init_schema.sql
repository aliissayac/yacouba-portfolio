-- =====================================================
-- Amplify Portfolio CMS — Initial Schema
-- Tables: hero_content, skills, projects, experience, project_tags
-- =====================================================

-- ---------- HERO CONTENT ----------
CREATE TABLE public.hero_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    badge_text TEXT,
    badge_status TEXT DEFAULT 'available',
    image_url TEXT,
    stat_years TEXT,
    stat_projects TEXT,
    stat_clients TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------- SKILLS ----------
CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,  -- 'Frontend', 'Backend', 'DevOps'
    proficiency INT DEFAULT 0,  -- 0-100
    icon_url TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------- PROJECT TAGS (tools/technologies cloud) ----------
CREATE TABLE public.project_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------- PROJECTS ----------
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    content TEXT,
    image_url TEXT,
    repo_url TEXT,
    live_url TEXT,
    tech_stack TEXT[],  -- e.g. ['Next.js', 'WebSockets', 'PostgreSQL']
    kpi_users TEXT,
    kpi_latency TEXT,
    kpi_uptime TEXT,
    sort_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------- EXPERIENCE ----------
CREATE TABLE public.experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    location TEXT,
    start_date TEXT NOT NULL,  -- e.g. '2023' or 'Jan 2023'
    end_date TEXT,             -- e.g. 'Present', '2023', null
    description TEXT,
    highlights TEXT[],
    tech_stack TEXT[],
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access to hero_content"
    ON public.hero_content FOR SELECT USING (true);

CREATE POLICY "Allow public read access to skills"
    ON public.skills FOR SELECT USING (true);

CREATE POLICY "Allow public read access to project_tags"
    ON public.project_tags FOR SELECT USING (true);

CREATE POLICY "Allow public read access to projects"
    ON public.projects FOR SELECT USING (true);

CREATE POLICY "Allow public read access to experience"
    ON public.experience FOR SELECT USING (true);

-- Admin (authenticated) full access
CREATE POLICY "Allow admin all access to hero_content"
    ON public.hero_content FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin all access to skills"
    ON public.skills FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin all access to project_tags"
    ON public.project_tags FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin all access to projects"
    ON public.projects FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin all access to experience"
    ON public.experience FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- Seed data (matching current frontend content)
-- =====================================================

INSERT INTO public.hero_content (title, subtitle, description, badge_text, badge_status, stat_years, stat_projects, stat_clients)
VALUES (
    'I Engineer Systems<br/>That Ship Fast.',
    'Full-Stack Engineer — Paris, FR',
    'Hi, I''m Alex Moreau. I build performant, scalable, and accessible web applications with modern tools. I focus on delivering end-to-end solutions that make an impact.',
    'Available for new opportunities',
    'available',
    '5+',
    '30+',
    '12+'
);

INSERT INTO public.skills (name, category, proficiency, sort_order) VALUES
    ('React / Next.js', 'Frontend', 95, 1),
    ('TypeScript', 'Frontend', 92, 2),
    ('Tailwind CSS', 'Frontend', 90, 3),
    ('Vue.js', 'Frontend', 75, 4),
    ('Node.js / Express', 'Backend', 90, 5),
    ('PostgreSQL', 'Backend', 85, 6),
    ('GraphQL', 'Backend', 80, 7),
    ('Redis', 'Backend', 72, 8),
    ('Docker / K8s', 'DevOps', 78, 9),
    ('AWS', 'DevOps', 82, 10),
    ('CI/CD', 'DevOps', 88, 11),
    ('Terraform', 'DevOps', 65, 12);

INSERT INTO public.project_tags (name, sort_order) VALUES
    ('Supabase', 1), ('Docker', 2), ('Redis', 3), ('AWS', 4),
    ('Python', 5), ('Go', 6), ('Figma', 7), ('Git', 8),
    ('Linux', 9), ('Nginx', 10);

INSERT INTO public.projects (title, slug, short_description, content, tech_stack, kpi_users, kpi_latency, kpi_uptime, repo_url, live_url, is_featured, sort_order) VALUES
    (
        'DevFlow',
        'devflow',
        'Real-time CI/CD pipeline dashboard for modern dev teams.',
        'A comprehensive CI/CD dashboard providing real-time pipeline monitoring, team analytics, and deployment management. Built for teams that ship fast and need visibility into every stage of their delivery pipeline.',
        ARRAY['Next.js', 'WebSockets', 'PostgreSQL'],
        '2.4K+ users',
        '<50ms',
        '99.9%',
        '#',
        '#',
        true,
        1
    ),
    (
        'Cartify',
        'cartify',
        'High-performance headless e-commerce platform.',
        'A modern headless e-commerce solution built with React and Node.js, featuring seamless Stripe integration, real-time inventory management, and an optimized checkout flow that converts.',
        ARRAY['React', 'Node.js', 'Stripe'],
        '10K+ users',
        '<100ms',
        '99.8%',
        '#',
        '#',
        true,
        2
    ),
    (
        'Synapse',
        'synapse',
        'AI-powered note-taking app with smart linking.',
        'An intelligent note-taking application leveraging AI to automatically link related concepts, generate summaries, and surface relevant context when you need it. Built with Supabase for real-time sync.',
        ARRAY['React', 'Supabase', 'OpenAI'],
        '1.2K+ users',
        '<75ms',
        '99.7%',
        '#',
        '#',
        true,
        3
    ),
    (
        'PulseAPI',
        'pulseapi',
        'Real-time API monitoring and observability service.',
        'A lightweight API monitoring service providing real-time latency tracking, error rate alerting, and uptime guarantees. Designed for teams that need constant visibility into their API health.',
        ARRAY['Node.js', 'Redis', 'Docker'],
        '500+ users',
        '<30ms',
        '99.95%',
        '#',
        '#',
        true,
        4
    );

INSERT INTO public.experience (company, role, location, start_date, end_date, description, highlights, tech_stack, sort_order) VALUES
    (
        'Vercel',
        'Senior Software Engineer',
        'Remote',
        '2023',
        'Present',
        'Leading the Edge Functions team, optimizing cold start times and developer experience for serverless deployments.',
        ARRAY['Improved cold start by 40%', 'Led migration to new runtime isolation model', 'Mentored 3 junior engineers'],
        ARRAY['Rust', 'TypeScript', 'Go'],
        1
    ),
    (
        'Stripe',
        'Software Engineer II',
        'Paris, FR',
        '2021',
        '2023',
        'Built and maintained payment processing microservices handling millions of transactions daily.',
        ARRAY['Reduced payment latency by 25%', 'Implemented real-time fraud detection pipeline', 'Led PCI-DSS compliance audit'],
        ARRAY['Ruby', 'Go', 'gRPC'],
        2
    ),
    (
        'Freelance',
        'Full-Stack Developer',
        'Remote',
        '2019',
        '2021',
        'Delivered 12+ projects for startups and SMEs, from MVP to production-ready applications.',
        ARRAY['Built headless CMS for media company', 'Shipped e-commerce platform processing €50K/mo', '100% client satisfaction rate'],
        ARRAY['React', 'Node.js', 'PostgreSQL'],
        3
    ),
    (
        'Doctolib',
        'Junior Frontend Engineer',
        'Paris, FR',
        '2018',
        '2019',
        'Contributed to the patient-facing booking flow used by millions of users across Europe.',
        ARRAY['Optimized booking funnel conversion by 15%', 'Migrated legacy jQuery components to React', 'Implemented accessibility standards (WCAG 2.1)'],
        ARRAY['React', 'Ruby on Rails', 'TypeScript'],
        4
    );

-- =====================================================
-- Updated_at trigger for hero_content
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hero_content_updated_at
    BEFORE UPDATE ON public.hero_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
