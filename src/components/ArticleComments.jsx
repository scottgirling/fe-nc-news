import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom";
import { addCommentByArticleId, fetchCommentsByArticleId, deleteCommentByCommentId, fetchUsers, updateCommentVotes } from "../utils/api";
import '../ArticleComments.css'
import { UserAccount } from "../contexts/UserAccount";
import { Box, TextField, Button, Tooltip, Typography, Stack, Pagination } from "@mui/material";

export const ArticleComments = ({ article_id, commentCount }) => {
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
    const [commentsUserHasUpVoted] = useState([]);
    const [commentsUserHasDownVoted] = useState([]);
    const [commentLimit, setCommentLimit] = useState(10);
    const [charCount, setCharCount] = useState(0);
    const maxCharCount = 140;

    useEffect(() => {
        setIsLoading(true);
        fetchCommentsByArticleId(article_id, commentLimit)
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
    }, [comments, commentLimit]);

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
        const commentBeingVotedOnId = comment.comment_id;
        if (voteChange === 1) {
            if (!commentsUserHasUpVoted.includes(commentBeingVotedOnId)) {
                setCommentVoteCount(comment.votes + voteChange)
                commentsUserHasUpVoted.push(commentBeingVotedOnId);
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
                    setErrorCommentVoting("Your vote was not successful. Please try again.");
                });
            } else {
                const commentIdToRemove = commentsUserHasUpVoted.indexOf(commentBeingVotedOnId);
                commentsUserHasUpVoted.splice(commentIdToRemove, 1)
                setCommentToBeUpdated(comment);
                updateCommentVotes(comment.comment_id, -1)
                .then(( { votes }) => {
                    setCommentVoteCount(votes);
                    setErrorCommentVoting(null);
                })
                .catch(() => {
                    setCommentVoteCount((currentCommentVoteCount) => {
                        return currentCommentVoteCount - voteChange;
                    })
                    setErrorCommentVoting("Your vote was not successful. Please try again.");
                });
            }
        } else if (voteChange !== 1) {
            if (!commentsUserHasDownVoted.includes(commentBeingVotedOnId)) {
                setCommentVoteCount(comment.votes + voteChange)
                commentsUserHasDownVoted.push(commentBeingVotedOnId);
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
                    setErrorCommentVoting("Your vote was not successful. Please try again.");
                });
            } 
            else {
                const commentIdToRemove = commentsUserHasDownVoted.indexOf(commentBeingVotedOnId);
                commentsUserHasDownVoted.splice(commentIdToRemove, 1)
                setCommentToBeUpdated(comment);
                updateCommentVotes(comment.comment_id, 1)
                .then(( { votes }) => {
                    setCommentVoteCount(votes);
                    setErrorCommentVoting(null);
                })
                .catch(() => {
                    setCommentVoteCount((currentCommentVoteCount) => {
                        return currentCommentVoteCount - voteChange;
                    })
                    setErrorCommentVoting("Your vote was not successful. Please try again.");
                });
            }
        }
    }

    const disableLoadMoreCommentsButton = () => {
        let isLoadMoreCommentsButtonDisabled;
        
        if (comments.length < commentLimit) {
            isLoadMoreCommentsButtonDisabled = true;
        } else {
            isLoadMoreCommentsButtonDisabled = false;
        }

        return isLoadMoreCommentsButtonDisabled;
    }

    return (
        <section>
            <section id="comments" className="comments-top">
                <h1 className="comments-title">Comments</h1>
                <p className="comments-number">{commentCount}</p>
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
            </section>
            
            <section>
                {newCommentIsLoading ? (
                    <p>Your comment is being uploaded...</p>
                ) : (
                    <section>
                        {isLoading ? (
                            <p>Loading comments...</p>
                            ) : (
                            commentBox ? (
                                <section>
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
                                </section>
                            ) : (
                                <section>
                                    {!comments.length ? (
                                        <p>There are no comments yet. Why don't you write one?</p>
                                    ) : (
                                        <ul>
                                            {comments.map((comment) => {
                                                return (
                                                    <li className="comment-card" key={comment.comment_id}>
                                                        <article className="comment-details">
                                                            {users.map((user) => {
                                                                return (
                                                                    user.username === comment.author && (
                                                                        <img src={user.avatar_url}alt="User profile picture"/>
                                                                    )
                                                                )
                                                            })}
                                                            <p className="comment-author">{comment.author}</p>
                                                            <p className="comment-date">{new Date(comment.created_at).toDateString()}</p>
                                                        </article>
                                                        <p className="comment-body">{comment.body}</p>
                                                        <article className="comment-vote">
                                                            {loggedInUser ? (
                                                                <>
                                                                    <button onClick={() => {
                                                                        handleCommentVote(comment, 1)
                                                                    }}><i className="fa-solid fa-thumbs-up"></i>
                                                                    </button>
                                                                        {commentToBeUpdated.comment_id === comment.comment_id ? (
                                                                            <p>{commentVoteCount}</p>
                                                                        ) : (
                                                                            <p>{comment.votes}</p>
                                                                        )}
                                                                    <button onClick={() => {
                                                                        handleCommentVote(comment, -1)
                                                                    }}><i className="fa-solid fa-thumbs-down"></i>
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <Box>
                                                                    <Tooltip arrow title="Sign in to like a comment">
                                                                        <Button disabled sx={{ minWidth: "32px" }}>
                                                                            <i className="fa-solid fa-thumbs-up"></i>
                                                                        </Button>
                                                                            <Typography sx={{ display: "inline-block" }}>
                                                                                {comment.votes}
                                                                            </Typography>
                                                                        <Button disabled sx={{ minWidth: "32px" }}>
                                                                            <i className="fa-solid fa-thumbs-down"></i>
                                                                        </Button>
                                                                    </Tooltip>
                                                                </Box>
                                                            )}
                                                        </article>
                                                        {commentToBeUpdated.comment_id === comment.comment_id &&
                                                            <p className="error-comment-voting">{errorCommentVoting}</p>
                                                        }
                                                        <section>
                                                            {loggedInUser && (
                                                                loggedInUser.username === comment.author && (
                                                                    <button onClick={() => { 
                                                                        handleClick(comment)
                                                                    }} 
                                                                    className="delete-comment-button"
                                                                    >
                                                                        Delete Comment <i className="fa-solid fa-trash-can"></i>
                                                                    </button>
                                                                )
                                                            )}
                                                            {loggedInUser && (
                                                                loggedInUser.username === comment.author && selectedCommentId === comment.comment_id && (
                                                                    commentIsDeleting ? (
                                                                        <p>Deleting comment...</p>
                                                                    ) : (
                                                                        <section>
                                                                            <p className="safety-message">Are you sure you want to delete this comment?</p>
                                                                            <button className="confirm-delete-button" onClick={() => handleDelete()}>Yes</button>
                                                                        </section>
                                                                    )
                                                                )
                                                            )}
                                                        </section>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    )}
                                </section>
                            ))
                        }
                    </section>
                )}
            </section>
            <Box>
                <Button 
                    variant="contained"
                    sx={{ mt: 4, bgcolor: "#213547" }}
                    disabled={disableLoadMoreCommentsButton()} 
                    onClick={() => setCommentLimit(commentLimit + 10)}>
                    <Typography sx={{ fontSize: 14 }}>Load more comments</Typography>
                </Button>
            </Box>
        </section>
    )
}