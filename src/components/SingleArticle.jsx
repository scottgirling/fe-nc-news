import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchArticleById, updateArticleVotesIncrement, updateArticleVotesDecrement } from "../utils/api";
import { ArticleComments } from "./ArticleComments";
import '../SingleArticle.css';

export const SingleArticle = () => {
    const { article_id } = useParams();
    const [article, setArticle] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [voteCount, setVoteCount]= useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetchArticleById(article_id)
        .then((returnedArticle) => {
            setArticle(returnedArticle);
            setVoteCount(returnedArticle.votes)
            setIsLoading(false);
        });
    }, []);
    
    const handleVoteIncrement = () => {
        setVoteCount((currentVoteCount) => {
            return currentVoteCount + 1;
        });
        updateArticleVotesIncrement(article_id)
        .then(({ votes }) => {
            setVoteCount(votes);
            setHasVoted(true);
            setError(null);
        })
        .catch(() => {
            setVoteCount((currentVoteCount) => {
                return currentVoteCount - 1;
            })
            setError("Your vote was not successful. Please try again.");
        });
    }

    const handleVoteDecrement = () => {
        setVoteCount((currentVoteCount) => {
            return currentVoteCount - 1;
        });
        updateArticleVotesDecrement(article_id)
        .then(({ votes }) => {
            setVoteCount(votes);
            setHasVoted(false);
            setError(null);
        })
        .catch(() => {
            setVoteCount((currentVoteCount) => {
                return currentVoteCount + 1;
            })
            setError("Your vote was not successful. Please try again.");
        });
    }

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
                        <p className="comment-count-individual-article"><a href="#comments"><i className="fa-regular fa-comment"></i> {article.comment_count}</a></p>
                        <div className="article-vote">
                            {hasVoted ? <button onClick={() => {
                                return handleVoteDecrement();
                            }}><i className="fa-solid fa-heart"></i> {voteCount}</button>
                            :
                                <button onClick={() => {
                                    return handleVoteIncrement()
                                }}><i className="fa-regular fa-heart"></i> {voteCount}</button>
                            }
                        </div>
                            {error ? <p class="vote-error">{error}</p> : null}
                    </div>
                </div>
                <p className="article-body">{article.body}</p>
                <ArticleComments article_id={article_id} />
            </main>
            <Link to="/">
                <button className="back-to-articles-button">
                    <i className="fa-solid fa-chevron-left"></i> Back to Articles
                </button>
            </Link>
        </>
    );
}