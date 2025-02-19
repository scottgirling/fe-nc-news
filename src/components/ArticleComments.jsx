import { useState, useEffect } from "react"
import { addCommentByArticleId, fetchCommentsByArticleId } from "../utils/api";
import '../ArticleComments.css'

export const ArticleComments = ({ article_id }) => {
    const [comments, setComments] = useState([]);
    const [commentBox, setCommentBox] = useState(false);
    const [commentDetails] = useState({
        username: "",
        body: ""
    });
    const [newCommentIsLoading, setNewCommentIsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
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
        console.log(commentDetails, "<--- commentDetails")
    }

    const handleSubmitComment = (event) => {
        setNewCommentIsLoading(true);
        event.preventDefault();
        addCommentByArticleId(article_id, commentDetails)
        .then(() => {
            setCommentBox(!commentBox);
            setNewCommentIsLoading(false);
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
                {commentBox ? 
                    <>
                        <form onSubmit={(event) => handleSubmitComment(event)}>
                            <label htmlFor="username">Username: </label>
                                <select
                                onBlur={(event) => handleCommentBody(event)}
                                name="username"
                                id="username"
                                defaultValue="none"
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
                                </li>
                            )
                        })}
                    </ul>
                }
            
            </>}
        </>
    )
}