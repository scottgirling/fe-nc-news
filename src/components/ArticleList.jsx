import { Link, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loading } from "./Loading";
import { fetchArticles } from "../utils/api";
import '../ArticleList.css'

export const ArticleList = () => {
    const { topic } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageQuery = searchParams.get("p");

    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const setPage = (pageNumber) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("p", Number(pageNumber));
        setSearchParams(newParams);
    }

    useEffect(() => {
        setIsLoading(true);
        fetchArticles(topic, pageQuery)
        .then((returnedArticles) => {
            if (!returnedArticles.length) {
                setPage(1);
                fetchArticles(topic, pageQuery);
            } else {
                setArticles(returnedArticles);
                setIsLoading(false);
            }
        });
    }, [topic, pageQuery]);

    return (
        <>
            {isLoading ? <Loading />
            :
            <>
            <div className="top-page">
                <h2 className="latest-news">Latest Articles:</h2>
                <div className="pages">
                    <button type="submit" onClick={() => {
                        {pageQuery > 1 ? setPage(Number(pageQuery) - 1) : null};
                    }}><i className="fa-solid fa-angle-left"></i> Previous
                    </button>
                    <p>{pageQuery || 1}</p>
                    <button type="submit" onClick={() => {
                            {!pageQuery ? (
                                setPage(Number(pageQuery) + 2) 
                            ) : (
                                setPage(Number(pageQuery) + 1)
                            )};
                        }
                    }>Next <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
            </div>
            <main className="landing-p">
                <ul>
                    {articles.map((article) => {
                        return (
                            <li className="article-card" key={article.article_id}>
                                <Link to={`/articles/${article.article_id}`}>
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
                setPage(Number(pageQuery) + 1);
            }}>View More Articles <i className="fa-solid fa-angle-right"></i>
            </button>
            </>
            }
        </>
    );
}