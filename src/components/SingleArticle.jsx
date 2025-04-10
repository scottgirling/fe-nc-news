import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchArticleById, updateArticleVotes } from "../utils/api";
import { ArticleComments } from "./ArticleComments";
import '../SingleArticle.css';
import { ErrorPage } from "./ErrorPage";
import { HandymanOutlined } from "@mui/icons-material";

export const SingleArticle = () => {
    const navigate = useNavigate();
    const { article_id } = useParams();
    const [article, setArticle] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [voteCount, setVoteCount]= useState(0);
    const [errorVoting, setErrorVoting] = useState(null);
    const [errorFindingArticle, setErrorFindingArticle] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetchArticleById(article_id)
        .then((returnedArticle) => {
            setArticle(returnedArticle);
            setVoteCount(returnedArticle.votes);
            setIsLoading(false);
        })
        .catch((error) => {
            setErrorFindingArticle(error.response.data.msg);
        });
    }, []);

    const handleNavigation = () => {
        navigate(-1);
    }

    const handleVote = (voteChange) => {
        setVoteCount((currentVoteCount) => {
            return currentVoteCount + voteChange;
        });
        updateArticleVotes(article_id, voteChange)
        .then(({ votes }) => {
            setVoteCount(votes);
            setErrorVoting(null);
        })
        .catch(() => {
            setVoteCount((currentVoteCount) => {
                return currentVoteCount - voteChange;
            })
            setHasVoted(hasVoted);
            setErrorVoting("Your vote was not successful. Please try again.");
        });
    }
    
    if (isLoading) {
        return (
            <p className="article-loading">Loading article...</p>
        );
    }

    if (errorFindingArticle) {
        return (
            <ErrorPage errorFindingArticle={errorFindingArticle}/>
        )
    }
    
    return (
        <>
            <div className="single-article">
                <div id="link-width">
                    <Link to="/">
                        <button 
                            className="back-to-articles-button"
                            onClick={handleNavigation}
                        >
                            <i className="fa-solid fa-chevron-left"></i> Back to Articles
                        </button>
                    </Link>
                </div>
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
                            <Link to={`/search/${article.topic}?p=1`}>
                                <p className="related-articles">View related {article.topic} articles <i className="fa-solid fa-angle-right"></i></p>
                            </Link>
                            <p className="comment-count-individual-article"><a href="#comments"><i className="fa-regular fa-comment"></i> {article.comment_count}</a></p>
                            <div className="article-vote">
                                {hasVoted ? ( 
                                    <button onClick={() => {
                                        setHasVoted(false);
                                        return handleVote(-1);
                                    }}><i className="fa-solid fa-heart"></i> {voteCount}</button>
                                ) : (
                                    <button onClick={() => {
                                        setHasVoted(true);
                                        return handleVote(1)
                                    }}><i className="fa-regular fa-heart"></i> {voteCount}</button>
                                )}
                            </div>
                                {errorVoting && <p class="vote-error">{errorVoting}</p>}
                        </div>
                    </div>
                    <p className="article-body">{article.body}</p>
                    <ArticleComments article_id={article_id} />
                </main>
                <div id="link-width">
                    <Link to="/">
                        <button className="back-to-articles-button-bottom">
                            <i className="fa-solid fa-chevron-left"></i> Back to Articles
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
}