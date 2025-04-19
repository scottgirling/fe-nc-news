import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchArticleById, updateArticleVotes, fetchUsers, deleteArticle } from "../utils/api";
import { ArticleComments } from "./ArticleComments";
import '../SingleArticle.css';
import { ErrorPage } from "./ErrorPage";
import { UserAccount } from "../contexts/UserAccount";

export const SingleArticle = () => {
    const { loggedInUser } = useContext(UserAccount);
    const navigate = useNavigate();
    const { article_id } = useParams();
    const [article, setArticle] = useState({});
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [prepArticleDelete, setPrepArticleDelete] = useState(false);
    const [articleIsDeleting, setArticleIsDeleting] = useState(false);
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
        .then(() => {
            fetchUsers()
            .then((returnedUsers) => {
                setUsers(returnedUsers);
            })
        })
        .catch((error) => {
            setErrorFindingArticle(error.response.data.msg);
        });
    }, []);

    const handleNavigation = () => {
        navigate(-1);
    }

    const handleDeleteArticle = (article_id) => {
        setArticleIsDeleting(true);
        deleteArticle(article_id)
        .then(() => {
            alert("Successfully deleted article");
            setArticleIsDeleting(false);
            navigate(-1);
        });
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
        )
    }

    if (articleIsDeleting) {
        return (
            <p className="article-deleting">Deleting article...</p>
        )
    }

    if (errorFindingArticle) {
        return (
            <ErrorPage errorFindingArticle={errorFindingArticle}/>
        )
    }
    
    return (
        <article className="single-article">
            <section id="link-width">
                <Link to="/"
                    className="back-to-articles-button"
                    onClick={handleNavigation}
                >
                    <i className="fa-solid fa-chevron-left"></i> Back to Articles
                </Link>
            </section>
            <section>
                <h1 className="article-title-individual-article">{article.title}</h1>
                <img src={article.article_img_url} alt="Associated article image"/>
                <section className="article-info">
                    <section className="article-info-left">
                        <p className="posted-by-individual-article">Posted by:</p>
                        <section className="article-author-pic-username">
                            {users.map((user) => {
                                return (
                                    user.username === article.author && (
                                        <img className="author-pic" src={user.avatar_url} alt="Article author profile picture"/>
                                    )
                                )
                            })}
                            <p>{article.author}</p>
                        </section>
                        <p className="date-posted">{new Date(article.created_at).toDateString()}</p>
                    </section>
                    <section>
                        <Link to={`/search/${article.topic}?p=1`}>
                            <p className="related-articles">View related {article.topic} articles <i className="fa-solid fa-angle-right"></i></p>
                        </Link>
                        <p className="comment-count-individual-article"><a href="#comments" aria-label="View article comments"><i className="fa-regular fa-comment"></i> {article.comment_count}</a></p>
                        <section className="article-vote">
                            {hasVoted ? ( 
                                <button onClick={() => {
                                    setHasVoted(false);
                                    return handleVote(-1);
                                }}>
                                    <i className="fa-solid fa-heart"></i> {voteCount}
                                </button>
                            ) : (
                                <button onClick={() => {
                                    setHasVoted(true);
                                    return handleVote(1)
                                }}>
                                    <i className="fa-regular fa-heart"></i> {voteCount}
                                </button>
                            )}
                        </section>
                        <section className="delete-article-section">
                            {loggedInUser && loggedInUser.username === article.author && (
                                <button 
                                    className="delete-article"
                                    onClick={() => {
                                        setPrepArticleDelete(true);
                                    }}
                                >
                                    <i className="fa-solid fa-trash-can"></i> Delete Article
                                </button>
                            )}
                            {prepArticleDelete && (
                                <section>
                                    <p className="safety-message">Are you sure you want to delete this article?</p>
                                    <button 
                                        className="confirm-delete-button-article-no"
                                        onClick={() => {
                                            setPrepArticleDelete(false);
                                        }}
                                    >
                                        No
                                    </button>
                                    <button 
                                        className="confirm-delete-button-article"
                                        onClick={() => {
                                            handleDeleteArticle(article_id)
                                        }}
                                    >
                                        Yes
                                    </button>
                                </section>
                            )}
                        </section>
                        {errorVoting && <p className="vote-error">{errorVoting}</p>}
                    </section>
                </section>
                <section>
                    <p className="article-body">{article.body}</p>
                </section>
                <ArticleComments article_id={article_id} commentCount={article.comment_count}/>
            </section>
            <section id="link-width">
                <Link to="/"
                    className="back-to-articles-button-bottom"
                    onClick={handleNavigation}
                >
                    <i className="fa-solid fa-chevron-left"></i> Back to Articles
                </Link>
            </section>
        </article>
    )
}