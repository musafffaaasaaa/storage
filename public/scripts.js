const fileList = document.getElementById('fileList');
const uploadForm = document.getElementById('uploadForm');

// Получение списка файлов
async function fetchFiles() {
    const response = await fetch('/files');
    const files = await response.json();
    fileList.innerHTML = '';

    files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            ${file}
            <button onclick="downloadFile('${file}')">Скачать</button>
            <button onclick="deleteFile('${file}')">Удалить</button>
        `;
        fileList.appendChild(fileItem);
    });
}

// Загрузка файла
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);
    await fetch('/upload', {
        method: 'POST',
        body: formData,
    });
    uploadForm.reset();
    fetchFiles();
});

// Скачивание файла
function downloadFile(filename) {
    window.location.href = `/download/${filename}`;
}

// Удаление файла
async function deleteFile(filename) {
    await fetch(`/delete/${filename}`, { method: 'DELETE' });
    fetchFiles();
}

// Инициализация
fetchFiles();
