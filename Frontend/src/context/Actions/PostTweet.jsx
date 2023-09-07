import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostTweet = async ({ dispatchPostTweet, ACTIONS, tweet, parent, mentions, threadIdForTweetInThread, images, whoCanReply, whoCanReplyNumber }) => {
    if ((whoCanReplyNumber === 2 || whoCanReplyNumber === 3) && whoCanReply.length === 0) {
        const toastConfig = {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            closeButton: false,
            style: {
                backgroundColor: "#1DA1F2",
                border: "none",
                boxShadow: "none",
                width: "fit-content",
                zIndex: 9999,
                color: "white",
                padding: "0px 16px",
                minHeight: "3rem",
            },
        };
        if (whoCanReplyNumber === 2) {
            toast("Follow someone to tweet with this conversation settings", toastConfig);
        }
        if (whoCanReplyNumber === 3) {
            toast("Mention someone to tweet with this conversation settings", toastConfig);
        }
        return;
    }
    try {
        dispatchPostTweet({ type: ACTIONS.POST_TWEET_REQUEST });
        const { data } = await axios.post(
            `http://localhost:4000/api/v1/post/upload`,
            { tweet, parent, mentions, threadIdForTweetInThread, images, whoCanReply, whoCanReplyNumber },

            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );

        const toastConfig = {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            closeButton: false,
            style: {
                backgroundColor: "#1DA1F2",
                border: "none",
                boxShadow: "none",
                width: "fit-content",
                zIndex: 9999,
                color: "white",
                padding: "0px 16px",
                minHeight: "3rem",
            },
        };

        toast(data.message, toastConfig);
        dispatchPostTweet({ type: ACTIONS.POST_TWEET_SUCCESS, payload: data.createNewPost });
        return data.createNewPost;
    } catch (err) {
        const toastConfig = {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            closeButton: false,
            style: {
                backgroundColor: "#1DA1F2",
                border: "none",
                boxShadow: "none",
                width: "fit-content",
                zIndex: 9999,
                color: "white",
                padding: "0px 16px",
                minHeight: "3rem",
            },
        };
        if (err.response) {
            toast(err.response.data.message, toastConfig);
            dispatchPostTweet({ type: ACTIONS.POST_TWEET_FAILURE, payload: err.response.data.message });
        }
    }
};

export default PostTweet;
