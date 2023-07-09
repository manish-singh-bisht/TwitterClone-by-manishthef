import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DeletePost = async ({ dispatchTweetDelete, ACTIONS, postID }) => {
    try {
        dispatchTweetDelete({ type: ACTIONS.TWEET_DELETE_REQUEST });
        const { data } = await axios.delete(`http://localhost:4000/api/v1/post/${postID}`, { withCredentials: true });
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
        dispatchTweetDelete({ type: ACTIONS.TWEET_DELETE_SUCCESS, payload: data.message });
        return data.post;
    } catch (error) {
        dispatchTweetDelete({ type: ACTIONS.TWEET_DELETE_FAILURE, payload: error.response.data.message });
    }
};

export default DeletePost;
