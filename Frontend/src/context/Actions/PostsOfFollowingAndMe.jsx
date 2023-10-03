import axios from "axios";
import { API_BASE_URL } from "../../../config";
const PostsOfFollowingAndMe = async ({ dispatchPostOfFollowingAndMe, ACTIONS }) => {
    try {
        dispatchPostOfFollowingAndMe({ type: ACTIONS.POST_OF_FOLLOWING_AND_ME_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/posts`, { withCredentials: true });

        dispatchPostOfFollowingAndMe({ type: ACTIONS.POST_OF_FOLLOWING_AND_ME_SUCCESS, payload: data.posts });
        return data.posts;
    } catch (error) {
        dispatchPostOfFollowingAndMe({ type: ACTIONS.POST_OF_FOLLOWING_AND_ME_FAILURE, payload: error.response.data.message });
    }
};

export default PostsOfFollowingAndMe;
