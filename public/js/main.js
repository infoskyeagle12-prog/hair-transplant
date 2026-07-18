/**
 * HT Aesthetiq - Main JS File
 * Includes: Navbar Scroll, Hamburger Toggle, Dropdowns, Scroll Animation,
 * Before/After Image Slider, Testimonials Auto-Carousel, FAQ Accordion,
 * Multi-Step Booking Form, Smooth Scroll, and WhatsApp link tracking.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Navbar Scroll Behavior (Transparent -> Solid)
  // ==========================================================================
  const headerNav = document.querySelector('.header-nav');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial check


  // ==========================================================================
  // 2. Mobile Hamburger Menu Toggle & City/Services dropdown click for mobile
  // ==========================================================================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
      // Set accessibility attribute
      const isOpen = navMenu.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking a link (unless it's a dropdown trigger on mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const parentItem = link.closest('.nav-item');
        const hasDropdown = parentItem && parentItem.querySelector('.dropdown-menu');
        
        // If it's mobile (<768px) and has a dropdown, toggle dropdown
        if (window.innerWidth <= 768 && hasDropdown) {
          e.preventDefault();
          const dropdown = parentItem.querySelector('.dropdown-menu');
          dropdown.classList.toggle('active');
          
          // Rotate chevron
          const svg = link.querySelector('svg');
          if (svg) {
            if (dropdown.classList.contains('active')) {
              svg.style.transform = 'rotate(180deg)';
            } else {
              svg.style.transform = 'none';
            }
          }
        } else {
          // Normal link navigation
          hamburger.classList.remove('active');
          navMenu.classList.remove('open');
        }
      });
    });
  }


  // ==========================================================================
  // 3. Scroll Animations (Intersection Observer API)
  // ==========================================================================
  const animatedElements = document.querySelectorAll('.animate-on-scroll, .slide-left-on-scroll');
  const stepsContainer = document.querySelector('.steps-container');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 // trigger when 15% in viewport
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => elementObserver.observe(el));

    // Special trigger for How it Works steps connection line
    if (stepsContainer) {
      const stepsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            stepsContainer.classList.add('animated');
            observer.unobserve(stepsContainer);
          }
        });
      }, { threshold: 0.3 });
      stepsObserver.observe(stepsContainer);
    }
  } else {
    // Fallback if IntersectionObserver is not supported
    animatedElements.forEach(el => el.classList.add('visible'));
    if (stepsContainer) stepsContainer.classList.add('animated');
  }


  // ==========================================================================
  // 4. Before/After Image Slider (Pure CSS + JS drag/move)
  // ==========================================================================
  const sliders = document.querySelectorAll('.comparison-slider');

  sliders.forEach(slider => {
    const afterImage = slider.querySelector('.comparison-image.after');
    const handle = slider.querySelector('.slider-handle');
    let isResizing = false;

    // Helper function to set position
    const setPosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      
      // Bound the percentage between 0% and 100%
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      afterImage.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    // Event listeners for Mouse
    handle.addEventListener('mousedown', (e) => {
      isResizing = true;
      e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
      isResizing = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      setPosition(e.clientX);
    });

    // Event listeners for Touch Devices
    handle.addEventListener('touchstart', (e) => {
      isResizing = true;
    });

    window.addEventListener('touchend', () => {
      isResizing = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isResizing) return;
      if (e.touches[0]) {
        setPosition(e.touches[0].clientX);
      }
    });

    // Handle clicks/taps on the slider container to move the divider directly
    slider.addEventListener('click', (e) => {
      // Prevent trigger when clicking directly on handle button
      if (e.target.closest('.slider-handle-button')) return;
      setPosition(e.clientX);
    });
  });


  // ==========================================================================
  // 5. Testimonials Auto-Carousel with Dots Navigation
  // ==========================================================================
  const testimonialTrack = document.querySelector('.testimonial-track');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (testimonialTrack && testimonialSlides.length > 0) {
    let currentIndex = 0;
    const totalSlides = testimonialSlides.length;
    let autoPlayInterval;

    // Create dots dynamically
    testimonialSlides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (idx === 0) dot.classList.add('active');
      dot.setAttribute('data-index', idx);
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    const updateSlide = (index) => {
      currentIndex = index;
      testimonialTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update dots
      dots.forEach(d => d.classList.remove('active'));
      dots[currentIndex].classList.add('active');
    };

    const nextSlide = () => {
      let nextIdx = currentIndex + 1;
      if (nextIdx >= totalSlides) nextIdx = 0;
      updateSlide(nextIdx);
    };

    // Auto-play settings
    const startAutoplay = () => {
      autoPlayInterval = setInterval(nextSlide, 5000); // 5 seconds
    };

    const stopAutoplay = () => {
      clearInterval(autoPlayInterval);
    };

    startAutoplay();

    // Click on dots
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        stopAutoplay();
        const index = parseInt(e.target.getAttribute('data-index'));
        updateSlide(index);
        startAutoplay();
      });
    });

    // Pause on hover
    testimonialTrack.addEventListener('mouseenter', stopAutoplay);
    testimonialTrack.addEventListener('mouseleave', startAutoplay);
  }


  // ==========================================================================
  // 6. FAQ Accordion Toggle
  // ==========================================================================
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.closest('.faq-item');
      const faqBody = faqItem.querySelector('.faq-body');
      const isActive = faqItem.classList.contains('active');

      // Close all other FAQ items first
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          item.querySelector('.faq-body').style.maxHeight = null;
        }
      });

      // Toggle current FAQ
      if (isActive) {
        faqItem.classList.remove('active');
        faqBody.style.maxHeight = null;
      } else {
        faqItem.classList.add('active');
        faqBody.style.maxHeight = `${faqBody.scrollHeight}px`;
      }
    });
  });


  // ==========================================================================
  // 7. Multi-Step Booking Form Validation & Flow
  // ==========================================================================
  const bookingForm = document.getElementById('appointmentForm');
  const bookingSteps = document.querySelectorAll('.booking-form-step');
  const stepProgressItems = document.querySelectorAll('.progress-step-item');
  const progressLineFill = document.querySelector('.progress-line-fill');
  const btnPrev = document.querySelector('.btn-back');
  const btnNext = document.querySelector('.btn-next');
  const btnSubmit = document.querySelector('.btn-submit-form');
  const loadingSpinner = document.querySelector('.spinner');
  const btnNextText = document.querySelector('.btn-next-text');
  const bookingSuccessCard = document.querySelector('.booking-success-card');
  const progressLabels = document.querySelectorAll('.progress-step-labels span');

  let currentFormStep = 0;

  if (bookingForm && bookingSteps.length > 0) {
    
    // Setup select card behavior for service radio buttons
    const serviceRadioCards = document.querySelectorAll('.service-radio-card');
    serviceRadioCards.forEach(card => {
      card.addEventListener('click', () => {
        serviceRadioCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    const updateFormProgress = () => {
      // Hide all steps, show active
      bookingSteps.forEach((step, idx) => {
        if (idx === currentFormStep) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });

      // Update progress circles
      stepProgressItems.forEach((item, idx) => {
        if (idx < currentFormStep) {
          item.className = 'progress-step-item completed';
          item.innerHTML = '✓';
        } else if (idx === currentFormStep) {
          item.className = 'progress-step-item active';
          item.innerHTML = idx + 1;
        } else {
          item.className = 'progress-step-item';
          item.innerHTML = idx + 1;
        }
      });

      // Update labels
      progressLabels.forEach((lbl, idx) => {
        if (idx === currentFormStep) {
          lbl.classList.add('active');
        } else {
          lbl.classList.remove('active');
        }
      });

      // Update progress bar width
      const fillPercentage = (currentFormStep / (bookingSteps.length - 1)) * 100;
      progressLineFill.style.width = `${fillPercentage}%`;

      // Hide or show Back / Next / Submit buttons
      if (currentFormStep === 0) {
        btnPrev.style.display = 'none';
        btnNext.style.display = 'flex';
        btnSubmit.style.display = 'none';
      } else if (currentFormStep === bookingSteps.length - 1) {
        btnPrev.style.display = 'block';
        btnNext.style.display = 'none';
        btnSubmit.style.display = 'flex';
      } else {
        btnPrev.style.display = 'block';
        btnNext.style.display = 'flex';
        btnSubmit.style.display = 'none';
      }
    };

    const validateStep = (stepIndex) => {
      let isValid = true;
      const stepEl = bookingSteps[stepIndex];

      // Reset previous error messages and invalid classes
      stepEl.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('invalid');
        const group = input.closest('.form-group');
        if (group) {
          const err = group.querySelector('.error-message');
          if (err) err.style.display = 'none';
        }
      });

      if (stepIndex === 0) {
        // Step 1: Personal Info
        const nameInput = stepEl.querySelector('#clientName');
        const phoneInput = stepEl.querySelector('#clientPhone');
        const emailInput = stepEl.querySelector('#clientEmail');
        const citySelect = stepEl.querySelector('#clientCity');

        // Name Validation
        if (!nameInput.value.trim()) {
          showError(nameInput, 'Full Name is required.');
          isValid = false;
        }

        // Phone Validation (simple digit check)
        const phoneVal = phoneInput.value.trim();
        if (!phoneVal) {
          showError(phoneInput, 'Phone Number is required.');
          isValid = false;
        } else if (!/^\+?[0-9\s\-]{7,15}$/.test(phoneVal)) {
          showError(phoneInput, 'Enter a valid phone number.');
          isValid = false;
        }

        // Email Validation
        const emailVal = emailInput.value.trim();
        if (!emailVal) {
          showError(emailInput, 'Email Address is required.');
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          showError(emailInput, 'Enter a valid email address.');
          isValid = false;
        }

        // City Validation
        if (!citySelect.value) {
          showError(citySelect, 'Please select your nearest city.');
          isValid = false;
        }

      } else if (stepIndex === 1) {
        // Step 2: Service Selection
        const radioChecked = stepEl.querySelector('input[name="selectedService"]:checked');
        const errorContainer = stepEl.querySelector('.service-selection-error');
        if (!radioChecked) {
          if (errorContainer) {
            errorContainer.textContent = 'Please choose at least one treatment service.';
            errorContainer.style.display = 'block';
          }
          isValid = false;
        } else {
          if (errorContainer) errorContainer.style.display = 'none';
        }

      } else if (stepIndex === 2) {
        // Step 3: Date & Time
        const dateInput = stepEl.querySelector('#bookingDate');
        const timeInput = stepEl.querySelector('#bookingTime');

        if (!dateInput.value) {
          showError(dateInput, 'Please choose a preferred appointment date.');
          isValid = false;
        }
        if (!timeInput.value) {
          showError(timeInput, 'Please choose a preferred time slot.');
          isValid = false;
        }
      }

      return isValid;
    };

    const showError = (inputEl, message) => {
      inputEl.classList.add('invalid');
      const group = inputEl.closest('.form-group');
      if (group) {
        const err = group.querySelector('.error-message');
        if (err) {
          err.textContent = message;
          err.style.display = 'block';
        }
      }
    };

    // Next Button Click
    btnNext.addEventListener('click', () => {
      if (validateStep(currentFormStep)) {
        currentFormStep++;
        updateFormProgress();
      }
    });

    // Back Button Click
    btnPrev.addEventListener('click', () => {
      if (currentFormStep > 0) {
        currentFormStep--;
        updateFormProgress();
      }
    });

    // Form Submit (Simulated)
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateStep(currentFormStep)) return;

      // Disable buttons and show spinner
      btnSubmit.disabled = true;
      btnPrev.style.display = 'none';
      loadingSpinner.style.display = 'inline-block';

      // Simulate API post request delay (1.5 seconds)
      setTimeout(() => {
        // Hide form fields and progress steps
        bookingForm.style.display = 'none';
        document.querySelector('.booking-progress-container').style.display = 'none';
        
        // Display success card
        bookingSuccessCard.style.display = 'block';
        
        // Scroll to success card top
        bookingSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1500);
    });

    // Initial Progress Setup
    updateFormProgress();
  }


  // ==========================================================================
  // 8. Contact Page Form Validation
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = contactForm.querySelectorAll('.form-input');

      // Simple reset
      inputs.forEach(input => {
        input.classList.remove('invalid');
        const group = input.closest('.form-group');
        if (group) {
          const err = group.querySelector('.error-message');
          if (err) err.style.display = 'none';
        }
      });

      // Name
      const nameInput = contactForm.querySelector('#contactName');
      if (!nameInput.value.trim()) {
        showContactError(nameInput, 'Name is required.');
        isValid = false;
      }

      // Email
      const emailInput = contactForm.querySelector('#contactEmail');
      const emailVal = emailInput.value.trim();
      if (!emailVal) {
        showContactError(emailInput, 'Email is required.');
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        showContactError(emailInput, 'Enter a valid email.');
        isValid = false;
      }

      // Phone
      const phoneInput = contactForm.querySelector('#contactPhone');
      if (!phoneInput.value.trim()) {
        showContactError(phoneInput, 'Phone number is required.');
        isValid = false;
      }

      // Message
      const messageInput = contactForm.querySelector('#contactMessage');
      if (!messageInput.value.trim()) {
        showContactError(messageInput, 'Message is required.');
        isValid = false;
      }

      if (isValid) {
        // Mock successful submit
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Message...';

        setTimeout(() => {
          contactForm.innerHTML = `
            <div style="text-align:center; padding: 40px 10px; animation: fadeIn 0.5s ease;">
              <div style="font-size: 3.5rem; color:#10B981; margin-bottom: 20px;">✓</div>
              <h3 style="margin-bottom:10px;">Message Sent Successfully!</h3>
              <p>Thank you for reaching out to HT Aesthetiq. One of our clinic representatives will contact you shortly.</p>
            </div>
          `;
        }, 1200);
      }
    });

    const showContactError = (input, message) => {
      input.classList.add('invalid');
      const group = input.closest('.form-group');
      if (group) {
        const err = group.querySelector('.error-message');
        if (err) {
          err.textContent = message;
          err.style.display = 'block';
        }
      }
    };
  }


  // ==========================================================================
  // 9. Smooth Scroll for Anchor Links & Direct Book Button triggers
  // ==========================================================================
  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });


  // ==========================================================================
  // 10. WhatsApp Click-to-Chat Tracker
  // ==========================================================================
  const waButtons = document.querySelectorAll('a[href^="https://wa.me"]');
  waButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Direct click tracker logic can be added here if needed
      console.log('User initiated WhatsApp consultation chat.');
    });
  });

});
