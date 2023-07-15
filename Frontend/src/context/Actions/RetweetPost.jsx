import axios from "axios";
const RetweetPost = async ({ dispatchRetweet, ACTIONS, postId }) => {
    try {
        dispatchRetweet({ type: ACTIONS.RETWEET_POST_REQUEST });

        const { data } = await axios.get(`http://localhost:4000/api/v1/${postId}/retweet`, { withCredentials: true });

        dispatchRetweet({ type: ACTIONS.RETWEET_POST_SUCCESS, payload: data.message });
    } catch (error) {
        dispatchRetweet({ type: ACTIONS.RETWEET_POST_FAILURE, payload: error.response.data.message });
    }
};

export default RetweetPost;
