import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import { minioStoragePut, generateUniqueKey, isMinioConfigured } from "./storage-minio";
import { storagePut } from "./storage";

const router = Router();

// Configuration multer pour gérer les uploads en mémoire
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
  fileFilter: (req, file, cb) => {
    // Vérifier le type MIME (images + audio)
    const allowedMimes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Audio
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-m4a', 'audio/m4a'
    ];
    const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|svg|mp3|wav|ogg|m4a)$/i;
    
    if (allowedMimes.includes(file.mimetype) || allowedExtensions.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Utilisez JPG, PNG, GIF, WEBP, SVG, MP3, WAV, OGG ou M4A.'));
    }
  },
});

// Endpoint POST /api/upload-file
router.post("/upload-file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    // Déterminer le dossier selon le type de fichier
    const isImage = req.file.mimetype.startsWith('image/');
    const folder = isImage ? "products/images" : "radio/episodes";

    // Vérifier si MinIO est configuré, sinon utiliser Manus S3
    const useMinIO = isMinioConfigured();
    let url: string;
    let fileKey: string;

    if (useMinIO) {
      // Upload vers MinIO
      fileKey = generateUniqueKey(req.file.originalname, folder);
      const result = await minioStoragePut(
        fileKey,
        req.file.buffer,
        req.file.mimetype
      );
      url = result.url;
    } else {
      // Fallback vers Manus S3
      fileKey = generateUniqueKey(req.file.originalname, folder);
      const result = await storagePut(
        fileKey,
        req.file.buffer,
        req.file.mimetype
      );
      url = result.url;
    }

    res.json({
      success: true,
      url,
      fileKey,
      filename: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      storage: useMinIO ? 'minio' : 'manus-s3'
    });
  } catch (error: any) {
    console.error("Erreur upload fichier:", error);
    res.status(500).json({
      error: "Erreur lors de l'upload du fichier",
      details: error.message,
    });
  }
});

export default router;
