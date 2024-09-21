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
  
  imageElement.src = images[currentIndex].src;
  descriptionElement.innerText = images[currentIndex].desc;
  downloadLink.href = images[currentIndex].src;
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
