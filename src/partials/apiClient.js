const axios = require('axios').default;

export default class ImgApi {
  constructor() {
    this.keyWord = '';
    this.KEY = '34887425-a2853bc4ede548f7d9a61ea19';
    this.BASE_URL = 'https://pixabay.com/api/';
    this.dataList = null;
    this.page = 1;
    this.totalHits = null;
  }

  async getImg() {
    const url = `${this.BASE_URL}?key=${this.KEY}&q=${this.keyWord}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
    return await axios.get(`${url}`);
  }

  async getDataList() {
    try {
      const response = await this.getImg(this.keyWord);
      this.incrementPage();
      this.totalHits = response.data.total;
      this.dataList = response.data.hits;
      return await this.filteredParms(this.dataList);

    } catch (error) {
      console.error(error);
    }
  }

  filteredParms() {
    return this.dataList.map(element => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = element;
      return {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      };
    });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
