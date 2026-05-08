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

async function getVerifiedAdminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Non autorisé.");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Configuration serveur manquante.");

  return createSupabaseAdminClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function adminInsert(table: string, data: AdminData) {
  if (!ALLOWED_TABLES.has(table)) throw new Error("Table non autorisée.");
  const admin = await getVerifiedAdminClient();
  const { error } = await admin.from(table).insert([data]);
  if (error) throw new Error(error.message);
}

export async function adminUpdate(table: string, id: string, data: AdminData) {
  if (!ALLOWED_TABLES.has(table)) throw new Error("Table non autorisée.");
  const admin = await getVerifiedAdminClient();
  const { error } = await admin.from(table).update(data).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminDelete(table: string, id: string) {
  if (!ALLOWED_TABLES.has(table)) throw new Error("Table non autorisée.");
  const admin = await getVerifiedAdminClient();
  const { error } = await admin.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
