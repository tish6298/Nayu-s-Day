const images = [
  { src: 'images/IMG_1843.heic', desc: 'Seffies and Nayu\'s phone.' },
  { src: 'images/IMG_3820.HEIC', desc: 'Hehe, my baby.' },
  { src: 'images/IMG_3821.HEIC', desc: 'Moo Seffiessss!!!' },
  { src: 'images/IMG_3923.HEIC', desc: 'Melts!!!' },
  // Add more images as needed
];

let currentIndex = 0;

function updateGallery() {
  const imageElement = document.getElementById('gallery-image');
  const descriptionElement = document.getElementById('memory-description');
  const downloadLink = document.getElementById('download-link');

  const currentImage = images[currentIndex];

  if (currentImage.src.endsWith('.heic') || currentImage.src.endsWith('.HEIC')) {
    fetch(currentImage.src)
      .then(response => response.blob())
      .then(blob => {
        return heic2any({ blob: blob, toType: 'image/jpeg' });
      })
      .then(convertedBlob => {
        const url = URL.createObjectURL(convertedBlob);
        imageElement.src = url;
        descriptionElement.innerText = currentImage.desc;
        downloadLink.href = url; // Update download link to converted image
      })
      .catch(error => {
        console.error('Error converting HEIC image:', error);
        // Fallback to original image if conversion fails
        imageElement.src = currentImage.src;
        descriptionElement.innerText = currentImage.desc;
        downloadLink.href = currentImage.src;
      });
  } else {
    imageElement.src = currentImage.src;
    descriptionElement.innerText = currentImage.desc;
    downloadLink.href = currentImage.src; // Update download link for JPG
  }
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  updateGallery();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateGallery();
}

// Event listeners for buttons
document.getElementById('next-btn').addEventListener('click', nextImage);
document.getElementById('prev-btn').addEventListener('click', prevImage);

// Keyboard navigation
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    nextImage();
  } else if (event.key === 'ArrowLeft') {
    prevImage();
  }
});

// Touch/swipe support for mobile
let touchStartX = 0;

document.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
});

document.addEventListener('touchmove', (event) => {
  const touchEndX = event.touches[0].clientX;
  if (touchStartX - touchEndX > 50) {
    nextImage();
  } else if (touchEndX - touchStartX > 50) {
    prevImage();
  }
});

updateGallery(); // Initialize gallery
