import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ImgApi from './partials/apiClient';
import refs from './partials/refs';
import markupTemplate from './partials/card.hbs';
import { throttle } from 'throttle-debounce';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ImgLoadApi = new ImgApi();

var lightbox = new SimpleLightbox('.gallery__link', {
  captionSelector: 'img',
  captionType: 'attr',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onSerch);
// refs.loadMore.addEventListener('click', onLoadMore);

async function onSerch(event) {
  event.preventDefault();
  onSerchRefresh();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  ImgLoadApi.keyWord = searchQuery.value.trim();

  if (ImgLoadApi.keyWord === '') {
    // refs.loadMore.style.visibility = 'hidden';
    Notify.info('Please input some request');
    return;
  }

  try {
    const data = await ImgLoadApi.getDataList(ImgLoadApi.keyWord);
    if (data.length === 0) {
      // refs.loadMore.style.visibility = 'hidden';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      addMarkup(data);
      Notify.info(`Hooray! We found ${ImgLoadApi.totalHits} images.`);
      if (data.length === 40) {
        // refs.loadMore.style.visibility = 'visible';
      }
    }
    refs.searchForm.reset();
  } catch (error) {
    console.error(error);
  }
}

async function onLoadMore() {
  try {
    console.log('onLoadMore');
    const data = await ImgLoadApi.getDataList();
    addMarkup(data);
    if (data.length < 40) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      // refs.loadMore.style.visibility = 'hidden';
    }
  } catch (error) {
    console.error(error);
  }
}

function addMarkup(data) {
  data.map(element => {
    const markup = markupTemplate(element);
    refs.contentSection.insertAdjacentHTML('beforeend', markup);
  });
  lightbox.refresh();
  AOS.refresh();
  smoothScrol();
}

function smoothScrol() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1.5,
    behavior: 'smooth',
  });
}

function onSerchRefresh() {
  refs.contentSection.innerHTML = '';
  ImgLoadApi.resetPage();
}

window.addEventListener(
  'scroll',
  throttle(
    500,
    () => {
      console.log('crhjk');
      const documentRect = document.documentElement.getBoundingClientRect();
      if (documentRect.bottom < document.documentElement.clientHeight + 300) {
        onLoadMore();
      }
    },
    250
  )
);

// You can also pass an optional settings object
// below listed default settings
AOS.init({
  // Global settings:
  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
  initClassName: 'aos-init', // class applied after initialization
  animatedClassName: 'aos-animate', // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 50, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 400, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
});
