
// Плавная прокрутка для навигационных ссылок
document.addEventListener('click', (e) => {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// Параллакс эффект для главного экрана
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    hero.style.backgroundPosition = `50% ${scrolled * 0.5}px`;
  });
}

// Инициализация ScrollReveal
const sr = ScrollReveal({
  origin: 'bottom',
  distance: '50px',
  duration: 1000,
  delay: 200,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  reset: true
});

const revealConfig = {
  '.hero-content': { distance: '100px', opacity: 0, scale: 0.95, duration: 1200 },
  '.about-content > *': { interval: 200, scale: 0.98, opacity: 0, duration: 1000 },
  '.project-card': { interval: 300, scale: 0.95, opacity: 0, duration: 1200 },
  '.contact-form': { delay: 300 },
  '.service-card': { interval: 250, scale: 0.97, opacity: 0, duration: 1100 },
  '.timeline-item': { interval: 400, distance: '100px', origin: 'left', opacity: 0, duration: 1300 },
  '.price-card': { interval: 200 }
};

Object.entries(revealConfig).forEach(([selector, config]) => {
  sr.reveal(selector, config);
});

// Обработка формы с отправкой в Telegram
document.addEventListener('DOMContentLoaded', () => {
  // 1. Инициализация маски для телефона
  $('#phone').mask('+7 (000) 000-00-00', {
    clearIfNotMatch: true,
    onKeyPress: function(cep, e, field, options) {
      console.log('Введенный номер:', cep.replace(/\D/g, '')); // Логирование ввода
    }
  });

  // 2. Получаем форму
  const contactForm = document.getElementById('contact-form');

  // 3. Обработчик отправки формы
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Начало обработки формы...');

   // 4. Получаем и валидируем данные
let phone = $('#phone').cleanVal().replace(/\D/g, ''); // Замените const на let!

// Автоматически добавляем код страны, если номер начинается с 9
if (phone.startsWith('9') && phone.length === 10) {
  phone = '7' + phone; // Делаем номер вида 79277717332
}

const name = document.getElementById('name').value.trim();
const email = document.getElementById('email').value.trim();

    // 5. Улучшенная валидация
    if (!name || !phone) {
      alert('Заполните обязательные поля (Имя и Телефон)!');
      return;
    }

    if (phone.length !== 11) {
      alert('Номер должен содержать 11 цифр в формате: +7 (XXX) XXX-XX-XX');
      return;
    }

    // 6. Собираем данные для отправки
    const formData = {
      name: name,
      email: email,
      phone: phone
    };

    try {
      // 7. Отправка данных
      const response = await fetch('http://localhost:3000/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // 8. Обработка ответа
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      console.log('Ответ сервера:', result);

      if (result.status === 'success') {
        contactForm.reset();
        alert('✅ Данные отправлены! Мы свяжемся с вами в течение 15 минут');
      } else {
        alert('❌ Ошибка: ' + (result.message || 'Неизвестная ошибка сервера'));
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('🚨 Ошибка соединения. Пожалуйста, попробуйте еще раз или позвоните нам');
    }
  });
});


// Before/After image comparison slider functionality
document.querySelectorAll('.before-after').forEach(container => {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = '100';
  slider.value = '50';
  slider.className = 'comparison-slider';
  
  slider.addEventListener('input', (e) => {
    container.style.setProperty('--position', `${e.target.value}%`);
  });
  
  container.appendChild(slider);
});

// Animate skill bars when they come into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width;
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.progress-bar > div').forEach(bar => {
  observer.observe(bar);
});

// Simple testimonial slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');

function showTestimonial(index) {
  testimonials.forEach((testimonial, i) => {
    testimonial.style.display = i === index ? 'block' : 'none';
  });
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}

if (testimonials.length > 0) {
  showTestimonial(0);
  setInterval(nextTestimonial, 5000);
}

// Initialize testimonials
showTestimonial(0);
setInterval(nextTestimonial, 5000);

// Gallery Filtering
document.addEventListener('click', (e) => {
  if (e.target.matches('.filter-btn')) {
    const filter = e.target.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    document.querySelectorAll('.gallery-item').forEach(item => {
      item.style.display = filter === 'all' || item.dataset.category === filter ? 'block' : 'none';
    });
  }
});

// FAQ Toggling
document.addEventListener('click', (e) => {
  if (e.target.matches('.faq-question')) {
    const faqItem = e.target.closest('.faq-item');
    const wasActive = faqItem.classList.contains('active');
    
    document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
    if (!wasActive) faqItem.classList.add('active');
  }
});

// Service Areas Map Interaction
document.addEventListener('mouseover', (e) => {
  if (e.target.matches('.map-region')) {
    document.querySelector(`[data-area="${e.target.dataset.area}"]`).classList.add('active');
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target.matches('.map-region')) {
    document.querySelector(`[data-area="${e.target.dataset.area}"]`).classList.remove('active');
  }
});

// Consultation Form Handling
const consultationForm = document.getElementById('consultation-form');
if (consultationForm) {
  consultationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(consultationForm);
    // Handle form submission...
    
    consultationForm.reset();
    alert('Спасибо! Мы свяжемся с вами в ближайшее время, чтобы договориться о вашей консультации.');
  });
}

// Project Carousel functionality
function initProjectCarousels() {
  document.querySelectorAll('.project-carousel').forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    let currentSlide = 0;

    const updateSlides = () => {
      slides.forEach((slide, index) => {
        slide.style.display = index === currentSlide ? 'block' : 'none';
        slide.style.opacity = index === currentSlide ? '1' : '0';
        slide.style.transform = index === currentSlide ? 'translateX(0)' : `translateX(${index > currentSlide ? '100%' : '-100%'})`;
      });
    };

    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    prevBtn?.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlides();
    });

    nextBtn?.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlides();
    });

    updateSlides();
  });
}

document.addEventListener('DOMContentLoaded', initProjectCarousels);

// Анимация для процесса работы
document.querySelectorAll('.process-step').forEach((step, index) => {
  step.style.transitionDelay = `${index * 200}ms`;
  step.addEventListener('mouseenter', () => {
    step.style.transform = 'scale(1.05) translateX(10px)';
    step.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
  });
  
  step.addEventListener('mouseleave', () => {
    step.style.transform = 'scale(1) translateX(0)';
    step.style.boxShadow = '';
  });
});

// Улучшенная анимация для социальных карточек
document.querySelectorAll('.social-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-10px) scale(1.02)';
    card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) scale(1)';
    card.style.boxShadow = '';
  });
});


