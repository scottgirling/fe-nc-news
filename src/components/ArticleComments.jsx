import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom";
import { addCommentByArticleId, fetchCommentsByArticleId, deleteCommentByCommentId } from "../utils/api";
import '../ArticleComments.css'
import { UserAccount } from "../contexts/UserAccount";

export const ArticleComments = ({ article_id }) => {
    const { loggedInUser } = useContext(UserAccount);
    const [comments, setComments] = useState([]);
    const [commentBox, setCommentBox] = useState(false);
    const [commentDetails] = useState({
        username: "",
        body: ""
    });
    const [newCommentIsLoading, setNewCommentIsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [commentIsDeleting, setCommentIsDeleting] = useState(false);
    const [errorPostingComment, setErrorPostingComment] = useState(null);

    useEffect(() => {
        fetchCommentsByArticleId(article_id)
        .then((returnedComments) => {
            setComments(returnedComments);
            setIsLoading(false);
        });
    }, [comments]);

    const handleCommentBox = () => {
        setCommentBox(!commentBox)
    }

    const handleCommentBody = (event) => {
        for (const key in commentDetails) {
            if (key === event.target.name) {
                commentDetails[key] = event.target.value;
            }
        }
    }
    
    const handleSubmitComment = (event) => {
        setNewCommentIsLoading(true);
        event.preventDefault();
        addCommentByArticleId(article_id, commentDetails)
        .then(() => {
            setCommentBox(!commentBox);
            setNewCommentIsLoading(false);
        })
        .catch((error) => {
            setErrorPostingComment(error.response.data.msg);
        });
    }

    if (errorPostingComment) {
        return (
            <>
                <p>Error posting your comment. Please refresh the page, ensure all fields are filled in and try again.</p>
                <Link to={`/articles/${article_id}`}>
                    <button onClick={() => {
                        window.location.reload();
                    }}>Refresh</button>
                </Link>
            </>
        )
    }

    const handleClick = (comment) => {
        setSelectedCommentId(comment.comment_id)
    }


    const handleDelete = () => {
        setCommentIsDeleting(true);
        deleteCommentByCommentId(selectedCommentId)
        .then(() => {
            alert("Successfuly deleted comment");
            setCommentIsDeleting(false);
        });
    }

    return (
        <>
            <div id="comments" className="comments-top">
                <p className="comments-title">Comments</p>
                <p className="comments-number">{comments.length}</p>
                <button onClick={() => {
                    return handleCommentBox();
                    }
                } className="post-comment-button"><i className="fa-regular fa-comment"></i> {commentBox ? <p>View Comments</p> : <p>Post Comment</p>} </button>
            </div>
            
            {newCommentIsLoading ? <p>Your comment is being uploaded...</p>
            : 
            <>
                {isLoading ? (
                    <p>Loading comments...</p>
                    ) : (
                    commentBox ? 
                        <>
                        <form onSubmit={(event) => handleSubmitComment(event)}>
                            <label htmlFor="username">Username: </label>
                            <select
                                onBlur={(event) => handleCommentBody(event)}
                                name="username"
                                id="username"
                                defaultValue="none"
                                required
                            >
                                <option value="none" disabled hidden>
                                Select a username
                                </option>
                                <option value="cooljmessy">cooljmessy</option>
                                <option value="weegembump">weegembump</option>
                                <option value="tickle122">tickle122</option>
                                <option value="happyamy2016">happyamy2016</option>
                                <option value="jessjelly">jessjelly</option>
                                </select>
                            <br />
                            <label htmlFor="body"></label>
                                <input
                                type="textarea"
                                name="body"
                                id="body"
                                className="comment-box"
                                placeholder="Add comment..."
                                required
                                onBlur={(event) => handleCommentBody(event)}
                                >
                            </input>
                            <br />
                            <input className="comment-submit-button" type="submit"></input>
                        </form>
                        </>
                        :
                        <ul>
                            {comments.map((comment) => {
                            return (
                                <li className="comment-card" key={comment.comment_id}>
                                    <div className="comment-details">
                                        <p className="comment-avatar"><i className="fa-solid fa-user"></i></p>
                                        <p className="comment-author">{comment.author}</p>
                                        <p className="comment-date">{new Date(comment.created_at).toDateString()}</p>
                                    </div>
                                    <p className="comment-body">{comment.body}</p>
                                    <div className="comment-vote">
                                        <p><i className="fa-solid fa-thumbs-up"></i></p>
                                        <p className="comment-votes">{comment.votes}</p>
                                        <p><i className="fa-solid fa-thumbs-down"></i></p>
                                    </div>
                                    <div>
                                        {loggedInUser ? (
                                            loggedInUser.username === comment.author ? (
                                                <button onClick={() => { 
                                                    handleClick(comment)
                                                }
                                            } className="delete-comment-button">Delete Comment <i className="fa-solid fa-trash-can"></i></button>
                                        ) : null
                                    ) : null}
                                        {loggedInUser ? (
                                            loggedInUser.username === comment.author && selectedCommentId === comment.comment_id ? (
                                                commentIsDeleting ? (
                                                    <p>Deleting comment...</p>
                                                ) : (
                                                    <>
                                                        {commentIsDeleting ? (
                                                            <p>Deleting comment...</p>
                                                        ) : (
                                                            <>
                                                                <p className="safety-message">Are you sure you want to delete this comment?</p>
                                                                <button className="confirm-delete-button" onClick={() => handleDelete()}>Yes</button>
                                                            </>
                                                        )}
                                                    </>
                                                )
                                            ) : null
                                        ) : null}
                                    </div>
                                </li>
                            )
                            })}
                        </ul>
                    )
            }
            </>}
        </>
    )
}