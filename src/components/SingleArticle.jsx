import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { fetchArticleById } from "../utils/api";
import '../SingleArticle.css';

export const SingleArticle = () => {
    const { article_id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [article, setArticle] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const pageQuery = searchParams.get("p");

    console.log(pageQuery)

    useEffect(() => {
        setIsLoading(true);
        fetchArticleById(article_id)
        .then((returnedArticle) => {
            setArticle(returnedArticle);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <p>Loading article...</p>
        );
    }

    return (
        <>
            <Link to="/">
                <button className="back-to-articles-button">
                    <i className="fa-solid fa-chevron-left"></i> Back to Articles
                </button>
            </Link>
            <main>
                <h2 className="article-title-individual-article">{article.title}</h2>
                <img src={article.article_img_url}></img>
                <div className="article-info">
                    <div>
                        <p className="posted-by-individual-article">Posted by:</p>
                        <p className="author">{article.author}</p>
                        <p className="date-posted">{new Date(article.created_at).toDateString()}</p>
                    </div>
                    <div>
                        <p className="related-articles">View related {article.topic} articles <i className="fa-solid fa-angle-right"></i></p>
                        <p className="comment-count-individual-article"><i className="fa-regular fa-comment"></i> {article.comment_count}</p>
                    </div>
                </div>
                <p className="article-body">{article.body}</p>
            </main>
            <Link to="/">
                <button className="back-to-articles-button">
                    <i className="fa-solid fa-chevron-left"></i> Back to Articles
                </button>
            </Link>
        </>
    );
}