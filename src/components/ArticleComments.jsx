import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom";
import { addCommentByArticleId, fetchCommentsByArticleId, deleteCommentByCommentId, fetchUsers, updateCommentVotes } from "../utils/api";
import '../ArticleComments.css'
import { UserAccount } from "../contexts/UserAccount";
import { Box, TextField, Button, Tooltip } from "@mui/material";

export const ArticleComments = ({ article_id }) => {
    const { loggedInUser } = useContext(UserAccount);
    const [comments, setComments] = useState([]);
    const [commentBox, setCommentBox] = useState(false);
    const [commentDetails] = useState({
        username: "",
        body: ""
    });
    const [users, setUsers] = useState([]);
    const [newCommentIsLoading, setNewCommentIsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [commentIsDeleting, setCommentIsDeleting] = useState(false);
    const [errorPostingComment, setErrorPostingComment] = useState(null);
    const [commentVoteCount, setCommentVoteCount] = useState(0);
    const [errorCommentVoting, setErrorCommentVoting] = useState(null);
    const [commentToBeUpdated, setCommentToBeUpdated] = useState({});
    const [charCount, setCharCount] = useState(0);
    const maxCharCount = 140;

    useEffect(() => {
        fetchCommentsByArticleId(article_id)
        .then((returnedComments) => {
            setComments(returnedComments);
        })
        .then(() => {
            fetchUsers()
            .then((returnedUsers) => {
                setUsers(returnedUsers);
            })
        });
        setIsLoading(false);
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
        if (loggedInUser) {
            commentDetails.username = loggedInUser.username;
        }
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
                <p>Error posting your comment. Please refresh the page, ensure you are logged in and try again.</p>
                <Link to={`/articles/${article_id}`}>
                    <button onClick={() => {
                        window.location.reload();
                    }}>
                        Refresh
                    </button>
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

    const disableSubmitButton = () => {
        let isSubmitCommentButtonDisabled;
    
        if (commentDetails.body.length < 1) {
            isSubmitCommentButtonDisabled = true;
        } else {
            isSubmitCommentButtonDisabled = false;
        }

        return isSubmitCommentButtonDisabled;
    }

    const handleCommentVote = (comment, voteChange) => {
        setCommentToBeUpdated(comment);
        updateCommentVotes(comment.comment_id, voteChange)
        .then(( { votes }) => {
            setCommentVoteCount(votes);
            setErrorCommentVoting(null);
        })
        .catch(() => {
            setCommentVoteCount((currentCommentVoteCount) => {
                return currentCommentVoteCount - voteChange;
            })
            setErrorCommentVoting("Your vote was not successful. Please try again.")
        });
    }

    return (
        <>
            <div id="comments" className="comments-top">
                <p className="comments-title">Comments</p>
                <p className="comments-number">{comments.length}</p>
                {loggedInUser ? (
                    <Button 
                        variant="outlined"
                        sx={{ m: "auto", mr: 0, color: "#213547", borderColor: "#213547", padding: "0 1rem", borderRadius: "8px", textTransform: "none", ":hover": { backgroundColor: "#213547", color: "white", borderColor: "#213547", transition: "none" } }}
                        onClick={() => {
                            return handleCommentBox();
                        }}
                    >
                        <i className="fa-regular fa-comment"></i>
                        {commentBox ? (
                            <p>View Comments</p> 
                        ) : (
                            <p>Post Comment</p>
                        )}
                    </Button>
                ) : (
                    <Tooltip arrow title="Sign in to post a comment">
                        <Button
                            variant="outlined"
                            sx={{ m: "auto", mr: 0, color: "#213547", borderColor: "#213547", padding: "0 1rem", borderRadius: "8px", opacity: "50%", textTransform: "none", ":hover": { borderColor: "#213547" } }}
                        >
                            <i className="fa-regular fa-comment"></i><p>Post Comment</p>
                        </Button>
                    </Tooltip>
                )}
            </div>
            
            {newCommentIsLoading ? <p>Your comment is being uploaded...</p>
            : 
            <>
                {isLoading ? (
                    <p>Loading comments...</p>
                    ) : (
                    commentBox ? 
                        <>
                        <Box sx={{ mt: "1rem"}}>
                            <TextField 
                                id="outlined-basic"
                                name="body"
                                label="Post a comment..." 
                                variant="outlined"
                                sx={{ width: "50vw" }}
                                slotProps={{ htmlInput: { maxLength: 140 } }}
                                multiline
                                helperText={`${maxCharCount - charCount} characters remaining`}
                                onChange={(event) => {
                                    handleCommentBody(event);
                                    setCharCount(event.target.value.length)
                                }}
                            />
                            <Button 
                                variant="contained"
                                sx={{ m: 1.25, bgcolor: "#213547" }}
                                disabled={disableSubmitButton()}
                                onClick={(event) => {
                                    handleSubmitComment(event)
                                }}
                            >
                                Submit
                            </Button>
                        </Box>
                        </>
                        :
                        <>
                        {!comments.length ? (
                            <p>There are no comments yet. Why don't you write one?</p>
                        ) : (
                            <ul>
                                {comments.map((comment) => {
                                return (
                                    <li className="comment-card" key={comment.comment_id}>
                                        <div className="comment-details">
                                            {users.map((user) => {
                                                return (
                                                    user.username === comment.author && (
                                                        <img src={user.avatar_url}></img>
                                                    )
                                                )
                                            })}
                                            <p className="comment-author">{comment.author}</p>
                                            <p className="comment-date">{new Date(comment.created_at).toDateString()}</p>
                                        </div>
                                        <p className="comment-body">{comment.body}</p>
                                        <div className="comment-vote">
                                            <button onClick={() => {
                                                setCommentVoteCount(comment.votes + 1)
                                                handleCommentVote(comment, 1)
                                            }}><i className="fa-solid fa-thumbs-up"></i></button>
                                                {commentToBeUpdated.comment_id === comment.comment_id ? (
                                                    <p>{commentVoteCount}</p>
                                                ) : (
                                                    <p>{comment.votes}</p>
                                                )}
                                            <button onClick={() => {
                                                setCommentVoteCount(comment.votes - 1)
                                                handleCommentVote(comment, -1)
                                            }}><i className="fa-solid fa-thumbs-down"></i></button>
                                        </div>
                                        {commentToBeUpdated.comment_id === comment.comment_id &&
                                            <p className="error-comment-voting">{errorCommentVoting}</p>
                                        }
                                        <div>
                                            {loggedInUser && (
                                                loggedInUser.username === comment.author && (
                                                    <button onClick={() => { 
                                                        handleClick(comment)
                                                    }
                                                } className="delete-comment-button">Delete Comment <i className="fa-solid fa-trash-can"></i></button>
                                                )
                                            )}
                                            {loggedInUser && (
                                                loggedInUser.username === comment.author && selectedCommentId === comment.comment_id && (
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
                                                )
                                            )}
                                        </div>
                                    </li>
                                )
                                })}
                            </ul>
                        )
                        }
                        </>
                    )
            }
            </>}
        </>
    )
}