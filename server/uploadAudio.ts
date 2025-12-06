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
    // Vérifier le type MIME
    const allowedMimes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-m4a', 'audio/m4a'];
    const allowedExtensions = /\.(mp3|wav|ogg|m4a)$/i;
    
    if (allowedMimes.includes(file.mimetype) || allowedExtensions.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Utilisez MP3, WAV, OGG ou M4A.'));
    }
  },
});

// Endpoint POST /api/upload-audio
router.post("/upload-audio", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    // Vérifier si MinIO est configuré, sinon utiliser Manus S3
    const useMinIO = isMinioConfigured();
    let url: string;
    let fileKey: string;

    if (useMinIO) {
      // Upload vers MinIO
      fileKey = generateUniqueKey(req.file.originalname, "radio/episodes");
      const result = await minioStoragePut(
        fileKey,
        req.file.buffer,
        req.file.mimetype
      );
      url = result.url;
    } else {
      // Fallback vers Manus S3
      const randomSuffix = crypto.randomBytes(8).toString('hex');
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${randomSuffix}.${fileExtension}`;
      fileKey = `radio/episodes/${fileName}`;
      const result = await storagePut(
        fileKey,
        req.file.buffer,
        req.file.mimetype
      );
      url = result.url;
    }

    // Retourner l'URL S3 et les métadonnées
    res.json({
      success: true,
      url,
      key: fileKey,
      size: req.file.size,
      mimeType: req.file.mimetype,
      originalName: req.file.originalname,
    });
  } catch (error) {
    console.error("Erreur upload audio:", error);
    res.status(500).json({
      error: "Erreur lors de l'upload du fichier audio",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
});

export default router;
