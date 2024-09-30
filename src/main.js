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
let page = 1;
let query = '';

const lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', async event => {
  event.preventDefault();
  query = event.currentTarget.elements.query.value.trim();

  gallery.innerHTML = '';
  page = 1;
  loadMoreButton.style.display = 'none';
  loader.style.display = 'block';

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const data = await fetchImages(query, page);
    loader.style.display = 'none';

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, no images found for your search query. Please try again!',
        position: 'topRight',
        class: 'custom-iziToast-error',
      });
      return;
    }

    renderImages(data.hits);
    lightbox.refresh();

    if (data.totalHits > page * 15) {
      loadMoreButton.style.display = 'block';
    }
  } catch (error) {
    loader.style.display = 'none';
    handleError(error);
  }
});

loadMoreButton.addEventListener('click', async () => {
  page += 1;
  loader.style.display = 'block';

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const data = await fetchImages(query, page);
    loader.style.display = 'none';

    if (data.hits.length === 0) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        class: 'custom-iziToast-info',
      });
      loadMoreButton.style.display = 'none';
      return;
    }

    renderImages(data.hits);
    lightbox.refresh();

    if (data.totalHits <= page * 15) {
      loadMoreButton.style.display = 'none';
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        class: 'custom-iziToast-info',
      });
    }
  } catch (error) {
    loader.style.display = 'none';
    handleError(error);
  }
});

function handleError(error) {
  if (error.message === 'No images found') {
    iziToast.error({
      message:
        'Sorry, no images found for your search query. Please try again!',
      position: 'topRight',
      class: 'custom-iziToast-error',
    });
  } else {
    iziToast.error({
      message: 'Something went wrong, please try again later.',
      position: 'topRight',
      class: 'custom-iziToast-error',
    });
  }
}
