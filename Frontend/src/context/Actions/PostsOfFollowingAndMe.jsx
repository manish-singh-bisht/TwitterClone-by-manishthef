import React from "react";
import axios from "axios";
const PostsOfFollowingAndMe = async ({ dispatchPostOfFollowingAndMe, ACTIONS }) => {
    try {
        dispatchPostOfFollowingAndMe({ type: ACTIONS.POST_OF_FOLLOWING_AND_ME_REQUEST });

        const { data } = await axios.get("http://localhost:4000/api/v1/posts", { withCredentials: true });

        dispatchPostOfFollowingAndMe({ type: ACTIONS.POST_OF_FOLLOWING_AND_ME_SUCCESS, payload: data.posts });
    } catch (error) {
        dispatchPostOfFollowingAndMe({ type: ACTIONS.POST_OF_FOLLOWING_AND_ME_FAILURE, payload: error.message });
    }
};

export default PostsOfFollowingAndMe;
