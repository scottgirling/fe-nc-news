import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addArticle } from '../utils/api';
import '../Header.css';
import { UserAccount } from '../contexts/UserAccount';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

export const Header = () => {
    const { loggedInUser } = useContext(UserAccount);
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [postDetails] = useState({
        author: "",
        title: "",
        body: "",
        topic: "",
        article_image_url: ""
    })
    const [body, setBody] = useState(null);
    const [topic, setTopic] = useState(null);
    const [newArticle, setNewArticle] = useState({});
    const [errorPostingArticle, setErrorPostingArticle] = useState(null)
    const [charCount, setCharCount] = useState(0);
    const maxCharCount = 140;

    const disableOpenModalButton = () => {
        let isPostArticleButtonDisabled;

        if (!loggedInUser) {
            isPostArticleButtonDisabled = true;
        } else {
            isPostArticleButtonDisabled = false;
        }

        return isPostArticleButtonDisabled;
    }

    const disablePostArticleButton = () => {
        let isSubmitArticleButtonDisabled;
    
        if (postDetails.title.length < 1 || postDetails.body.length < 1 || postDetails.topic === "") {
            isSubmitArticleButtonDisabled = true;
        } else {
            isSubmitArticleButtonDisabled = false;
        }

        return isSubmitArticleButtonDisabled;
    }

    const updatePostDetails = (event) => {
        for (const key in postDetails) {
            if (key === event.target.name) {
                postDetails[key] = event.target.value;
                if (key === "body") {
                    setBody(event.target.value)
                }
                if (key === "topic") {
                    setTopic(event.target.value)
                }
            }
        }
    }

    const handlePostArticle = (event) => {
        postDetails.author = loggedInUser.username;
        event.preventDefault();
        addArticle(postDetails)
        .then((returnedArticle) => {
            setNewArticle(returnedArticle)
            navigate(`/articles/${newArticle.article_id}`)
        })
        .catch((error) => {
            setErrorPostingArticle(error.response.data.msg);
        });
    }

    if (errorPostingArticle) {
        return (
            <ErrorPage errorPostingArticle={errorPostingArticle}/>
        )
    }

    return (
        <>
            <header>
                <Link to="/">
                    <h1 className="title">Northcoders News</h1>
                </Link>
                <section className="sign-in-and-post">
                    <Link className="user-login" to="/login">
                        {loggedInUser ? (
                            <Avatar
                                alt="User profile picture" 
                                src={loggedInUser.avatar_url} 
                            />
                        ) : (
                            <section className="sign-in-button">
                                <Avatar 
                                    sx={{ 
                                        background: "#CDD9DF", 
                                        border: "1px solid #213547", 
                                        color: "#213547" 
                                    }}
                                />
                                <p className="sign-in-text">Sign In</p>
                            </section>
                        )}
                    </Link>
                    <button 
                        className="post-article-button"
                        disabled={disableOpenModalButton()}
                        onClick={() => {
                            setOpenModal(!openModal);
                        }}
                    >
                        <i className="fa-solid fa-pen"></i>
                    </button>
                </section>
            </header>
            <section>
                <Dialog
                    open={openModal}
                    onClose={!openModal}
                    fullWidth={true}
                    maxWidth="lg"
                    sx={{ p: "8rem" }}
                >
                    <DialogTitle sx={{ color: "#213547" }}>Post an article</DialogTitle>
                    <DialogContent sx={{ pb: 0 }}>
                        <DialogContentText sx={{ mb: ".5rem", color: "#213547", maxWidth: "60vw" }}>
                            Have a story, insight, or opinion you've been itching to share? Now's your chance! 
                        </DialogContentText>
                        <DialogContentText sx={{ mb: ".5rem", color: "#213547", maxWidth: "60vw" }}>
                            Write an article on a topic you're passionate about—whether it's a personal experience, expert advice, a trending issue, or a creative idea.
                        </DialogContentText>
                        <DialogContentText sx={{ mb: ".5rem", color: "#213547", maxWidth: "60vw" }}>
                            Your words have the power to inform, inspire, and spark conversation.
                        </DialogContentText>
                        <TextField
                            required
                            id="outlined-basic"
                            name="title"
                            label="Article Title" 
                            variant="outlined"
                            sx={{ width: "60vw", mb: 2, color: "#213547" }}
                            slotProps={{ htmlInput: { maxLength: 140 } }}
                            multiline
                            helperText={`${maxCharCount - charCount} characters remaining`}
                            onChange={(event) => {
                                updatePostDetails(event);
                                setCharCount(event.target.value.length)
                            }}
                        />
                        <TextField
                            required
                            id="outlined-basic"
                            value={body}
                            name="body"
                            label="What's on your mind?" 
                            variant="outlined"
                            sx={{ width: "60vw", mb: 2 }}
                            multiline
                            onChange={(event) => {
                                updatePostDetails(event);
                            }}
                        />
                        <FormControl
                            sx={{ display: "flex", width: "10rem", mr: ".5rem", mb: 2 }}
                            required
                        >
                            <InputLabel
                                id="demo-simple-select-label"
                            >
                                Topic
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={topic}
                                name="topic"
                                label="Topic"
                                onChange={(event) => {
                                    updatePostDetails(event);
                                }}
                            >
                                <MenuItem
                                    value="coding"
                                >
                                    Coding
                                </MenuItem>
                                <MenuItem
                                    value="football"
                                >
                                    Football
                                </MenuItem>
                                <MenuItem 
                                    value="cooking"
                                >
                                    Cooking
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            id="outlined-basic"
                            name="article_img_url"
                            label="Article Image" 
                            variant="outlined"
                            sx={{ width: "60vw", mb: 2 }}
                            multiline
                            onChange={(event) => {
                                updatePostDetails(event);
                            }}
                        >
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Box sx={{ display: "flex", flexDirection: "column", margin: "auto" }}>
                            <Button 
                                sx={{ color: "#213547" }}
                                onClick={() => {
                                    setOpenModal(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="contained"
                                sx={{ m: 1.25, bgcolor: "#213547" }}
                                disabled={disablePostArticleButton()}
                                onClick={(event) => {
                                    setOpenModal(false)
                                    handlePostArticle(event)
                                }}
                            >
                                Post
                            </Button>
                        </Box>
                    </DialogActions>
                </Dialog>
            </section>
        </>
    )
}