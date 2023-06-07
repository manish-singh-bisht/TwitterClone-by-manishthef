import axios from "axios";
const CommentLikeUnlike = async ({ dispatch, ACTIONS, postId }) => {
    try {
        dispatch({ type: ACTIONS.COMMENT_LIKE_UNLIKE_REQUEST });
        const { data } = await axios.get(`http://localhost:4000/api/v1/post/comment/${postId}`, { withCredentials: true });
        dispatch({ type: ACTIONS.COMMENT_LIKE_UNLIKE_SUCCESS, payload: data.message });
    } catch (error) {
        dispatch({ type: ACTIONS.COMMENT_LIKE_UNLIKE_FAILURE, payload: error.response.data.message });
    }
};

export default CommentLikeUnlike;
