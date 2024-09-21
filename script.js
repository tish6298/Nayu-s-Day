const images = [
  { src: 'images/IMG_1843.heic', desc: 'Seffies and Nayu\'s phone.' },
  { src: 'images/IMG_3820.HEIC', desc: 'Hehe, my baby.' },
  { src: 'images/IMG_3821.HEIC', desc: 'Moo Seffiessss!!!' },
  { src: 'images/IMG_3923.HEIC', desc: 'Melts!!!' },
  // Add more images as needed
];

let currentIndex = 0;

function updateGallery() {
  const memoryGrid = document.querySelector('.memory-grid');
  memoryGrid.innerHTML = ''; // Clear existing items

  images.forEach((image, index) => {
    const div = document.createElement('div');
    div.className = 'memory-item';
    div.innerHTML = `
      <img src="${image.src}" alt="Memory Image" onclick="openFullscreen(${index})" />
      <p>${image.desc}</p>
    `;
    memoryGrid.appendChild(div);
  });
}

function openFullscreen(index) {
  currentIndex = index;
  const modal = document.getElementById('fullscreen-modal');
  const imageElement = document.getElementById('fullscreen-image');
  const descriptionElement = document.getElementById('fullscreen-description');
  const downloadLink = document.getElementById('download-fullscreen-link');

  loadImage(currentIndex, (src, desc) => {
    imageElement.src = src;
    descriptionElement.innerText = desc;
    downloadLink.href = src;
  });

  modal.style.display = "block";
}

// Load image and handle conversion
function loadImage(index, callback) {
  const currentImage = images[index];
  
  if (currentImage.src.endsWith('.heic') || currentImage.src.endsWith('.HEIC')) {
    fetch(currentImage.src)
      .then(response => response.blob())
      .then(blob => {
        return heic2any({ blob: blob, toType: 'image/jpeg' });
      })
      .then(convertedBlob => {
        const url = URL.createObjectURL(convertedBlob);
        callback(url, currentImage.desc);
      })
      .catch(error => {
        console.error('Error converting HEIC image:', error);
        callback(currentImage.src, currentImage.desc); // Fallback to original
      });
  } else {
    callback(currentImage.src, currentImage.desc); // Directly load JPG
  }
}

function closeFullscreen() {
  document.getElementById('fullscreen-modal').style.display = "none";
}

// Navigation functions
function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  loadImage(currentIndex, (src, desc) => {
    document.getElementById('fullscreen-image').src = src;
    document.getElementById('fullscreen-description').innerText = desc;
    document.getElementById('download-fullscreen-link').href = src;
  });
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  loadImage(currentIndex, (src, desc) => {
    document.getElementById('fullscreen-image').src = src;
    document.getElementById('fullscreen-description').innerText = desc;
    document.getElementById('download-fullscreen-link').href = src;
  });
}

// Event listeners for buttons
document.getElementById('close-modal').addEventListener('click', closeFullscreen);
document.getElementById('next-fullscreen-btn').addEventListener('click', nextImage);
document.getElementById('prev-fullscreen-btn').addEventListener('click', prevImage);

// Close fullscreen with Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeFullscreen();
  }
});

// Touch/swipe support for mobile
let touchStartY = 0;

document.addEventListener('touchstart', (event) => {
  touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchmove', (event) => {
  const touchEndY = event.touches[0].clientY;
  if (touchStartY - touchEndY > 50) {
    nextImage(); // Swipe up to go to the next image
  } else if (touchEndY - touchStartY > 50) {
    prevImage(); // Swipe down to go to the previous image
  }
});

// Initialize gallery
updateGallery();
