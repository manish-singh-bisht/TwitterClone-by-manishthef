import React from "react";
import axios from "axios";
const LikeUnlike = async ({ dispatch, ACTIONS, postId }) => {
    try {
        dispatch({ type: ACTIONS.LIKE_UNLIKE_REQUEST });

        const { data } = await axios.get(`http://localhost:4000/api/v1/post/${postId}`, { withCredentials: true });

        dispatch({ type: ACTIONS.LIKE_UNLIKE_SUCCESS, payload: data.message });
    } catch (error) {
        dispatch({ type: ACTIONS.LIKE_UNLIKE_FAILURE, payload: error.message });
    }
};

export default LikeUnlike;
