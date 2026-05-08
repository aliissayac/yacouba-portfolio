"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/utils/supabase/database.types";
import { adminInsert, adminUpdate, adminDelete } from "../_actions";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type Project = Database["public"]["Tables"]["projects"]["Row"];

type SupabaseBrowserClient = ReturnType<typeof createClient>;

async function getUploadAccessToken(supabase: SupabaseBrowserClient) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    return session.access_token;
  }

  const {
    data: { session: refreshedSession },
  } = await supabase.auth.refreshSession();

  if (refreshedSession?.access_token) {
    return refreshedSession.access_token;
  }

  const storedToken = sessionStorage.getItem("portfolio_admin_access_token");

  if (storedToken) {
    return storedToken;
  }

  throw new Error(
    "Session admin introuvable. Déconnectez-vous puis reconnectez-vous."
  );
}

async function uploadAdminAsset(
  file: File,
  folder: "projects",
  accessToken?: string
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    credentials: "same-origin",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    body: formData,
  });
  const result = (await response.json()) as {
    publicUrl?: string;
    error?: string;
  };

  if (!response.ok || !result.publicUrl) {
    throw new Error(result.error || "Erreur lors de l'upload.");
  }

  return result.publicUrl;
}

export default function ProjectsEditorPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const supabase = createClient();

  const emptyProject = {
    title: "",
    slug: "",
    short_description: "",
    content: "",
    image_url: "",
    repo_url: "",
    live_url: "",
    tech_stack: [] as string[],
    kpi_users: "",
    kpi_latency: "",
    kpi_uptime: "",
    sort_order: 0,
    is_featured: true,
    role: "",
    year: "",
    status: "",
  };
  const [formData, setFormData] = useState<typeof emptyProject>({
    ...emptyProject,
  });
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    fetchProjects();
  }, [supabase]);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!formData.title.trim()) return;

    const slug =
      formData.slug ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const payload = {
      title: formData.title,
      slug,
      short_description: formData.short_description || null,
      content: formData.content || null,
      image_url: formData.image_url || null,
      repo_url: formData.repo_url || null,
      live_url: formData.live_url || null,
      tech_stack: formData.tech_stack,
      kpi_users: formData.kpi_users || null,
      kpi_latency: formData.kpi_latency || null,
      kpi_uptime: formData.kpi_uptime || null,
      sort_order: formData.sort_order,
      is_featured: formData.is_featured,
      role: formData.role || null,
      year: formData.year || null,
      status: formData.status || null,
    };

    try {
      if (editingId) {
        await adminUpdate("projects", editingId, payload);
      } else {
        await adminInsert("projects", payload);
      }

      setMessage({
        type: "success",
        text: editingId ? "Projet mis à jour !" : "Projet ajouté !",
      });
      resetForm();
      fetchProjects();
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Erreur lors de la sauvegarde.",
      });
    }
  }

  function handleEdit(project: Project) {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      slug: project.slug,
      short_description: project.short_description || "",
      content: project.content || "",
      image_url: project.image_url || "",
      repo_url: project.repo_url || "",
      live_url: project.live_url || "",
      tech_stack: project.tech_stack || [],
      kpi_users: project.kpi_users || "",
      kpi_latency: project.kpi_latency || "",
      kpi_uptime: project.kpi_uptime || "",
      sort_order: project.sort_order ?? 0,
      is_featured: project.is_featured ?? true,
      role: project.role || "",
      year: project.year || "",
      status: project.status || "",
    });
    setNewProject(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce projet ?")) return;

    try {
      await adminDelete("projects", id);
      setMessage({ type: "success", text: "Projet supprimé." });
      fetchProjects();
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Erreur lors de la suppression.",
      });
    }
  }

  function resetForm() {
    setEditingId(null);
    setNewProject(false);
    setFormData(emptyProject);
    setTechInput("");
  }

  function startNew() {
    setNewProject(true);
    setEditingId(null);
    setFormData(emptyProject);
  }

  function addTech() {
    if (techInput.trim() && !formData.tech_stack?.includes(techInput.trim())) {
      setFormData({
        ...formData,
        tech_stack: [...(formData.tech_stack || []), techInput.trim()],
      });
      setTechInput("");
    }
  }

  function removeTech(tech: string) {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack?.filter((t) => t !== tech) || [],
    });
  }

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const accessToken = await getUploadAccessToken(supabase);
      const publicUrl = await uploadAdminAsset(
        file,
        "projects",
        accessToken
      );
      setFormData({ ...formData, image_url: publicUrl });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erreur lors de l'upload.",
      });
    }
  };

  if (loading) {
    return <div className="text-[var(--chromium)]">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--titanium)] font-[Fraunces]">
          Éditeur Projects
        </h1>
        <button
          onClick={startNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--signal-blue)] text-white text-sm font-medium hover:bg-blue-600 transition"
        >
          <PlusIcon className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      {(newProject || editingId) && (
        <div className="mb-6 p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
                Titre
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
                placeholder="auto-généré si vide"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
              Description courte
            </label>
            <input
              type="text"
              value={formData.short_description || ""}
              onChange={(e) =>
                setFormData({ ...formData, short_description: e.target.value })
              }
              className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
              Description complète
            </label>
            <textarea
              value={formData.content || ""}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={3}
              className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-[var(--chromium)]"
            />
            <input
              type="text"
              value={formData.image_url || ""}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              placeholder="Ou URL de l'image"
              className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50 mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
                Repo URL
              </label>
              <input
                type="url"
                value={formData.repo_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, repo_url: e.target.value })
                }
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
                Live URL
              </label>
              <input
                type="url"
                value={formData.live_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, live_url: e.target.value })
                }
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
              />
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div>
            <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
              Tech Stack
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTech();
                  }
                }}
                placeholder="Next.js, React..."
                className="form-input flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
              />
              <button
                type="button"
                onClick={addTech}
                className="px-4 py-2 rounded-lg bg-white/10 text-[var(--chromium)] text-sm hover:bg-white/20 transition"
              >
                Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tech_stack?.map((tech) => (
                <span
                  key={tech}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[var(--signal-blue)]/20 text-blue-300"
                >
                  {tech}
                  <button
                    onClick={() => removeTech(tech)}
                    className="hover:text-white ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
                KPI Users
              </label>
              <input
                type="text"
                value={formData.kpi_users || ""}
                onChange={(e) =>
                  setFormData({ ...formData, kpi_users: e.target.value })
                }
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
                placeholder="2.4K+ users"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
                KPI Latency
              </label>
              <input
                type="text"
                value={formData.kpi_latency || ""}
                onChange={(e) =>
                  setFormData({ ...formData, kpi_latency: e.target.value })
                }
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
                placeholder="<50ms"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
                KPI Uptime
              </label>
              <input
                type="text"
                value={formData.kpi_uptime || ""}
                onChange={(e) =>
                  setFormData({ ...formData, kpi_uptime: e.target.value })
                }
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
                placeholder="99.9%"
              />
            </div>
          </div>

          {/* Role, Year, Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
                Rôle
              </label>
              <input
                type="text"
                value={formData.role || ""}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
                placeholder="Lead Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
                Année
              </label>
              <input
                type="text"
                value={formData.year || ""}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
                placeholder="2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
                Statut
              </label>
              <input
                type="text"
                value={formData.status || ""}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
                placeholder="Production"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured ?? true}
              onChange={(e) =>
                setFormData({ ...formData, is_featured: e.target.checked })
              }
              className="accent-[var(--signal-blue)]"
            />
            <label
              htmlFor="is_featured"
              className="text-sm text-[var(--chromium)]"
            >
              Projet mis en avant
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
            >
              <CheckIcon className="w-4 h-4" />
              Sauvegarder
            </button>
            <button
              onClick={resetForm}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/10 text-[var(--chromium)] text-sm font-medium hover:bg-white/20 transition"
            >
              <XMarkIcon className="w-4 h-4" />
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            {project.image_url && (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-16 h-10 object-cover rounded-lg"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[var(--titanium)]">
                {project.title}
              </h3>
              <p className="text-sm text-[var(--chromium)] truncate">
                {project.short_description}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleEdit(project)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition text-[var(--chromium)]"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 transition text-red-400"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
