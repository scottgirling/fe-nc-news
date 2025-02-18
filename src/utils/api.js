import axios from 'axios';

const newsApi = axios.create({
    baseURL: "https://be-nc-news-bsph.onrender.com/api/"
});

export const fetchArticles = (page) => {
    return newsApi.get(`articles?p=${page}`)
    .then((response) => {
        return response.data.articles;
    });
}

export const fetchTopics = () => {
    return newsApi.get("topics")
    .then((response) => {
        return response.data.topics;
    })
}