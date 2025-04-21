import { Link, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loading } from "./Loading";
import { fetchAllArticles, fetchArticles } from "../utils/api";
import '../ArticleList.css'
import { ErrorPage } from "./ErrorPage";
import { Box, FormControl, InputLabel, Select, MenuItem, Stack, Pagination } from "@mui/material";

export const ArticleList = () => {
    const { topic } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageQuery = searchParams.get("p");
    const sortByQuery = searchParams.get("sort_by");
    const orderQuery = searchParams.get("order");

    const [articles, setArticles] = useState([]);
    const [totalNumberOfArticles, setTotalNumberOfArticles] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorFindingTopic, setErrorFindingTopic] = useState(null);

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
    
    const setOrderBy = (order) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("order", order)
        setSearchParams(newParams);
    }

    useEffect(() => {
        setIsLoading(true);
        fetchAllArticles(topic)
        .then((returnedArticles) => {
            setTotalNumberOfArticles(returnedArticles.length);
        })
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

    const handleChange = (event) => {
        if (pageQuery === null && event.target.innerHTML === "<path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path>") {
            setPage(Number(pageQuery) + 2)
        } else if (pageQuery !== null && (event.target.innerHTML === "<path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path>" || event.target.outerHTML === "<path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path>")) {
            setPage(Number(pageQuery) + 1)
        } else if (event.target.innerHTML === "<path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"></path>") {
            setPage(Number(pageQuery) - 1)
        } else if (event.target.innerText !== "" && event.target.innerHTML !== "") {
            setPage(Number(event.target.innerText));
        }
    } 

    if (errorFindingTopic) {
        return (
            <ErrorPage errorFindingTopic={errorFindingTopic} />
        )
    }

    return (
        <main>
            {isLoading ? (
                <Loading />
            ) : (
                <section>
                    <section className="top-page">
                        <section className="sort-and-order-by">
                            {sortByQuery ? (
                                sortByQuery === "votes" ? (
                                    <>
                                        <h1 className="latest-news">{topic && topic[0].toUpperCase() + topic.slice(1)} Articles by Vote Count</h1>
                                        {orderQuery && (
                                            <p className="order-query-identifier">in {orderQuery} order</p>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <h1 className="latest-news">{topic && topic[0].toUpperCase() + topic.slice(1)} Articles by Date Posted</h1>
                                        {orderQuery && (
                                            <p className="order-query-identifier">in {orderQuery} order</p>
                                        )}
                                    </>
                                )
                            ) : orderQuery && (
                                <>
                                    <h1 className="latest-news">Articles by Date Created</h1>
                                    {orderQuery && (
                                        <p className="order-query-identifier">in {orderQuery} order</p>
                                    )}
                                </>
                            )}
                            <section>
                                {!sortByQuery && !orderQuery && (
                                    <h2 className="latest-news">Latest {topic && topic[0].toUpperCase() + topic.slice(1)} Articles</h2>
                                )}
                            </section>
                        </section>

                        <Box className="mui-sort-articles" sx={{ minWidth: 120, m: "1rem",  }}>
                            <FormControl 
                                sx={{ width: "10rem", mr: ".5rem" }}>
                                <InputLabel 
                                    id="demo-simple-select-label"
                                >
                                    Sort By
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={sortByQuery}
                                    label="Sort By"
                                    onChange={(event) => {
                                        setSortBy(event.target.value);
                                    }}
                                >
                                    <MenuItem 
                                        value="created_at"
                                    >
                                        Date Posted
                                    </MenuItem>
                                    <MenuItem 
                                        value="votes"
                                    >
                                        Vote Count
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl 
                                sx={{ width: "10rem", ml: ".5rem"}}>
                                <InputLabel 
                                    id="demo-simple-select-label"
                                >
                                    Order By
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={orderQuery}
                                    label="Order By"
                                    onChange={(event) => {
                                        setOrderBy(event.target.value);
                                    }}
                                    >
                                    <MenuItem 
                                        value="asc"
                                    >
                                        Ascending
                                    </MenuItem>
                                    <MenuItem 
                                        value="desc"
                                    >
                                        Descending
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </section>

                    <article className="landing-page">
                        <ul>
                            {articles.map((article) => {
                                return (
                                    <li className="article-card" key={article.article_id}>
                                        <Link to={`/articles/${article.article_id}`}>
                                            <img className="article-img" src={article.article_img_url} alt="Associated article image"/>
                                            <h3 className="article-title">{article.title}</h3>
                                            <section className="article-details">
                                                <section className="author-and-date">
                                                    <p className="posted-by">Posted by: {article.author}</p>
                                                    <p className="date-posted-single">Date posted: {new Date(article.created_at).toDateString()}</p>
                                                </section>
                                                <section>
                                                    <p className="vote-count"><i className="fa-regular fa-heart"></i> {article.votes}</p>
                                                    <p className="comment-count"><i className="fa-regular fa-comment"></i> {article.comment_count}</p>
                                                </section>
                                            </section>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </article>

                    <Stack>
                        <Pagination
                            count={(Math.ceil(totalNumberOfArticles / 12))}
                            page={Number(pageQuery) || 1}
                            shape="rounded"
                            onChange={(event) => handleChange(event)}
                            sx={{ border: "none", mt: "2rem", width: "65vw", "& > *": {  justifyContent: "center" } }}
                        />
                    </Stack>
                </section>
            )}
        </main>
    )
}