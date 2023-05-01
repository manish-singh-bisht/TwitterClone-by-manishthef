import React from "react";
import axios from "axios";
const PostComments = async ({ dispatchComment, ACTIONS, postId, comment }) => {
    try {
        dispatchComment({ type: ACTIONS.COMMENT_REQUEST });
        const { data } = await axios.post(
            `http://localhost:4000/api/v1/post/comment/${postId}`,
            { comment },

            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        dispatchComment({ type: ACTIONS.COMMENT_SUCCESS, payload: data.message });
    } catch (error) {
        dispatchComment({ type: ACTIONS.COMMENT_FAILURE, payload: error.response.data.message });
    }
};

export default PostComments;
