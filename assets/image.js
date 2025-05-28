document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".portfolio__item img");
  const modal = document.createElement("div");
  modal.classList.add("image-modal");
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <button class="modal-nav modal-prev">&lt;</button>
      <button class="modal-nav modal-next">&gt;</button>
      <div class="modal-loading"></div>
      <img class="modal-img" src="" alt="">
      <div class="modal-caption"></div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const modalImg = modal.querySelector(".modal-img");
  const closeBtn = modal.querySelector(".modal-close");
  const prevBtn = modal.querySelector(".modal-prev");
  const nextBtn = modal.querySelector(".modal-next");
  const caption = modal.querySelector(".modal-caption");
  const loading = modal.querySelector(".modal-loading");
  
  let currentIndex = 0;
  let imageArray = Array.from(images);
  
  // Preload images for smoother transitions
  function preloadImages() {
    imageArray.forEach(img => {
      const tempImg = new Image();
      tempImg.src = img.src;
    });
  }
  
  preloadImages();
  
  function showImage(index) {
    if (index < 0) index = imageArray.length - 1;
    if (index >= imageArray.length) index = 0;
    
    currentIndex = index;
    const img = imageArray[currentIndex];
    
    loading.style.display = 'block';
    modalImg.style.opacity = '0';
    
    // Load image first
    const tempImg = new Image();
    tempImg.onload = () => {
      modalImg.src = img.src;
      modalImg.alt = img.alt || '';
      caption.textContent = img.alt || '';
      modalImg.style.opacity = '1';
      loading.style.display = 'none';
    };
    tempImg.src = img.src;
  }
  
  // Add click event to each image
  images.forEach((img, index) => {
    img.addEventListener("click", () => {
      modal.classList.add("open");
      showImage(index);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  });
  
  // Navigation
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });
  
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });
  
  // Close modal
  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = ''; // Re-enable scrolling
  }
  
  closeBtn.addEventListener("click", closeModal);
  
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    
    switch(e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        showImage(currentIndex - 1);
        break;
      case 'ArrowRight':
        showImage(currentIndex + 1);
        break;
    }
  });
  
  // Swipe support for touch devices
  let touchStartX = 0;
  let touchEndX = 0;
  
  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});
  
  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, {passive: true});
  
  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      // Swipe left
      showImage(currentIndex + 1);
    } else if (touchEndX > touchStartX + 50) {
      // Swipe right
      showImage(currentIndex - 1);
    }
  }
});