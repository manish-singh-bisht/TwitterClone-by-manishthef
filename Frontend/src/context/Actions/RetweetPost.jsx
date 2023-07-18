import axios from "axios";
const RetweetPost = async ({ dispatchRetweet, ACTIONS, postId, user }) => {
    try {
        dispatchRetweet({ type: ACTIONS.RETWEET_POST_REQUEST });

        const { data } = await axios.post(
            `http://localhost:4000/api/v1/${postId}`,
            { user },

            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );

        dispatchRetweet({ type: ACTIONS.RETWEET_POST_SUCCESS, payload: data.message });
    } catch (error) {
        dispatchRetweet({ type: ACTIONS.RETWEET_POST_FAILURE, payload: error.response.data.message });
    }
};

export default RetweetPost;
