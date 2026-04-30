export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      hero_content: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          badge_text: string | null;
          badge_status: string | null;
          image_url: string | null;
          cv_url: string | null;
          stat_years: string | null;
          stat_projects: string | null;
          stat_clients: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          badge_text?: string | null;
          badge_status?: string | null;
          image_url?: string | null;
          cv_url?: string | null;
          stat_years?: string | null;
          stat_projects?: string | null;
          stat_clients?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          subtitle?: string | null;
          description?: string | null;
          badge_text?: string | null;
          badge_status?: string | null;
          image_url?: string | null;
          cv_url?: string | null;
          stat_years?: string | null;
          stat_projects?: string | null;
          stat_clients?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          proficiency: number | null;
          icon_url: string | null;
          sort_order: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string;
          proficiency?: number | null;
          icon_url?: string | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          proficiency?: number | null;
          icon_url?: string | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
      };
      project_tags: {
        Row: {
          id: string;
          name: string;
          sort_order: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          sort_order?: number | null;
          created_at?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string | null;
          content: string | null;
          image_url: string | null;
          repo_url: string | null;
          live_url: string | null;
          tech_stack: string[] | null;
          kpi_users: string | null;
          kpi_latency: string | null;
          kpi_uptime: string | null;
          sort_order: number | null;
          is_featured: boolean | null;
          role: string | null;
          year: string | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description?: string | null;
          content?: string | null;
          image_url?: string | null;
          repo_url?: string | null;
          live_url?: string | null;
          tech_stack?: string[] | null;
          kpi_users?: string | null;
          kpi_latency?: string | null;
          kpi_uptime?: string | null;
          sort_order?: number | null;
          is_featured?: boolean | null;
          role?: string | null;
          year?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          short_description?: string | null;
          content?: string | null;
          image_url?: string | null;
          repo_url?: string | null;
          live_url?: string | null;
          tech_stack?: string[] | null;
          kpi_users?: string | null;
          kpi_latency?: string | null;
          kpi_uptime?: string | null;
          sort_order?: number | null;
          is_featured?: boolean | null;
          role?: string | null;
          year?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      experience: {
        Row: {
          id: string;
          company: string;
          role: string;
          location: string | null;
          start_date: string;
          end_date: string | null;
          description: string | null;
          highlights: string[] | null;
          tech_stack: string[] | null;
          sort_order: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          company: string;
          role: string;
          location?: string | null;
          start_date: string;
          end_date?: string | null;
          description?: string | null;
          highlights?: string[] | null;
          tech_stack?: string[] | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          company?: string;
          role?: string;
          location?: string | null;
          start_date?: string;
          end_date?: string | null;
          description?: string | null;
          highlights?: string[] | null;
          tech_stack?: string[] | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
      };
    };
  };
};
