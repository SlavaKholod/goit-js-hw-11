const axios = require('axios').default;

// const options = {
//   headers: {
//     metod: 'GET',
//     'Access-Control-Allow-Origin': 'http://localhost:1234',
//     key: KEY,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     mode: 'no-cors',
//     q: keyWord,
//   },
// };

export default class ImgApi {
  constructor() {
    this.keyWord = '';
    this.KEY = '34887425-a2853bc4ede548f7d9a61ea19';
    this.BASE_URL = 'https://pixabay.com/api/';
    this.dataList = null;
    this.page = 1;
  }

  async getImg() {
    const url = `${this.BASE_URL}?key=${this.KEY}&q=${this.keyWord}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
    try {
      this.dataList = await axios
        .get(`${url}`)
        .then(response => {
          this.incrementPage();
          return response.data.hits
        });

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
  
  resetPage(){
    this.page =1;
  }
}
