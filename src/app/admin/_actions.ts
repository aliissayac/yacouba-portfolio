"use server";

import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

const ALLOWED_TABLES = new Set([
  "hero_content",
  "skills",
  "project_tags",
  "projects",
  "experience",
]);

type AdminData = Record<string, string | number | boolean | null | string[]>;
type ActionResult = { success: true } | { success: false; error: string };

async function getVerifiedAdminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Non autorisé. Reconnectez-vous.");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquante. Ajoutez-la dans les variables d'environnement Vercel."
    );

  return createSupabaseAdminClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function adminInsert(
  table: string,
  data: AdminData
): Promise<ActionResult> {
  try {
    if (!ALLOWED_TABLES.has(table))
      return { success: false, error: "Table non autorisée." };
    const admin = await getVerifiedAdminClient();
    const { error } = await admin.from(table).insert([data]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur inconnue.",
    };
  }
}

export async function adminUpdate(
  table: string,
  id: string,
  data: AdminData
): Promise<ActionResult> {
  try {
    if (!ALLOWED_TABLES.has(table))
      return { success: false, error: "Table non autorisée." };
    const admin = await getVerifiedAdminClient();
    const { error } = await admin.from(table).update(data).eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur inconnue.",
    };
  }
}

export async function adminDelete(
  table: string,
  id: string
): Promise<ActionResult> {
  try {
    if (!ALLOWED_TABLES.has(table))
      return { success: false, error: "Table non autorisée." };
    const admin = await getVerifiedAdminClient();
    const { error } = await admin.from(table).delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur inconnue.",
    };
  }
}
