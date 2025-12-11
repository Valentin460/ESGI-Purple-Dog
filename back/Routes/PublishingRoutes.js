const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PublishingController = require('../controllers/PublishingController');

// Créer les répertoires d'upload
const uploadDirs = {
  images: path.join(__dirname, '../uploads/images'),
  documents: path.join(__dirname, '../uploads/documents')
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middleware multer personnalisé pour gérer tous les types de fichiers
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Déterminer le répertoire selon le fieldname
      if (file.fieldname === 'photos') {
        cb(null, uploadDirs.images);
      } else if (file.fieldname === 'documents') {
        cb(null, uploadDirs.documents);
      } else {
        cb(null, uploadDirs.images); // Par défaut
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'file-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'photos') {
      // Vérifier format image
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Format d\'image non autorisé. Utilisez JPG ou PNG.'));
      }
    } else if (file.fieldname === 'documents') {
      // Vérifier format document
      const allowedMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png'];
      const ext = path.extname(file.originalname).toLowerCase();
      
      if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Format de document non autorisé.'));
      }
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB max
});

// Route pour publier un item avec ses images et documents
// POST /items/publish
router.post(
  '/publish',
  upload.fields([
    { name: 'photos', maxCount: 20 },
    { name: 'documents', maxCount: 10 }
  ]),
  PublishingController.publishItem
);

// Route pour récupérer les détails d'un item publié
// GET /items/:id/details
router.get('/:id/details', PublishingController.getItemDetails);

module.exports = router;
