const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer les répertoires s'ils n'existent pas
const uploadDirs = {
  images: path.join(__dirname, '../uploads/images'),
  documents: path.join(__dirname, '../uploads/documents')
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuration pour les images
const storageImages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirs.images);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'item-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuration pour les documents
const storageDocuments = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirs.documents);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtres pour les images
const imageFileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format d\'image non autorisé. Utilisez JPG ou PNG.'), false);
  }
};

// Filtres pour les documents
const documentFileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Format de document non autorisé. Utilisez PDF, JPG ou PNG.'), false);
  }
};

// Instances de multer pour les images et documents séparément
const uploadImages = multer({
  storage: storageImages,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
});

const uploadDocuments = multer({
  storage: storageDocuments,
  fileFilter: documentFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB max
});

// Middleware combiné pour traiter images ET documents en une seule requête
const uploadCombined = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'photos') {
        cb(null, uploadDirs.images);
      } else if (file.fieldname === 'documents') {
        cb(null, uploadDirs.documents);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      if (file.fieldname === 'photos') {
        cb(null, 'item-' + uniqueSuffix + path.extname(file.originalname));
      } else {
        cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
      }
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'photos') {
      imageFileFilter(req, file, cb);
    } else if (file.fieldname === 'documents') {
      documentFileFilter(req, file, cb);
    } else {
      cb(new Error('Champ fichier non reconnu'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB max
});

module.exports = {
  uploadImages,
  uploadDocuments,
  uploadCombined,
  uploadDirs
};
