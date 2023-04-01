import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImgApi from './apiClient';
import refs from './refs';
// app.set('view engine', 'hbs');
import markupTemplate from './partials/card.hbs';

// const axios = require('axios/dist/node/axios.cjs');
const ImgLoadApi = new ImgApi();

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
    console.log(data);
    if (data.length === 0) {
      refs.loadMore.style.visibility = 'hidden';
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      addMarkup(data);
      refs.loadMore.style.visibility = 'visible';
    }
  });

  refs.searchForm.reset();
}

function onLoadMore() {
  ImgLoadApi.getImg().then(data => {
    console.log('loading');
    addMarkup(data);
  });
}

function addMarkup(data) {
  data.map(element => {
    const markup = markupTemplate(element);
    refs.contentSection.insertAdjacentHTML('beforeend', markup);
  });
}

function clearMarkup() {
  refs.contentSection.innerHTML = '';
}

