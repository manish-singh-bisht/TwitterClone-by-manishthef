import React from "react";
import axios from "axios";
const LikeUnlike = async ({ dispatchLikeUnlike, ACTIONS, postId }) => {
    try {
        dispatchLikeUnlike({ type: ACTIONS.LIKE_UNLIKE_REQUEST });

        const { data } = await axios.get(`http://localhost:4000/api/v1/post/${postId}`, { withCredentials: true });
        dispatchLikeUnlike({ type: ACTIONS.LIKE_UNLIKE_SUCCESS });
    } catch (error) {
        dispatchLikeUnlike({ type: ACTIONS.LIKE_UNLIKE_FAILURE, payload: error.response.data.message });
    }
};

export default LikeUnlike;
