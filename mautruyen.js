var TrandingSlider = new Swiper('.tranding-slider', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });

    // Add flip functionality
    document.querySelectorAll('.tranding-slide').forEach(slide => {
      slide.addEventListener('click', function() {
        // Close other open cards first
        document.querySelectorAll('.tranding-slide').forEach(otherSlide => {
          if (otherSlide !== this && otherSlide.classList.contains('flipped')) {
            otherSlide.classList.remove('flipped');
          }
        });
        
        // Toggle current card
        this.classList.toggle('flipped');
      });
    });