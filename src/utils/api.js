import axios from 'axios';

const newsApi = axios.create({
    baseURL: "https://be-nc-news-bsph.onrender.com/api/"
});

export const fetchArticles = () => {
    return newsApi.get("articles")
    .then((response) => {
        return response.data.articles;
    });
}