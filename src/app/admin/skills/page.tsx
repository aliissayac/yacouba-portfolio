"use client";

import { useState, useEffect, FormEvent } from "react";
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

type Skill = Database["public"]["Tables"]["skills"]["Row"];
type ProjectTag = Database["public"]["Tables"]["project_tags"]["Row"];

const CATEGORIES = ["Frontend", "Backend", "DevOps"];

export default function SkillsEditorPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [tools, setTools] = useState<ProjectTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [newToolName, setNewToolName] = useState("");
  const supabase = createClient();

  const emptySkill = {
    name: "",
    category: "Frontend",
    proficiency: 80,
    icon_url: "",
    sort_order: 0,
  };
  const [formData, setFormData] = useState<typeof emptySkill>({
    ...emptySkill,
  });

  useEffect(() => {
    fetchSkills();
    fetchTools();
  }, [supabase]);

  async function fetchSkills() {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching skills:", error);
    } else {
      setSkills(data || []);
    }
    setLoading(false);
  }

  async function fetchTools() {
    const { data, error } = await supabase
      .from("project_tags")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching tools:", error);
    } else {
      setTools(data || []);
    }
  }

  async function handleAddTool() {
    if (!newToolName.trim()) return;

    const maxSortOrder = tools.reduce(
      (max, t) => Math.max(max, t.sort_order ?? 0),
      0,
    );

    try {
      const r1 = await adminInsert("project_tags", { name: newToolName.trim(), sort_order: maxSortOrder + 1 });
      if (!r1.success) throw new Error(r1.error);

      setMessage({ type: "success", text: "Outil ajouté !" });
      setNewToolName("");
      fetchTools();
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erreur lors de l'ajout.",
      });
    }
  }

  async function handleDeleteTool(id: string) {
    if (!confirm("Supprimer cet outil ?")) return;

    try {
      const r2 = await adminDelete("project_tags", id);
      if (!r2.success) throw new Error(r2.error);
      setMessage({ type: "success", text: "Outil supprimé." });
      fetchTools();
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Erreur lors de la suppression.",
      });
    }
  }

  async function handleSave() {
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name,
      category: formData.category,
      proficiency: formData.proficiency,
      icon_url: formData.icon_url || null,
      sort_order: formData.sort_order,
    };

    try {
      if (editingId) {
        const r3 = await adminUpdate("skills", editingId, payload);
        if (!r3.success) throw new Error(r3.error);
      } else {
        const r3 = await adminInsert("skills", payload);
        if (!r3.success) throw new Error(r3.error);
      }

      setMessage({
        type: "success",
        text: editingId ? "Compétence mise à jour !" : "Compétence ajoutée !",
      });
      resetForm();
      fetchSkills();
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Erreur lors de la sauvegarde.",
      });
    }
  }

  function handleEdit(skill: Skill) {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency ?? 80,
      icon_url: skill.icon_url || "",
      sort_order: skill.sort_order ?? 0,
    });
    setNewSkill(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette compétence ?")) return;

    try {
      const r4 = await adminDelete("skills", id);
      if (!r4.success) throw new Error(r4.error);
      setMessage({ type: "success", text: "Compétence supprimée." });
      fetchSkills();
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
    setNewSkill(false);
    setFormData(emptySkill);
  }

  function startNew() {
    setNewSkill(true);
    setEditingId(null);
    setFormData(emptySkill);
  }

  if (loading) {
    return <div className="text-[var(--chromium)]">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--titanium)] font-[Fraunces]">
          Éditeur Skills
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
      {(newSkill || editingId) && (
        <div className="mb-6 p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
                Nom
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
                placeholder="React, Node.js..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--chromium)] mb-1">
              Niveau : {formData.proficiency}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.proficiency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  proficiency: parseInt(e.target.value),
                })
              }
              className="w-full accent-[var(--signal-blue)]"
            />
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

      {/* Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-[var(--chromium)]">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nom</th>
              <th className="text-left px-4 py-3 font-medium">Catégorie</th>
              <th className="text-left px-4 py-3 font-medium">Niveau</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {skills.map((skill) => (
              <tr key={skill.id} className="hover:bg-white/5 transition">
                <td className="px-4 py-3 text-[var(--titanium)]">
                  {skill.name}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-[var(--chromium)]">
                    {skill.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-white/10 max-w-[120px]">
                      <div
                        className="h-full rounded-full bg-[var(--signal-blue)]"
                        style={{ width: `${skill.proficiency ?? 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--chromium)]">
                      {skill.proficiency}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition text-[var(--chromium)]"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 transition text-red-400"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tools Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[var(--titanium)] font-[Fraunces] mb-6">
          Outils
        </h2>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newToolName}
            onChange={(e) => setNewToolName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTool();
              }
            }}
            placeholder="Nom de l'outil (Git, Figma, Prisma...)"
            className="form-input flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
          />
          <button
            onClick={handleAddTool}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--signal-blue)] text-white text-sm font-medium hover:bg-blue-600 transition"
          >
            <PlusIcon className="w-4 h-4" />
            Ajouter
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tools.map((tool) => (
            <span
              key={tool.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-white/10 text-[var(--chromium)]"
            >
              {tool.name}
              <button
                onClick={() => handleDeleteTool(tool.id)}
                className="p-0.5 rounded-full hover:bg-red-500/20 hover:text-red-400 transition"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {tools.length === 0 && (
          <p className="text-sm text-[var(--chromium)]">Aucun outil ajouté.</p>
        )}
      </div>
    </div>
  );
}
