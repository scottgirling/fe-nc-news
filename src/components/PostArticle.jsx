import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip } from "@mui/material"
import { useContext, useState } from "react";
import { UserAccount } from "../contexts/UserAccount";
import { addArticle } from "../utils/api";

export const PostArticle = () => {
    const { loggedInUser } = useContext(UserAccount);
    const [postBox, setPostBox] = useState(false);
    const [postDetails] = useState({
        author: "",
        title: "",
        body: "",
        topic: "",
        article_image_url: ""
    })
    const [body, setBody] = useState(null);
    const [topic, setTopic] = useState(null);
    const [charCount, setCharCount] = useState(0);
    const maxCharCount = 140;

    const handlePostArticle = (event) => {
        // console.log(event.target.value, "<--- event.target.value")
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
        console.log(postDetails.body.length, "<--- postDetails")
    }

    const handleSubmitArticle = (event) => {
        if (loggedInUser) {
            postDetails.author = loggedInUser.username;
        }
        console.log(postDetails, "<--- postDetails")
        // setNewCommentIsLoading(true);
        event.preventDefault();
        addArticle(postDetails)
        .then(() => {
            // setCommentBox(!commentBox);
            // setNewCommentIsLoading(false);
        })
        // .catch((error) => {
        //     setErrorPostingComment(error.response.data.msg);
        // });
    }

    const disablePostArticleButton = () => {
        let isPostArticleButtonDisabled;

        if (postDetails.body.length < 1) {
            isPostArticleButtonDisabled = true;
        } else {
            isPostArticleButtonDisabled = false;
        }

        return isPostArticleButtonDisabled;
    }

    const disableSubmitArticleButton = () => {
        let isSubmitArticleButtonDisabled;
    
        if (postDetails.title.length < 1 || postDetails.body.length < 1 || postDetails.topic === "") {
            isSubmitArticleButtonDisabled = true;
        } else {
            isSubmitArticleButtonDisabled = false;
        }

        return isSubmitArticleButtonDisabled;
    }

    // const handleOpenPostArticleBox = () => {
    //     if (loggedInUser && postDetails.body.length > 1) {
    //         setPostBox(true);
    //     }
    // }

    return (
        <section>
            {!postBox ? (
                !loggedInUser ? (
                    <>
                        <TextField
                            id="outlined-basic"
                            name="body"
                            label="What's on your mind?" 
                            variant="outlined"
                            sx={{ width: "50vw", mt: 2 }}
                            slotProps={{ htmlInput: { maxLength: 140 } }}
                            multiline
                            onChange={(event) => {
                                handlePostArticle(event);
                            }}
                        >
                        </TextField>
                        <Tooltip arrow title="Sign in to post an article">
                            <Button 
                                variant="contained"
                                sx={{ m: 1.25, mt: 3.25, bgcolor: "#213547", opacity: "50%" }}
                            >
                                Post
                            </Button>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <TextField
                            id="outlined-basic"
                            name="body"
                            label="What's on your mind?" 
                            variant="outlined"
                            sx={{ width: "50vw" }}
                            slotProps={{ htmlInput: { maxLength: 140 } }}
                            multiline
                            onChange={(event) => {
                                handlePostArticle(event);
                            }}
                        >
                        </TextField>
                            <Button 
                            variant="contained"
                            sx={{ m: 1.25, bgcolor: "#213547" }}
                            disabled={disablePostArticleButton()}
                            onClick={() => {
                                // handleOpenPostArticleBox()
                                setPostBox(true);

                            }}
                        >
                            Post
                        </Button>
                    </>
                )
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "white", width: "75vw", margin: "auto", mt: 2, p: 4 }}>
                    <TextField
                        required
                        id="outlined-basic"
                        name="title"
                        label="Article Title" 
                        variant="outlined"
                        sx={{ width: "50vw", mb: 2 }}
                        slotProps={{ htmlInput: { maxLength: 140 } }}
                        multiline
                        helperText={`${maxCharCount - charCount} characters remaining`}
                        onChange={(event) => {
                            handlePostArticle(event);
                            setCharCount(event.target.value.length)
                        }}
                    >
                    </TextField>
                    <TextField
                        required
                        id="outlined-basic"
                        value={body}
                        name="body"
                        label="What's on your mind?" 
                        variant="outlined"
                        sx={{ width: "50vw", mb: 2 }}
                        multiline
                        onChange={(event) => {
                            handlePostArticle(event);
                        }}
                    >
                    </TextField>
                    <FormControl 
                        sx={{ width: "10rem", mr: ".5rem", mb: 2 }}
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
                                handlePostArticle(event);
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
                        sx={{ width: "50vw", mb: 2 }}
                        multiline
                        onChange={(event) => {
                            handlePostArticle(event);
                        }}
                    >
                    </TextField>
                    <Button 
                        variant="contained"
                        sx={{ m: 1.25, bgcolor: "#213547" }}
                        disabled={disableSubmitArticleButton()}
                        onClick={(event) => {
                            handleSubmitArticle(event)
                        }}
                    >
                        Post
                    </Button>
                </Box>
            )}
        </section>
    )
}