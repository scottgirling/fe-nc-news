import axios from 'axios';

const newsApi = axios.create({
    baseURL: "https://be-nc-news-bsph.onrender.com/api/"
});

export const fetchArticles = (topic, p, sort_by, order) => {
    return newsApi.get("articles", { 
        params: {
            topic: topic,
            p: p,
            sort_by: sort_by,
            order: order
        }
    })
    .then((response) => {
        return response.data.articles;
    });
}

export const fetchArticleById = (article_id) => {
    return newsApi.get(`articles/${article_id}`)
    .then((response) => {
        return response.data.article;
    })
}

export const fetchTopics = () => {
    return newsApi.get("topics")
    .then((response) => {
        return response.data.topics;
    });
}

export const fetchCommentsByArticleId = (article_id) => {
    return newsApi.get(`articles/${article_id}/comments`)
    .then((response) => {
        return response.data.comments;
    });
}

export const updateArticleVotesIncrement = (article_id) => {
    return newsApi.patch(`articles/${article_id}`, { 
        inc_votes: 1
    })
    .then((response) => {
        return response.data.updatedArticle;
    })
}

export const updateArticleVotesDecrement = (article_id) => {
    return newsApi.patch(`articles/${article_id}`, { 
        inc_votes: -1
    })
    .then((response) => {
        return response.data.updatedArticle;
    });
}

export const addCommentByArticleId = (article_id, commentDetails) => {
    return newsApi.post(`articles/${article_id}/comments`, commentDetails)
    .then((response) => {
        return response.data.newComment;
    });
}

export const fetchUsers = () => {
    return newsApi.get("users")
    .then((response) => {
        return response.data.users;
    })
}

export const deleteCommentByCommentId = (comment_id) => {
    return newsApi.delete(`comments/${comment_id}`);
}