document.getElementById('upload-button').addEventListener('click', function() {
    const fileInput = document.getElementById('file-input');
    const files = fileInput.files;
    const galleryContainer = document.getElementById('gallery-container');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const memoryItem = document.createElement('div');
        memoryItem.className = 'memory-item';

        const fileURL = URL.createObjectURL(file);
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = fileURL;
            memoryItem.appendChild(img);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = fileURL;
            video.controls = true;
            memoryItem.appendChild(video);
        }

        const downloadLink = document.createElement('a');
        downloadLink.href = fileURL;
        downloadLink.download = file.name;
        downloadLink.textContent = 'Download';
        downloadLink.className = 'download-link';
        memoryItem.appendChild(downloadLink);

        galleryContainer.appendChild(memoryItem);
    }
});
