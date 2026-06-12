import "server-only";
import { v2 as cloudinary } from "cloudinary";

// Configuration depuis l'environnement (jamais exposée au client).
// Deux options supportées : la variable unique CLOUDINARY_URL
// (cloudinary://API_KEY:API_SECRET@CLOUD_NAME) lue automatiquement par le SDK,
// ou les 3 variables séparées.
const hasIndividual = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);
if (hasIndividual) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  // Lit CLOUDINARY_URL automatiquement si présent.
  cloudinary.config({ secure: true });
}

export function isCloudinaryConfigured(): boolean {
  return hasIndividual || Boolean(process.env.CLOUDINARY_URL);
}

// Whitelist MIME (SVG exclu : exécution JS possible depuis un host public).
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

type UploadOpts = { folder: string; publicId?: string };

/**
 * Téléverse une image (File) vers Cloudinary et renvoie son URL sécurisée.
 * Upload signé côté serveur (clé/secret en env). Si `publicId` est fourni,
 * l'image est écrasée (utile pour un avatar unique par utilisateur).
 */
export async function uploadImageToCloudinary(
  file: File,
  opts: UploadOpts
): Promise<{ url?: string; error?: string }> {
  if (!isCloudinaryConfigured()) {
    return { error: "Cloudinary non configuré (voir CLOUDINARY_* dans .env.local)." };
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return { error: "Format non supporté : PNG, JPG ou WebP uniquement." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "L'image ne doit pas dépasser 5 Mo." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
    const res = await cloudinary.uploader.upload(dataUri, {
      folder: opts.folder,
      public_id: opts.publicId,
      overwrite: Boolean(opts.publicId),
      invalidate: Boolean(opts.publicId),
      resource_type: "image",
    });
    return { url: res.secure_url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Échec de l'upload de l'image." };
  }
}
