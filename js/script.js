document.getElementById('year').textContent = new Date().getFullYear();

// ===============================
// Перемикач теми
// ===============================
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const saved = localStorage.getItem('theme');

if (saved) {
  root.classList.toggle('light', saved === 'light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = root.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}


// ===============================
// Мобільне меню
// ===============================
const navToggle = document.querySelector('.nav-toggle');
const navList = document.getElementById('menu');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';

    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('show');
  });
}


// ===============================
// Анімація лічильників
// ===============================
const counters = document.querySelectorAll('.num[data-count]');

if (counters.length > 0) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.count);

      let current = 0;
      const step = Math.max(1, Math.floor(target / 60));

      const tick = () => {
        current += step;

        if (current >= target) {
          el.textContent = target;
          return;
        }

        el.textContent = current;
        requestAnimationFrame(tick);
      };

      tick();
      observer.unobserve(el);
    });
  }, {
    threshold: 0.6
  });

  counters.forEach(counter => observer.observe(counter));
}


// ===============================
// Контактна форма + Formspree
// ===============================
const form = document.getElementById('contactForm');
const status = document.querySelector('.form-status');

if (form) {

  const validators = {
    name: value =>
      value.trim().length >= 2 ||
      'Вкажи щонайменше 2 символи.',

    email: value =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
      'Невірний формат email.',

    message: value =>
      value.trim().length >= 10 ||
      'Напиши хоча б 10 символів.'
  };


  form.addEventListener('submit', async (event) => {

    // Не даємо Formspree відправити форму,
    // якщо є помилки
    let valid = true;

    ['name', 'email', 'message'].forEach(id => {

      const input = document.getElementById(id);

      if (!input) return;

      const error = input.parentElement.querySelector('.error');
      const result = validators[id](input.value);

      if (result !== true) {

        valid = false;

        if (error) {
          error.textContent = result;
        }

        input.setAttribute('aria-invalid', 'true');

      } else {

        if (error) {
          error.textContent = '';
        }

        input.removeAttribute('aria-invalid');
      }
    });


    if (!valid) {
      event.preventDefault();

      if (status) {
        status.textContent = 'Перевір форму — є помилки.';
      }

      return;
    }


    // ===============================
    // Відправка у Formspree
    // ===============================

    event.preventDefault();

    if (status) {
      status.textContent = 'Надсилаю...';
    }

    const formData = new FormData(form);

    try {

      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });


      if (response.ok) {

        if (status) {
          status.textContent = 'Повідомлення успішно надіслано ✓';
        }

        form.reset();

      } else {

        const data = await response.json().catch(() => null);

        if (status) {
          status.textContent =
            data?.errors?.[0]?.message ||
            'Не вдалося надіслати повідомлення.
            Спробуй ще раз.';
        }
      }

    } catch (error) {

      console.error('Formspree error:', error);

      if (status) {
        status.textContent =
          'Помилка з’єднання. Перевір інтернет і спробуй ще раз.';
      }
    }

  });

}
