const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const gallery = document.getElementById('gallery');

uploadBtn.addEventListener('click', () => {
  const files = fileInput.files;
  if (files.length === 0) return;

  for (const file of files) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const memoryItem = document.createElement('div');
      memoryItem.className = 'memory-item';
      
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = file.name;
        memoryItem.appendChild(img);
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = e.target.result;
        video.controls = true;
        memoryItem.appendChild(video);
      }

      gallery.appendChild(memoryItem);
    };
    reader.readAsDataURL(file);
  }
});
