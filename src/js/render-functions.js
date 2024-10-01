export function renderImages(images) {
  const gallery = document.querySelector('.gallery');

  // Створюємо розмітку для нових зображень
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <li class="gallery-item">
           <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" class="preview-image"/>
          </a>
          <div class="info">
            <p><b>Likes:</b> ${likes}</p>
            <p><b>Views:</b> ${views}</p>
            <p><b>Comments:</b> ${comments}</p>
            <p><b>Downloads:</b> ${downloads}</p>
          </div>
        </li>
      `
    )
    .join('');

  // Додаємо нові зображення до існуючих в галереї
  gallery.insertAdjacentHTML('beforeend', markup);
}
