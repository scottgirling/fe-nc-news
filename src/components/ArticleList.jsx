import { Link, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loading } from "./Loading";
import { fetchArticles } from "../utils/api";
import '../ArticleList.css'

export const ArticleList = () => {
    const { topic } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageQuery = searchParams.get("p");
    const sortByQuery = searchParams.get("sort_by");
    const orderQuery = searchParams.get("order");

    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    console.log(sortByQuery, "<--- sortByQuery")

    const setPage = (pageNumber) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("p", Number(pageNumber));
        setSearchParams(newParams);
    }

    const setSortBy = (sort_by) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("sort_by", sort_by)
        setSearchParams(newParams);
    }
    console.log(sortByQuery, "<--- sortbyquery")

    const setOrder = (order) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("order", order)
        setSearchParams(newParams);
    }
    
    useEffect(() => {
        setIsLoading(true);
        fetchArticles(topic, pageQuery, sortByQuery)
        .then((returnedArticles) => {
            if (!returnedArticles.length) {
                setPage(1);
                fetchArticles(topic, pageQuery);
            } else {
                setArticles(returnedArticles);
                setIsLoading(false);
            }
        });
    }, [topic, pageQuery, sortByQuery, orderQuery]);
    
    const handleChange = (event) => {
        console.log(event.target.value, "<--- event.target.value");
    }

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
            <div>
                <p>Sorting goes here</p>
                <form onSubmit={() => {
                    setSortBy(sort_by)
                    setOrder(order)
                }}>
                    <label htmlFor="sort_by">Sort by: </label>
                    <select
                        onChange={(event) => handleChange(event)}
                        name="sort_by"
                        id="sort_by"
                        defaultValue="none"
                    >
                        <option value="none" disabled hidden>
                            
                        </option>
                        <option value="created_at">Date</option>
                        <option value="comment_count">Comments</option>
                        <option value="votes">Votes</option>
                    </select>
                    <br />
                    <label htmlFor="order">Order: </label>
                    <select
                        onChange={(event) => handleChange(event)}
                        name="order"
                        id="order"
                        defaultValue="none"
                    >
                        <option value="none" disabled hidden>

                        </option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                    <br />
                    <input type="submit"></input>
                </form>
            </div>
            <main className="landing-page">
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