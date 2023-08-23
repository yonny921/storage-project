const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de Multer para la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ruta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const filename = Date.now() + extension;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Configuración de la ruta de carga de imágenes
app.post('/upload', upload.single('image'), (req, res) => {
  res.send('Imagen cargada exitosamente');
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Aplicación de carga de imágenes de Yonny</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="image" accept="image/*" required>
      <button type="submit">Cargar Imagen</button>
      <a href="/images">Ver imagenes</a>
    </form>
  `);
});

app.get('/images', (req, res) => {
  const imageFiles = fs.readdirSync('uploads/');
  const images = imageFiles.map(filename => `/uploads/${filename}`);
  
  const imageElements = images.map(image => `<img src="${image}" alt="Imagen">`).join('<br>');
  
  res.send(`
    <h1>Imágenes Cargadas</h1>
    ${imageElements}
    <br>
    <a href="/">Volver</a>
  `);
});

// Servir imágenes estáticas desde el directorio 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Aplicación funcionando en http://localhost:${port}`);
});
