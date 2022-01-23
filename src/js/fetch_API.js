import axios from "axios";

axios.defaults.baseURL = "https://pixabay.com/api/";
    const API_KEY = "25337579-f9c9c008ee647e32b41f56e51";
    const perPage = 40;

export default class ApiServise { 
    constructor() {
        this.searchValue = '';
        this.page = 1;
    }
    
    async getImages() {
        const response = await axios.get(`?key=${API_KEY}&q=${this.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${perPage}`);
        return response;
    }
    
    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
    
    get searchQuery() {
        return this.searchValue;
    }

    set searchQuery(newSearchQuery) {
        this.searchValue = newSearchQuery;
    }
} 