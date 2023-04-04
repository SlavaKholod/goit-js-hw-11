import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ImgApi from './partials/apiClient';
import refs from './partials/refs';
import markupTemplate from './partials/card.hbs';
// import InfiniteScroll from 'infinite-scroll';

const ImgLoadApi = new ImgApi();

var lightbox = new SimpleLightbox('.gallery__link', {
  captionSelector: 'img',
  captionType: 'attr',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onSerch);
refs.loadMore.addEventListener('click', onLoadMore);

async function onSerch(event) {
  event.preventDefault();
  onSerchRefresh();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  ImgLoadApi.keyWord = searchQuery.value.trim();

  if (ImgLoadApi.keyWord === '') {
    refs.loadMore.style.visibility = 'hidden';
    Notify.info('Please input some request');
    return;
  }
  const data = await ImgLoadApi.getDataList(ImgLoadApi.keyWord);
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
  refs.searchForm.reset();
}

async function onLoadMore() {

  const data = await ImgLoadApi.getDataList();
  addMarkup(data);
  if (data.length < 40) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    refs.loadMore.style.visibility = 'hidden';
  }
}

function addMarkup(data) {
  data.map(element => {
    const markup = markupTemplate(element);
    refs.contentSection.insertAdjacentHTML('beforeend', markup);
  });
  lightbox.refresh();
  smoothScrol();
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

function onSerchRefresh() {
  refs.contentSection.innerHTML = '';
  ImgLoadApi.resetPage();
}

// let infScroll = new InfiniteScroll(refs.contentSection, {
//   path: onSerch(),
//   append: onLoadMore(),
// });
