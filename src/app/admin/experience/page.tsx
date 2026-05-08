'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Database } from '@/utils/supabase/database.types';
import { adminInsert, adminUpdate, adminDelete } from '../_actions';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

type Experience = Database['public']['Tables']['experience']['Row'];

export default function ExperienceEditorPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newExperience, setNewExperience] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createClient();

  const emptyExperience = {
    company: '',
    role: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    highlights: [] as string[],
    tech_stack: [] as string[],
    sort_order: 0,
  };
  const [formData, setFormData] = useState<typeof emptyExperience>({ ...emptyExperience });
  const [highlightInput, setHighlightInput] = useState('');
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, [supabase]);

  async function fetchExperiences() {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching experiences:', error);
    } else {
      setExperiences(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!formData.company.trim() || !formData.role.trim()) return;

    const payload = {
      company: formData.company,
      role: formData.role,
      location: formData.location || null,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
      description: formData.description || null,
      highlights: formData.highlights,
      tech_stack: formData.tech_stack,
      sort_order: formData.sort_order,
    };

    try {
      if (editingId) {
        await adminUpdate('experience', editingId, payload);
      } else {
        await adminInsert('experience', payload);
      }

      setMessage({ type: 'success', text: editingId ? 'Expérience mise à jour !' : 'Expérience ajoutée !' });
      resetForm();
      fetchExperiences();
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.' });
    }
  }

  function handleEdit(exp: Experience) {
    setEditingId(exp.id);
    setFormData({
      company: exp.company,
      role: exp.role,
      location: exp.location || '',
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      description: exp.description || '',
      highlights: exp.highlights || [],
      tech_stack: exp.tech_stack || [],
      sort_order: exp.sort_order ?? 0,
    });
    setNewExperience(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette expérience ?")) return;

    try {
      await adminDelete('experience', id);
      setMessage({ type: 'success', text: 'Expérience supprimée.' });
      fetchExperiences();
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erreur lors de la suppression.' });
    }
  }

  function resetForm() {
    setEditingId(null);
    setNewExperience(false);
    setFormData(emptyExperience);
    setHighlightInput('');
    setTechInput('');
  }

  function startNew() {
    setNewExperience(true);
    setEditingId(null);
    setFormData(emptyExperience);
  }

  function addHighlight() {
    if (highlightInput.trim()) {
      setFormData({ ...formData, highlights: [...(formData.highlights || []), highlightInput.trim()] });
      setHighlightInput('');
    }
  }

  function removeHighlight(idx: number) {
    setFormData({ ...formData, highlights: formData.highlights?.filter((_, i) => i !== idx) || [] });
  }

  function addTech() {
    if (techInput.trim()) {
      setFormData({ ...formData, tech_stack: [...(formData.tech_stack || []), techInput.trim()] });
      setTechInput('');
    }
  }

  function removeTech(idx: number) {
    setFormData({ ...formData, tech_stack: formData.tech_stack?.filter((_, i) => i !== idx) || [] });
  }

  if (loading) {
    return <div className="text-[var(--chromium)]">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--titanium)] font-[Fraunces]">
          Éditeur Experience
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
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      {(newExperience || editingId) && (
        <div className="mb-6 p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">Entreprise</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">Poste</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">Localisation</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">Début</label>
              <input
                type="text"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
                placeholder="2023 ou Jan 2023"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--chromium)] mb-1">Fin</label>
              <input
                type="text"
                value={formData.end_date || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
                placeholder="Present, 2023, ou vide"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--chromium)] mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="form-input w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50 resize-none"
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium text-[var(--chromium)] mb-1">Faits marquants</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addHighlight();
                  }
                }}
                placeholder="Amélioration de 40%..."
                className="form-input flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50"
              />
              <button
                type="button"
                onClick={addHighlight}
                className="px-4 py-2 rounded-lg bg-white/10 text-[var(--chromium)] text-sm hover:bg-white/20 transition"
              >
                Ajouter
              </button>
            </div>
            <ul className="space-y-1">
              {formData.highlights?.map((h, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-[var(--titanium)]">
                  <span className="text-[var(--signal-blue)]">•</span>
                  <span className="flex-1">{h}</span>
                  <button onClick={() => removeHighlight(idx)} className="text-red-400 hover:text-red-300">×</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-[var(--chromium)] mb-1">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTech();
                  }
                }}
                placeholder="Rust, TypeScript..."
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
              {formData.tech_stack?.map((tech, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[var(--signal-blue)]/20 text-blue-300"
                >
                  {tech}
                  <button onClick={() => removeTech(idx)} className="hover:text-white ml-1">
                    ×
                  </button>
                </span>
              ))}
            </div>
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

      {/* Timeline */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[var(--titanium)]">{exp.company}</h3>
                <span className="text-sm text-[var(--chromium)]">— {exp.role}</span>
              </div>
              <p className="text-sm text-[var(--chromium)]">
                {exp.start_date} → {exp.end_date || 'Present'} · {exp.location}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleEdit(exp)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition text-[var(--chromium)]"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
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
