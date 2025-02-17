import { useState, useEffect } from "react";
import { fetchArticles } from "../utils/api";
import '../ArticleList.css'
import { Loading } from "./Loading";

export const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchArticles()
        .then((returnedArticles) => {
            setArticles(returnedArticles);
            setIsLoading(false)
        });
    }, []);

    return (
        <>
            {isLoading ? <Loading />
            :
            <>
            <h2 className="latest-news">Latest Articles:</h2>
            <main className="landing-page">
                <ul>
                    {articles.map((article) => {
                        return (
                            <li className="article-card" key={article.article_id}>
                                <img className="article-img" src={article.article_img_url}></img>
                                <h3 className="article-title">{article.title}</h3>
                                <div className="article-details">
                                    <p className="posted-by">Posted by: {article.author}</p>
                                    <p className="comment-count"><i className="fa-regular fa-comment"></i> {article.comment_count}</p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </main>
            </>
            }
        </>
    );
}