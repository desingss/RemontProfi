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
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const btn = contactForm.querySelector('button');
  const originalText = btn.textContent;
  
  // Проверка формата телефона
  const phoneInput = document.getElementById('phone');
  const phoneNumber = phoneInput.value.replace(/\D/g, '');
  
  if (phoneNumber.length !== 11) {
    alert('Пожалуйста, введите корректный номер телефона (11 цифр)');
    return;
  }

  // Получаем значения полей
  const name = document.getElementById('name').value;
const email = document.getElementById('email').value;
const phone = document.getElementById('phone').value;

// Экранирование данных перед вставкой
const safeName = escapeHtml(name);
const safeEmail = escapeHtml(email);
const safePhone = escapeHtml(phone);

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}


  // Формируем сообщение для Telegram
  const message = `
📩 Вам новая заявка:
<b>Имя:</b> ${name}
<b>Email:</b> ${email}
<b>Телефон:</b> ${phone}
  `;

  // Параметры для отправки в Telegram

  require('dotenv').config(); // Загружаем переменные из .env

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  console.log('Токен бота:', botToken);
  console.log('Chat ID:', chatId);

  
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    btn.style.transform = 'scale(0.95)';
    btn.style.opacity = '0.8';
    btn.textContent = 'Отправка...';
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      throw new Error('Ошибка при отправке сообщения');
    }

    // Успешная отправка
    btn.style.transform = 'scale(1.05)';
    btn.style.opacity = '1';
    btn.textContent = 'Отправлено!';
    btn.style.backgroundColor = '#0056b3';
    
    // Очищаем форму
    contactForm.reset();
    
    // Возвращаем исходное состояние кнопки
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
      btn.textContent = originalText;
      btn.style.backgroundColor = '';
    }, 2000);

  } catch (error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
    
    btn.style.transform = 'scale(1)';
    btn.textContent = originalText;
    btn.style.backgroundColor = '';
  }
});

// Маска для телефона
const phoneInput = document.querySelector('input[name="phone"]');
if (phoneInput && typeof IMask !== 'undefined') {
  IMask(phoneInput, {
    mask: '+{7} (000) 000-00-00',
    lazy: false,
    placeholderChar: '_'
  });

  phoneInput.addEventListener('input', () => {
    const phone = phoneInput.value.replace(/\D/g, '');
    phoneInput.setCustomValidity(phone.length === PHONE_NUMBER_LENGTH ? '' : 'Укажите корректный номер!');
  });
}



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


