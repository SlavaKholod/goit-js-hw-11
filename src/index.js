import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ImgApi from './partials/apiClient';
import refs from './partials/refs';
import markupTemplate from './partials/card.hbs';

const ImgLoadApi = new ImgApi();

var lightbox = new SimpleLightbox('.gallery__link', {
  captionSelector: 'img',
  captionType: 'attr',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onSerch);
refs.loadMore.addEventListener('click', onLoadMore);

function onSerch(event) {
  event.preventDefault();
  clearMarkup();
  ImgLoadApi.resetPage();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  ImgLoadApi.keyWord = searchQuery.value.trim();

  ImgLoadApi.getImg(ImgLoadApi.keyWord).then(data => {
    if (data.length === 0) {
      refs.loadMore.style.visibility = 'hidden';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      addMarkup(data);
      Notify.info(`Hooray! We found ${ImgLoadApi.totalHits} images.`);
      if (data.length === 40) {
        refs.loadMore.style.visibility = 'visible';
      }
    }
  });
  refs.searchForm.reset();
}

function onLoadMore() {
  ImgLoadApi.getImg().then(data => {
    addMarkup(data);
    if (data.length < 40) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMore.style.visibility = 'hidden';
    }
  });
}

function addMarkup(data) {
  data.map(element => {
    const markup = markupTemplate(element);
    refs.contentSection.insertAdjacentHTML('beforeend', markup);
  });
  lightbox.refresh();
  smoothScrol();
}

function clearMarkup() {
  refs.contentSection.innerHTML = '';
}

function smoothScrol() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
