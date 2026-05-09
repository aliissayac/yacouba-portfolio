import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BUCKET = "portfolio-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PDF_SIZE = 10 * 1024 * 1024;
const ALLOWED_FOLDERS = new Set(["hero", "projects", "cv"]);

function getAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin storage is not configured.");
  }

  return createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Verify the bearer token using the admin client (avoids unreliable
// cookie-based session reads in serverless API routes).
async function getAuthenticatedUser(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) return null;

  try {
    const admin = getAdminSupabaseClient();
    const { data: { user } } = await admin.auth.getUser(token);
    return user;
  } catch {
    return null;
  }
}

function getSafeFileName(file: File, folder: string) {
  const originalName = file.name.toLowerCase();
  const extension = folder === "cv" ? "pdf" : originalName.split(".").pop();

  if (!extension || !/^[a-z0-9]+$/.test(extension)) {
    throw new Error("Type de fichier non valide.");
  }

  return `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
}

function validateFile(file: File, folder: string) {
  if (folder === "cv") {
    if (file.type !== "application/pdf") {
      throw new Error("Veuillez sélectionner un fichier PDF.");
    }

    if (file.size > MAX_PDF_SIZE) {
      throw new Error("CV trop grand (max 10MB).");
    }

    return;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Veuillez sélectionner une image.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image trop grande (max 5MB).");
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
    }

    if (typeof folder !== "string" || !ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: "Dossier non valide." }, { status: 400 });
    }

    validateFile(file, folder);

    const filePath = getSafeFileName(file, folder);
    const adminSupabase = getAdminSupabaseClient();

    const { error: uploadError } = await adminSupabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    const {
      data: { publicUrl },
    } = adminSupabase.storage.from(BUCKET).getPublicUrl(filePath);

    return NextResponse.json({ publicUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur lors de l'upload.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
