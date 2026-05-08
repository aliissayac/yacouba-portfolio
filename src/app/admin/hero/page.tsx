"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/utils/supabase/database.types";
import { adminUpdate } from "../_actions";

type HeroContent = Database["public"]["Tables"]["hero_content"]["Row"];

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
  folder: "hero" | "cv",
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

export default function HeroEditorPage() {
  const [content, setContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchHero() {
      const { data, error } = await supabase
        .from("hero_content")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching hero:", error);
      }
      setContent(data);
      setLoading(false);
    }
    fetchHero();
  }, [supabase]);

  const handleChange = (field: string, value: string | null) => {
    setContent((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setSaving(true);
    setMessage(null);

    try {
      await adminUpdate("hero_content", content.id, {
        title: content.title,
        subtitle: content.subtitle || null,
        description: content.description || null,
        badge_text: content.badge_text || null,
        badge_status: content.badge_status || null,
        stat_years: content.stat_years || null,
        stat_projects: content.stat_projects || null,
        stat_clients: content.stat_clients || null,
        image_url: content.image_url || null,
        cv_url: content.cv_url || null,
      });

      setMessage({
        type: "success",
        text: "Section Hero mise à jour avec succès !",
      });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Erreur lors de la sauvegarde.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image trop grande (max 5MB)" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const accessToken = await getUploadAccessToken(supabase);
      const publicUrl = await uploadAdminAsset(
        file,
        "hero",
        accessToken
      );

      if (!content) return;

      await adminUpdate("hero_content", content.id, { image_url: publicUrl });

      setContent((prev) => (prev ? { ...prev, image_url: publicUrl } : null));
      setMessage({
        type: "success",
        text: "Image uploadée et sauvegardée avec succès !",
      });
    } catch (err: unknown) {
      console.error("Full error:", err);
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erreur lors de l'upload.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCVUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("pdf")) {
      setMessage({
        type: "error",
        text: "Veuillez sélectionner un fichier PDF",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "CV trop grand (max 10MB)" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const accessToken = await getUploadAccessToken(supabase);
      const publicUrl = await uploadAdminAsset(
        file,
        "cv",
        accessToken
      );

      if (!content) return;

      await adminUpdate("hero_content", content.id, { cv_url: publicUrl });

      setContent((prev) => (prev ? { ...prev, cv_url: publicUrl } : null));
      setMessage({
        type: "success",
        text: "CV téléversé et sauvegardé avec succès !",
      });
    } catch (err: unknown) {
      console.error("Full error:", err);
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erreur lors de l'upload.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-[var(--chromium)]">Chargement...</div>;
  }

  if (!content) {
    return (
      <div className="text-[var(--chromium)]">
        <p>
          Aucun contenu Hero trouvé. Le contenu sera créé automatiquement après
          la migration Supabase.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--titanium)] font-[Fraunces] mb-6">
        Éditeur Hero
      </h1>

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

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
            Titre (HTML autorisé)
          </label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
            Sous-titre
          </label>
          <input
            type="text"
            value={content.subtitle || ""}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
            Description
          </label>
          <textarea
            value={content.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
              Texte du badge
            </label>
            <input
              type="text"
              value={content.badge_text || ""}
              onChange={(e) => handleChange("badge_text", e.target.value)}
              className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
              Statut du badge
            </label>
            <input
              type="text"
              value={content.badge_status || ""}
              onChange={(e) => handleChange("badge_status", e.target.value)}
              className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
              Stat : Années
            </label>
            <input
              type="text"
              value={content.stat_years || ""}
              onChange={(e) => handleChange("stat_years", e.target.value)}
              className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
              Stat : Projets
            </label>
            <input
              type="text"
              value={content.stat_projects || ""}
              onChange={(e) => handleChange("stat_projects", e.target.value)}
              className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
              Stat : Clients
            </label>
            <input
              type="text"
              value={content.stat_clients || ""}
              onChange={(e) => handleChange("stat_clients", e.target.value)}
              className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
            Image du Hero
          </label>
          <div className="flex items-center gap-4">
            {content.image_url && (
              <img
                src={content.image_url}
                alt="Hero preview"
                className="w-20 h-20 object-cover rounded-lg border border-white/10"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-[var(--chromium)]"
            />
          </div>
          <input
            type="text"
            value={content.image_url || ""}
            onChange={(e) => handleChange("image_url", e.target.value)}
            placeholder="Ou entrer une URL d'image"
            className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50 mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
            CV (PDF)
          </label>
          <div className="flex items-center gap-4">
            {content.cv_url && (
              <a
                href={content.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--signal-blue)] underline"
              >
                Voir le CV actuel
              </a>
            )}
            <input
              type="file"
              accept="application/pdf"
              onChange={handleCVUpload}
              className="text-sm text-[var(--chromium)]"
            />
          </div>
          <input
            type="text"
            value={content.cv_url || ""}
            onChange={(e) => handleChange("cv_url", e.target.value)}
            placeholder="Ou entrer une URL de CV"
            className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50 mt-2"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-[var(--signal-blue)] text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50 transition disabled:opacity-50"
        >
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </form>
    </div>
  );
}
