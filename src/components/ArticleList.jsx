import { Link, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loading } from "./Loading";
import { fetchArticles } from "../utils/api";
import '../ArticleList.css'
import { ErrorPage } from "./ErrorPage";

export const ArticleList = () => {
    const { topic } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageQuery = searchParams.get("p");
    const sortByQuery = searchParams.get("sort_by");
    const orderQuery = searchParams.get("order");

    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorFindingTopic, setErrorFindingTopic] = useState(null);

    const setPage = (pageNumber) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("p", Number(pageNumber));
        setSearchParams(newParams);
    }

    const setSortBy = (sort_by) => {
        console.log(sort_by)
        const newParams = new URLSearchParams(searchParams);
        newParams.set("sort_by", sort_by)
        setSearchParams(newParams);
    }
    
    const setOrderBy = (order) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("order", order)
        setSearchParams(newParams);
    }

    useEffect(() => {
        setIsLoading(true);
        fetchArticles(topic, pageQuery, sortByQuery, orderQuery)
        .then((returnedArticles) => {
            if (!returnedArticles.length) {
                setPage(1);
                fetchArticles(topic, pageQuery);
            } else {
                setArticles(returnedArticles);
                setIsLoading(false);
            }
        })
        .catch((error) => {
            setErrorFindingTopic(error.response.data.msg);
        });
    }, [topic, pageQuery, sortByQuery, orderQuery]);

    if (errorFindingTopic) {
        return (
            <ErrorPage errorFindingTopic={errorFindingTopic} />
        )
    }

    return (
        <>
            {isLoading ? <Loading />
            :
            <>
                <div className="sort-articles">
                    {/* <p className="sort-articles-title">Sort Articles:</p> */}
                    <form>
                        {/* <div className="sort-by-articles">
                            <p>Sort by:</p>
                            <label htmlFor="sort_by">Date created</label>
                            <input 
                                onClick={(event) => setSortBy(event.target.value)}
                                type="radio" value="created_at" id="sort_by" name="sort_by"/>
                            <br />
                            <label htmlFor="sort_by">Vote count</label>
                            <input 
                                onClick={(event) => setSortBy(event.target.value)}
                                type="radio" value="votes" id="sort_by" name="sort_by"/>
                            <br />
                        </div> */}
                        {/* <div className="order-by-articles">
                            <p>Order:</p>
                            <label htmlFor="order">Ascending</label>
                            <input 
                                onClick={(event) => setOrderBy(event.target.value)}
                                type="radio" value="asc" id="order" name="order"/>
                            <br />
                            <label htmlFor="order">Descending</label>
                            <input 
                                onClick={(event) => setOrderBy(event.target.value)}
                                type="radio" value="desc" id="order" name="order"/>
                        </div> */}
                        <div className="sort-by-articles">
                            <label htmlFor="sort_by">
                                Sort by:
                            </label>
                            <select
                                value={sortByQuery}
                                onChange={(event) => {
                                    setSortBy(event.target.value);
                                }}
                            >
                                <option hidden>
                                    
                                </option>
                                <option 
                                    value="created_at"
                                >
                                    Date Created
                                </option>
                                <option 
                                    value="votes"
                                >
                                    Vote Count
                                </option>
                            </select>
                            <br></br>

                            <label htmlFor="order-by">
                                Order by:
                            </label>
                            <select
                                value={orderQuery}
                                onChange={(event) => {
                                    setOrderBy(event.target.value);
                                }}
                            >
                                <option hidden>
                                </option>
                                <option value="desc">
                                    Descending
                                </option>
                                <option value="asc">
                                    Ascending
                                </option>
                            </select>
                        </div>
                    </form>
                </div>

                <div className="top-page">
                    <div>
                        <>
                            {sortByQuery ? (
                                sortByQuery === "votes" ? (
                                    <>
                                        <h2 className="latest-news">{topic ? topic[0].toUpperCase() + topic.slice(1) : null} Articles by Vote Count</h2>
                                        {orderQuery ? (
                                            <p className="order-query-identifier">in {orderQuery} order</p>
                                        ) : null}
                                    </>
                                ) : (
                                    <>
                                        <h2 className="latest-news">{topic ? topic[0].toUpperCase() + topic.slice(1) : null} Articles by Date Created</h2>
                                        {orderQuery ? (
                                            <p className="order-query-identifier">in {orderQuery} order</p>
                                        ) : null}
                                    </>
                                )
                            ) : orderQuery ? (
                                <>
                                    <h2 className="latest-news">Articles by Date Created</h2>
                                    {orderQuery ? (
                                        <p className="order-query-identifier">in {orderQuery} order</p>
                                    ) : null}
                                </>
                            ) : null}
                            {!sortByQuery && !orderQuery ? (
                                <h2 className="latest-news">Lastest {topic ? topic[0].toUpperCase() + topic.slice(1) : null} Articles</h2>
                            ) : null}
                        </>
                    </div>

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
                }}>
                    View More Articles <i className="fa-solid fa-angle-right"></i>
                </button>
            </>}
        </>
    );
}