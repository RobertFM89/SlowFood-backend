// Ruta de ejemplo para manejar la carga de archivos en el backend
import { Router } from 'express';
import cloudinary from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { isAuthenticated } from '../middleware/jwt.middleware.js';

const router = Router();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    allowed_formats: ['jpg', 'png', 'gif'],
    folder: 'slowfood-recipes'
  }
});

const upload = multer({ storage });

// POST /upload - Subir una imagen
router.post('/upload', isAuthenticated, upload.single('imageUrl'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded!' });
  }
  
  res.json({ fileUrl: req.file.path });
});

export default router;