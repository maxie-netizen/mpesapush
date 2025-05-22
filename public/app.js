new Vue({
  el: '#app',
  mounted() {
    document.addEventListener('DOMContentLoaded', function() {
      // Loading screen
      const loadingScreen = document.getElementById('loadingScreen');
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 1500);

      // Header scroll effect
      const header = document.getElementById('mainHeader');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });

      // Mobile Menu Toggle
      const menuToggle = document.getElementById('menuToggle');
      const nav = document.getElementById('nav');
      
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('show');
        document.body.style.overflow = nav.classList.contains('show') ? 'hidden' : '';
      });

      // Close mobile menu when clicking a link
      const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth < 992) {
            menuToggle.classList.remove('active');
            nav.classList.remove('show');
            document.body.style.overflow = '';
          }
        });
      });

      // Slideshow functionality
      let slideIndex = 0;
      const slides = document.querySelectorAll('.slide');
      const indicators = document.querySelectorAll('.slide-indicator');
      
      function showSlides() {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add('active');
        indicators[slideIndex].classList.add('active');
        
        setTimeout(showSlides, 5000);
      }
      
      // Manual slide control
      indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
          const slideNum = parseInt(this.getAttribute('data-slide'));
          slideIndex = slideNum - 1;
          showSlides();
        });
      });
      
      // Initialize slideshow
      setTimeout(showSlides, 5000);

      // Testimonials Slider
      const testimonialsContainer = document.getElementById('testimonialsContainer');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const dots = document.querySelectorAll('.slider-dot');
      let currentIndex = 0;
      const testimonialCount = document.querySelectorAll('.testimonial-card').length;
      let autoSlideInterval;

      function updateSlider() {
        testimonialsContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentIndex);
        });
      }

      function goToSlide(index) {
        currentIndex = index;
        updateSlider();
        resetAutoSlide();
      }

      function nextSlide() {
        currentIndex = (currentIndex + 1) % testimonialCount;
        updateSlider();
        resetAutoSlide();
      }

      function prevSlide() {
        currentIndex = (currentIndex - 1 + testimonialCount) % testimonialCount;
        updateSlider();
        resetAutoSlide();
      }

      function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
      }

      function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
      }

      // Event listeners
      nextBtn.addEventListener('click', nextSlide);
      prevBtn.addEventListener('click', prevSlide);

      dots.forEach(dot => {
        dot.addEventListener('click', function() {
          const slideIndex = parseInt(this.getAttribute('data-index'));
          goToSlide(slideIndex);
        });
      });

      // Start auto sliding
      startAutoSlide();

      // Pause on hover
      testimonialsContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
      });

      testimonialsContainer.addEventListener('mouseleave', startAutoSlide);

      // Counter animation for stats
      const counters = document.querySelectorAll('.counter');
      const speed = 200;
      
      function animateCounters() {
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const count = +counter.innerText;
          const increment = target / speed;
          
          if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
          } else {
            counter.innerText = target;
          }
        });
      }
      
      // Start counter animation when stats section is in view
      const statsSection = document.querySelector('.stats-section');
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
          observer.unobserve(statsSection);
        }
      }, { threshold: 0.5 });
      
      observer.observe(statsSection);

      // Smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        });
      });

      // Scroll down button
      const scrollDownBtn = document.getElementById('scrollDown');
      scrollDownBtn.addEventListener('click', () => {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      });

      // Form submission
      const contactForm = document.getElementById('contactForm');
      if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Simulate form submission
          const submitBtn = this.querySelector('button[type="submit"]');
          const originalText = submitBtn.innerHTML;
          
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
          submitBtn.disabled = true;
          
          setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            setTimeout(() => {
              submitBtn.innerHTML = originalText;
              submitBtn.disabled = false;
            }, 2000);
          }, 1500);
          
          // In a real implementation, you would send the form data to a server here
          // and handle the response appropriately
          
          this.reset();
        });
      }

      // CV Download button
      const downloadCV = document.getElementById('downloadCV');
      downloadCV.addEventListener('click', function(e) {
        e.preventDefault();
        alert('CV download would start here in a real implementation.');
        // In a real implementation, this would trigger a file download
      });

      // Back to top button
      const backToTop = document.getElementById('backToTop');
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
          backToTop.classList.add('active');
        } else {
          backToTop.classList.remove('active');
        }
      });
      
      backToTop.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });

      // Set current year in footer
      document.getElementById('currentYear').textContent = new Date().getFullYear();

      // Animation on scroll
      function animateOnScroll() {
        const elements = document.querySelectorAll('.section-title, .skill-card, .project-card, .testimonial-card, .contact-info, .contact-form');
        
        elements.forEach(element => {
          const elementPosition = element.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / 1.3;
          
          if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }
        });
      }

      // Set initial state for animated elements
      document.querySelectorAll('.skill-card, .project-card, .testimonial-card, .contact-info, .contact-form').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      });

      window.addEventListener('scroll', animateOnScroll);
      window.addEventListener('load', animateOnScroll);

      // Active nav link highlighting
      const sections = document.querySelectorAll('section');
      window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          
          if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
          }
        });
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
      });
    });
    },
  data: {
    phone: '',
    amount: 20,
    loading: false,
    paymentStatus: null,
    error: null
  },
  methods: {
    formatPhone(phone) {
      phone = phone.replace(/\D/g, '');
      if (phone.startsWith('0')) return '254' + phone.substring(1);
      if (phone.startsWith('7')) return '254' + phone;
      return phone;
    },
    methods: {
  async submitPayment() {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.post('/api/initiate-stk', {
        phone: this.formatPhone(this.phone),
        amount: this.amount
      });
      this.paymentStatus = "STK Push sent! Check your phone for payment prompt.";
    } catch (err) {
      this.error = err.response?.data?.error || "Payment failed. Try again.";
    }
    this.loading = false;
  }
}
});