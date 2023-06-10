import axios from "axios";

const PostTweet = async ({ dispatchPostTweet, ACTIONS, tweet, parent, mentions }) => {
    try {
        dispatchPostTweet({ type: ACTIONS.POST_TWEET_REQUEST });
        const { data } = await axios.post(
            `http://localhost:4000/api/v1/post/upload`,
            { tweet, parent, mentions },

            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        dispatchPostTweet({ type: ACTIONS.POST_TWEET_SUCCESS, payload: data.createNewPost });
        return data.createNewPost;
    } catch (error) {
        dispatchPostTweet({ type: ACTIONS.POST_TWEET_FAILURE, payload: error.response.data.message });
    }
};

export default PostTweet;
