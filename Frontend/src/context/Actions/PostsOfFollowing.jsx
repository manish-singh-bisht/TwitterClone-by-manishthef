import React from "react";
import axios from "axios";
const PostsOfFollowing = async ({ dispatchPostOfFollowing, ACTIONS }) => {
    try {
        dispatchPostOfFollowing({ type: ACTIONS.POST_OF_FOLLOWING_REQUEST });

        const { data } = await axios.get("http://localhost:4000/api/v1/posts", { withCredentials: true });

        dispatchPostOfFollowing({ type: ACTIONS.POST_OF_FOLLOWING_SUCCESS, payload: data.posts });
    } catch (error) {
        dispatchPostOfFollowing({ type: ACTIONS.POST_OF_FOLLOWING_FAILURE, payload: error.response.data.message });
    }
};

export default PostsOfFollowing;
