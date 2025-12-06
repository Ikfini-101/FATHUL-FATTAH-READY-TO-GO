/**
 * MinIO Storage Helper
 * Compatible S3 API pour stockage autonome sur VPS
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

// Configuration MinIO depuis variables d'environnement
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || "http://localhost:9000";
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "minioadmin";
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || "minioadmin";
const MINIO_BUCKET = process.env.MINIO_BUCKET || "fathul-fattah";
const MINIO_REGION = process.env.MINIO_REGION || "us-east-1";
const MINIO_USE_SSL = process.env.MINIO_USE_SSL === "true";

// Créer client S3 configuré pour MinIO
const s3Client = new S3Client({
  endpoint: MINIO_ENDPOINT,
  region: MINIO_REGION,
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // Nécessaire pour MinIO
  tls: MINIO_USE_SSL,
});

/**
 * Upload un fichier vers MinIO
 * @param relKey - Chemin relatif du fichier (ex: "radio/episodes/file.mp3")
 * @param data - Données du fichier (Buffer, Uint8Array ou string)
 * @param contentType - Type MIME du fichier
 * @returns Object avec key et url du fichier
 */
export async function minioStoragePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);

  // Convertir string en Buffer si nécessaire
  const buffer = typeof data === "string" ? Buffer.from(data) : data;

  const command = new PutObjectCommand({
    Bucket: MINIO_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  try {
    await s3Client.send(command);

    // Construire l'URL publique du fichier
    const url = buildPublicUrl(key);

    return { key, url };
  } catch (error) {
    console.error("MinIO upload error:", error);
    throw new Error(
      `MinIO upload failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Récupère une URL signée pour télécharger un fichier
 * @param relKey - Chemin relatif du fichier
 * @param expiresIn - Durée de validité en secondes (défaut: 1 heure)
 * @returns Object avec key et url signée
 */
export async function minioStorageGet(
  relKey: string,
  expiresIn = 3600
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);

  const command = new GetObjectCommand({
    Bucket: MINIO_BUCKET,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return { key, url };
  } catch (error) {
    console.error("MinIO get error:", error);
    throw new Error(
      `MinIO get failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Génère un nom de fichier unique avec suffixe aléatoire
 * @param originalName - Nom original du fichier
 * @param prefix - Préfixe du chemin (ex: "radio/episodes")
 * @returns Chemin complet avec nom unique
 */
export function generateUniqueKey(originalName: string, prefix = ""): string {
  const randomSuffix = crypto.randomBytes(8).toString("hex");
  const timestamp = Date.now();
  const extension = originalName.split(".").pop();
  const fileName = `${timestamp}-${randomSuffix}.${extension}`;

  return prefix ? `${prefix}/${fileName}` : fileName;
}

/**
 * Normalise une clé en supprimant les slashes initiaux
 */
function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

/**
 * Construit l'URL publique d'un fichier MinIO
 */
function buildPublicUrl(key: string): string {
  // Si MinIO est configuré avec un domaine public, utiliser celui-ci
  const publicEndpoint = process.env.MINIO_PUBLIC_ENDPOINT || MINIO_ENDPOINT;
  const protocol = MINIO_USE_SSL ? "https" : "http";
  
  // Format: http://minio.example.com/bucket-name/file-path
  return `${publicEndpoint}/${MINIO_BUCKET}/${key}`;
}

/**
 * Vérifie si MinIO est correctement configuré
 */
export function isMinioConfigured(): boolean {
  return !!(
    process.env.MINIO_ENDPOINT &&
    process.env.MINIO_ACCESS_KEY &&
    process.env.MINIO_SECRET_KEY
  );
}

/**
 * Retourne les informations de configuration MinIO (pour debug)
 */
export function getMinioConfig() {
  return {
    endpoint: MINIO_ENDPOINT,
    bucket: MINIO_BUCKET,
    region: MINIO_REGION,
    useSSL: MINIO_USE_SSL,
    configured: isMinioConfigured(),
  };
}
