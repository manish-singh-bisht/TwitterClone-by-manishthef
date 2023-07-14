import axios from "axios";

import "react-toastify/dist/ReactToastify.css";
const DeletePost = async ({ dispatchTweetDelete, ACTIONS, postID }) => {
    try {
        dispatchTweetDelete({ type: ACTIONS.TWEET_DELETE_REQUEST });
        const { data } = await axios.delete(`http://localhost:4000/api/v1/post/${postID}`, { withCredentials: true });

        dispatchTweetDelete({ type: ACTIONS.TWEET_DELETE_SUCCESS, payload: data.message });
        return data.post;
    } catch (error) {
        dispatchTweetDelete({ type: ACTIONS.TWEET_DELETE_FAILURE, payload: error.response.data.message });
    }
};

export default DeletePost;
