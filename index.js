const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// 1. Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Asegúrate de crear esta carpeta
    },
    filename: (req, file, cb) => {
        // Renombramos para evitar duplicados: timestamp + nombre original
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// 2. Filtro para aceptar solo documentos
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.ms-excel', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan documentos.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
});

// 3. Ruta para subir el archivo
app.post('/upload', upload.single('archivo'), (req, res) => {
    try {
        res.send({ message: 'Archivo subido con éxito', file: req.file });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// 4. Servir archivos estáticos (para poder ver/descargar los documentos)
app.use('/files', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});