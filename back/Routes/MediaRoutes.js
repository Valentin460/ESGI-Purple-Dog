const express = require('express');
const router = express.Router();
const { uploadImages, uploadDocuments } = require('../middleware/upload');
const MediaController = require('../controllers/MediaController');

// Routes pour les images
router.post('/:id/upload-images', uploadImages.array('photos', 20), MediaController.uploadImages);
router.get('/:id/images', MediaController.getImages);
router.delete('/:id/images/:imageId', MediaController.deleteImage);

// Routes pour les documents
router.post('/:id/upload-documents', uploadDocuments.array('documents', 10), MediaController.uploadDocuments);
router.get('/:id/documents', MediaController.getDocuments);
router.delete('/:id/documents/:documentId', MediaController.deleteDocument);

module.exports = router;
