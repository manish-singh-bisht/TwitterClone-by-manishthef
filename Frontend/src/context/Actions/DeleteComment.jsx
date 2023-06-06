import React from "react";
import axios from "axios";
const DeleteComment = async ({ dispatchCommentDelete, ACTIONS, postID, commentID }) => {
    try {
        dispatchCommentDelete({ type: ACTIONS.COMMENT_DELETE_REQUEST });
        const { data } = await axios.delete(`http://localhost:4000/api/v1/${postID}/${commentID}`, { withCredentials: true });

        dispatchCommentDelete({ type: ACTIONS.COMMENT_DELETE_SUCCESS, payload: data.message });
    } catch (error) {
        dispatchCommentDelete({ type: ACTIONS.COMMENT_DELETE_FAILURE, payload: error.message });
    }
};

export default DeleteComment;
