// ========================================
// ANBI Tech Solution - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Loading Screen
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 2200);
  }

  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    });
  }

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // Scroll Progress Bar
  const scrollProgress = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = scrollPercent + '%';
    }
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);

      // Animate hamburger
      const lines = mobileToggle.querySelectorAll('.hamburger-line');
      if (isExpanded) {
        lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
      }
    });

    // Close menu on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const lines = mobileToggle.querySelectorAll('.hamburger-line');
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
      });
    });
  }

  // Back to Top Button
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Animated Counter
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);
      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // Intersection Observer for counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('[data-count]');
        counters.forEach(counter => {
          if (!counter.classList.contains('counted')) {
            counter.classList.add('counted');
            animateCounter(counter);
          }
        });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.hero-stats, .commitment-stats').forEach(el => {
    counterObserver.observe(el);
  });

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-question').forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        q.nextElementSibling.classList.remove('active');
      });

      // Toggle current
      if (!isExpanded) {
        this.setAttribute('aria-expanded', 'true');
        answer.classList.add('active');
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  });

  // GSAP Animations (if available)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero text animation
    const heroLines = document.querySelectorAll('.hero-line');
    if (heroLines.length > 0) {
      gsap.from(heroLines, {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5
      });
    }

    // Parallax effect for hero
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      gsap.to('.hero-particles', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Section reveals
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.from(header, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  // File upload visual feedback
  document.querySelectorAll('.file-upload input[type="file"]').forEach(input => {
    input.addEventListener('change', function() {
      const label = this.nextElementSibling;
      if (this.files && this.files.length > 0) {
        label.innerHTML = '<i class="fas fa-check-circle"></i><span>' + this.files[0].name + '</span>';
        label.style.borderColor = 'var(--accent)';
        label.style.background = 'rgba(20, 184, 166, 0.05)';
      }
    });
  });

  // Set minimum date for booking
  const dateInput = document.getElementById('preferred-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Particle effect for hero
  createParticles();

  // Newsletter forms
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', handleNewsletterSubmit);
  });
});

// Dynamic API base: use relative path on Render, full URL elsewhere
const PUBLIC_API_BASE = (() => {
  const hostname = location.hostname;
  if (hostname === 'anbi-tech.onrender.com') return '/api';
  return 'https://anbi-tech.onrender.com/api';
})();

