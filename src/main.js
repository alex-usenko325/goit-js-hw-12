import { fetchImages } from './js/pixabay-api';
import { renderImages } from './js/render-functions';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.getElementById('load-more');
const loader = document.querySelector('.loader');
let page = 1; // Початкове значення для сторінки
let query = '';
let totalHits = 0; // Змінна для зберігання загальної кількості зображень

// Ініціалізація SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a');

// Функція для обробки помилок
function handleError(error) {
  iziToast.error({
    message: 'Something went wrong, please try again later.',
    position: 'topRight',
    class: 'custom-iziToast-error',
  });
}

// Функція для отримання висоти картки галереї
function getGalleryItemHeight() {
  const firstItem = gallery.querySelector('.gallery-item'); // Припускаємо, що в картки є клас 'gallery-item'
  return firstItem ? firstItem.getBoundingClientRect().height : 0; // Отримуємо висоту першої картки
}

// Сабміт форми
form.addEventListener('submit', async event => {
  event.preventDefault();
  query = event.currentTarget.elements.query.value.trim(); // Отримуємо запит

  gallery.innerHTML = ''; // Очищуємо галерею перед новим пошуком
  page = 1; // Скидаємо сторінку до першої
  totalHits = 0; // Скидаємо загальну кількість зображень
  loadMoreButton.style.display = 'none'; // Сховати кнопку "Load More"
  loader.style.position = 'static';
  loader.style.display = 'block'; // Показати лоадер

  try {
    const data = await fetchImages(query, page); // Запит з 15 зображеннями
    loader.style.display = 'none'; // Сховати лоадер

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, no images found for your search query. Please try again!',
        position: 'topRight',
        class: 'custom-iziToast-error',
      });
      return;
    }

    totalHits = data.totalHits; // Зберігаємо загальну кількість зображень
    renderImages(data.hits);
    lightbox.refresh();

    // Плавна прокрутка після першого завантаження
    const itemHeight = getGalleryItemHeight();
    window.scrollBy({
      top: itemHeight * 2, // Прокрутка на дві висоти картки
      behavior: 'smooth', // Плавна прокрутка
    });

    // Якщо результатів менше ніж 15, не показувати кнопку "Load More"
    loadMoreButton.style.display = data.hits.length < 15 ? 'none' : 'block';
  } catch (error) {
    loader.style.display = 'none'; // Сховати лоадер
    handleError(error);
  }
});

// Клік на кнопку "Load More"
loadMoreButton.addEventListener('click', async () => {
  page += 1; // Збільшуємо сторінку на 1

  const btnRect = loadMoreButton.getBoundingClientRect();

  loader.style.position = 'absolute';
  loader.style.top = `${btnRect.top + window.scrollY}px`;
  loader.style.left = `${btnRect.left + window.scrollX}px`;

  loadMoreButton.style.display = 'none'; // Сховати кнопку під час завантаження
  loader.style.display = 'block'; // Показати лоадер

  try {
    const data = await fetchImages(query, page); // Запит з 15 зображеннями
    loader.style.display = 'none'; // Сховати лоадер

    if (data.hits.length === 0) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        class: 'custom-iziToast-info',
      });
      loadMoreButton.style.display = 'none';
      return;
    }

    // Перевірка, чи досягли кінця колекції
    if (gallery.children.length + data.hits.length >= totalHits) {
      loadMoreButton.style.display = 'none'; // Сховати кнопку, якщо досягли кінця
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        class: 'custom-iziToast-info',
      });
    } else {
      loadMoreButton.style.display = 'block'; // Показати кнопку "Load More"
    }

    // Додаємо нові зображення до галереї
    renderImages(data.hits); // Відображаємо нові зображення
    lightbox.refresh(); // Оновлюємо lightbox

    // Плавна прокрутка після завантаження нових зображень
    const itemHeight = getGalleryItemHeight();
    window.scrollBy({
      top: itemHeight * 2, // Прокрутка на дві висоти картки
      behavior: 'smooth', // Плавна прокрутка
    });
  } catch (error) {
    loader.style.display = 'none'; // Сховати лоадер
    handleError(error);
  }
});
