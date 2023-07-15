import axios from "axios";
const RetweetComment = async ({ dispatchRetweet, ACTIONS, postId }) => {
    //postId here is commentid
    try {
        dispatchRetweet({ type: ACTIONS.RETWEET_COMMENT_REQUEST });

        const { data } = await axios.get(`http://localhost:4000/api/v1/post/${postId}/retweet`, { withCredentials: true });

        dispatchRetweet({ type: ACTIONS.RETWEET_COMMENT_SUCCESS, payload: data.message });
    } catch (error) {
        dispatchRetweet({ type: ACTIONS.RETWEET_COMMENT_FAILURE, payload: error.response.data.message });
    }
};

export default RetweetComment;
