import React from "react";
import axios from "axios";
const PostComments = async ({ dispatchComment, ACTIONS, id, comment }) => {
    try {
        dispatchComment({ type: ACTIONS.COMMENT_REQUEST });
        const { data } = await axios.put(`http://localhost:4000/api/v1/post/comment/:${id}`, { comment }, { "Content-Type": "application/json" }, { withCredentials: true });
        dispatchComment({ type: ACTIONS.COMMENT_SUCCESS, payload: data.message });
    } catch (error) {
        dispatchComment({ type: ACTIONS.COMMENT_FAILURE, payload: error.response.data.message });
    }
};

export default PostComments;
