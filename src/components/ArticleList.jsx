import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loading } from "./Loading";
import { fetchArticles } from "../utils/api";
import '../ArticleList.css'
import { SingleArticle } from "./SingleArticle";

export const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchArticles(page)
        .then((returnedArticles) => {
            if (!returnedArticles.length) {
                setPage(1);
                fetchArticles(page);
                setIsLoading(false);
            } else {
                setArticles(returnedArticles);
                setIsLoading(false);
            }
        });
    }, [page]);

    return (
        <>
            {isLoading ? <Loading />
            :
            <>
            <div className="top-page">
                <h2 className="latest-news">Latest Articles:</h2>
                <div className="pages">
                    <button type="submit" onClick={() => {
                        {page > 1 ? setPage(page - 1) : null};
                    }}><i class="fa-solid fa-angle-left"></i> Previous
                    </button>
                    <p>{page}</p>
                    <button type="submit" onClick={() => {
                        setPage(page + 1);
                    }}>Next <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
            </div>
            <main className="landing-page">
                <ul>
                    {articles.map((article) => {
                        return (
                            <li className="article-card" key={article.article_id}>
                                <Link to={`/articles/${article.article_id}`} >
                                    <img className="article-img" src={article.article_img_url}></img>
                                    <h3 className="article-title">{article.title}</h3>
                                    <div className="article-details">
                                        <p className="posted-by">Posted by: {article.author}</p>
                                        <p className="comment-count"><i className="fa-regular fa-comment"></i> {article.comment_count}</p>
                                    </div>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </main>
            <button type="submit" onClick={() => {
                setPage(page + 1);
            }}>View More Articles <i className="fa-solid fa-angle-right"></i>
            </button>
            </>
            }
        </>
    );
}