// Public API helpers
async function publicApiPost(endpoint, payload) {
  const res = await fetch(PUBLIC_API_BASE + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    if (res.status === 503) {
      throw new Error(data.message || 'Server database is not connected. Please check your MongoDB configuration.');
    }
    if (res.status === 404) {
      throw new Error(data.message || 'API endpoint not found. Is the backend server running?');
    }
    if (res.status === 400 && data.errors) {
      const msgs = data.errors.map(e => e.msg || e.message).join(', ');
      throw new Error(msgs || data.message || 'Validation failed');
    }
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

async function uploadPublicFile(endpoint, fieldName, file) {
  const formData = new FormData();
  formData.append(fieldName, file);
  const res = await fetch(PUBLIC_API_BASE + endpoint, { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Upload failed');
  }
  return data;
}

function showFormError(form, message) {
  let alert = form.querySelector('.form-alert-error');
  if (!alert) {
    alert = document.createElement('div');
    alert.className = 'form-alert-error';
    alert.style.cssText = 'background:#fef2f2;color:#dc2626;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:14px;';
    form.prepend(alert);
  }
  alert.textContent = message;
  alert.style.display = 'block';
}

function clearFormError(form) {
  const alert = form.querySelector('.form-alert-error');
  if (alert) alert.style.display = 'none';
}

// Form Handlers
async function handleBookingSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('booking-form');
  const success = document.getElementById('booking-success');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  clearFormError(form);
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  submitBtn.disabled = true;

  try {
    let imageUrl;
    const fileInput = document.getElementById('upload-image');
    if (fileInput?.files?.[0]) {
      const uploadResult = await uploadPublicFile('/bookings/upload', 'image', fileInput.files[0]);
      imageUrl = uploadResult.url;
    }

    const payload = {
      fullName: form.querySelector('[name="full_name"]').value.trim(),
      companyName: form.querySelector('[name="company_name"]').value.trim() || undefined,
      phone: form.querySelector('[name="phone"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      district: form.querySelector('[name="district"]').value,
      service: form.querySelector('[name="service"]').value,
      preferredDate: form.querySelector('[name="preferred_date"]').value,
      preferredTime: form.querySelector('[name="preferred_time"]').value,
      address: form.querySelector('[name="address"]').value.trim(),
      message: form.querySelector('[name="message"]').value.trim() || undefined,
    };
    if (imageUrl) payload.imageUrl = imageUrl;

    await publicApiPost('/bookings', payload);

    form.style.display = 'none';
    success.style.display = 'block';
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    showFormError(form, err.message || 'Failed to submit booking. Please try again.');
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

function resetBookingForm() {
  const form = document.getElementById('booking-form');
  const success = document.getElementById('booking-success');
  form.reset();
  form.style.display = 'flex';
  success.style.display = 'none';

  // Reset file upload label
  const fileLabel = form.querySelector('.file-upload-label');
  if (fileLabel) {
    fileLabel.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload image</span>';
    fileLabel.style.borderColor = '';
    fileLabel.style.background = '';
  }
}

async function handleQuoteSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('quote-form');
  const success = document.getElementById('quote-success');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  clearFormError(form);
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  submitBtn.disabled = true;

  try {
    let floorplanUrl;
    const fileInput = document.getElementById('quote-floorplan');
    if (fileInput?.files?.[0]) {
      const uploadResult = await uploadPublicFile('/quotations/upload', 'floorplan', fileInput.files[0]);
      floorplanUrl = uploadResult.url;
    }

    const payload = {
      name: form.querySelector('[name="name"]').value.trim(),
      company: form.querySelector('[name="company"]').value.trim() || undefined,
      phone: form.querySelector('[name="phone"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      serviceRequired: form.querySelector('[name="service_required"]').value,
      projectType: form.querySelector('[name="project_type"]').value,
      budget: form.querySelector('[name="budget"]').value || undefined,
      district: form.querySelector('[name="district"]').value,
      message: form.querySelector('[name="message"]').value.trim(),
    };
    if (floorplanUrl) payload.floorplanUrl = floorplanUrl;

    await publicApiPost('/quotations', payload);

    form.style.display = 'none';
    success.style.display = 'block';
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    showFormError(form, err.message || 'Failed to submit quotation request. Please try again.');
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

function resetQuoteForm() {
  const form = document.getElementById('quote-form');
  const success = document.getElementById('quote-success');
  form.reset();
  form.style.display = 'flex';
  success.style.display = 'none';

  const fileLabel = form.querySelector('.file-upload-label');
  if (fileLabel) {
    fileLabel.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload floor plan (PDF, Image, DWG)</span>';
    fileLabel.style.borderColor = '';
    fileLabel.style.background = '';
  }
}

async function handleContactSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  clearFormError(form);
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  try {
    const payload = {
      name: form.querySelector('[name="name"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      phone: form.querySelector('[name="phone"]').value.trim() || undefined,
      subject: form.querySelector('[name="subject"]').value,
      message: form.querySelector('[name="message"]').value.trim(),
    };

    await publicApiPost('/contact', payload);

    form.style.display = 'none';
    success.style.display = 'block';
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    showFormError(form, err.message || 'Failed to send message. Please try again.');
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

async function handleNewsletterSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const email = emailInput.value.trim();

  if (!email) return;

  const originalHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

  try {
    await publicApiPost('/newsletter', { email });
    alert('Thank you for subscribing to our newsletter!');
    form.reset();
  } catch (err) {
    alert(err.message || 'Subscription failed. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;
  }
}

function resetContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');
  form.reset();
  form.style.display = 'flex';
  success.style.display = 'none';
}

// Particle System
function createParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const particleCount = 25;
  const colors = ['rgba(0, 87, 255, 0.3)', 'rgba(0, 194, 255, 0.2)', 'rgba(20, 184, 166, 0.2)'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 6 + 4}s ease-in-out infinite;
      animation-delay: ${Math.random() * 4}s;
      pointer-events: none;
    `;
    container.appendChild(particle);
  }
}

// Lazy loading images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Keyboard navigation enhancement
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const navMenu = document.getElementById('nav-menu');
    const mobileToggle = document.getElementById('mobile-toggle');
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      const lines = mobileToggle.querySelectorAll('.hamburger-line');
      lines[0].style.transform = 'none';
      lines[1].style.opacity = '1';
      lines[2].style.transform = 'none';
    }
  }
});
