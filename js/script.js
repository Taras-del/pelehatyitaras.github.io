// Рік у футері
document.getElementById('year').textContent = new Date().getFullYear();

// Перемикач теми
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme');

if (saved) {
  root.classList.toggle('light', saved === 'light');
}

themeToggle.addEventListener('click', () => {
  const isLight = root.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Меню на мобільних
const navToggle = document.querySelector('.nav-toggle');
const navList = document.getElementById('menu');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';

    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('show');
  });
}

// Анімація лічильників
const counters = document.querySelectorAll('.num[data-count');

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

counters.forEach(c => observer.observe(c));


// Валідація контактної форми
const form = document.getElementById('contactForm');
const status = document.querySelector('.form-status');

const validators = {
  name: v =>
    v.trim().length >= 2 ||
    'Вкажи щонайменше 2 символи.',

  email: v =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
    'Невірний формат email.',

  message: v =>
    v.trim().length >= 10 ||
    'Напиши хоча б 10 символів.'
};


// Відправка форми через Formspree
form.addEventListener('submit', async e => {

  e.preventDefault();

  status.textContent = '';

  let ok = true;


  // Перевіряємо поля
  ['name', 'email', 'message'].forEach(id => {

    const input = document.getElementById(id);
    const err = input.nextElementSibling;

    const res = validators[id](input.value);

    if (res !== true) {

      ok = false;

      err.textContent = res;

      input.setAttribute('aria-invalid', 'true');

    } else {

      err.textContent = '';

      input.removeAttribute('aria-invalid');
    }
  });


  // Якщо є помилки
  if (!ok) {

    status.textContent = 'Перевір форму — є помилки.';

    return;
  }


  // Повідомлення користувачу
  status.textContent = 'Надсилаю...';


  try {

    // Збираємо дані форми
    const formData = new FormData(form);


    // Відправляємо Formspree
    const response = await fetch(
      'https://formspree.io/f/xeajpygd',
      {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }
    );


    // Успішна відправка
    if (response.ok) {

      status.textContent =
        'Готово! Я отримав твоє повідомлення ✓';

      form.reset();

    } else {

      status.textContent =
        'Не вдалося надіслати повідомлення. Спробуй ще раз.';
    }


  } catch (error) {

    console.error('Помилка Formspree:', error);

    status.textContent =
      'Помилка з’єднання. Спробуй ще раз.';
  }

});
