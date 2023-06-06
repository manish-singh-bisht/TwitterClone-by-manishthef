import React from "react";
import axios from "axios";
const GetPostById = async ({ dispatchGetPostById, ACTIONS, postId }) => {
    try {
        dispatchGetPostById({ type: ACTIONS.GET_POST_BY_ID_REQUEST });
        const { data } = await axios.get(`http://localhost:4000/api/v1/${postId}`, { withCredentials: true });
        dispatchGetPostById({ type: ACTIONS.GET_POST_BY_ID_SUCCESS, payload: data.post });
    } catch (error) {
        dispatchGetPostById({ type: ACTIONS.GET_POST_BY_ID_FAILURE, payload: error.message });
    }
};

export default GetPostById;
