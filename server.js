const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const UPLOADS_DIR = './uploads';

// Создаем директорию для хранения файлов, если она отсутствует
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Настройка хранения файлов через multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Настройка middlewares
app.use(express.static('public'));
app.use(express.json());

// API для загрузки файла
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'Файл успешно загружен!', file: req.file });
});

// API для получения списка файлов
app.get('/files', (req, res) => {
    fs.readdir(UPLOADS_DIR, (err, files) => {
        if (err) return res.status(500).json({ error: 'Ошибка чтения директории' });
        res.json(files);
    });
});

// API для скачивания файла
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(UPLOADS_DIR, req.params.filename);
    res.download(filePath, (err) => {
        if (err) res.status(404).json({ error: 'Файл не найден' });
    });
});

// API для удаления файла
app.delete('/delete/:filename', (req, res) => {
    const filePath = path.join(UPLOADS_DIR, req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) return res.status(404).json({ error: 'Файл не найден' });
        res.json({ message: 'Файл успешно удален' });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
