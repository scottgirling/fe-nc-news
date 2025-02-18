import { useState, useEffect } from "react"
import { fetchCommentsByArticleId } from "../utils/api";
import '../ArticleComments.css'

export const ArticleComments = ({ article_id }) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchCommentsByArticleId(article_id)
        .then((returnedComments) => {
            setComments(returnedComments);
            setIsLoading(false);
        });
    }, []);

    return (
        <>
            <div id="comments" className="comments-top">
                <p className="comments-title">Comments</p>
                <p className="comments-number">{comments.length}</p>
            </div>
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
        </>
    )
}