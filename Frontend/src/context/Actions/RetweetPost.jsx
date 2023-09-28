import axios from "axios";
const RetweetPost = async ({ dispatchRetweet, ACTIONS, postId, user, state, setComment }) => {
    const userData = { _id: state.user._id, name: state.user.name, handle: state.user.handle, profile: state.user.profile && state.user.profile, description: state.user.description };

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
        setComment((prev) => {
            const tempArray = [...prev.comments];
            tempArray.length > 0 &&
                tempArray.forEach((item) => {
                    if (item.comment.post && item.comment.post._id === postId) {
                        const indexOfUserInRetweetsArray = item.comment.post.retweets.findIndex((item) => {
                            return item._id === state.user._id;
                        });
                        if (indexOfUserInRetweetsArray !== -1) {
                            item.comment.post.retweets.splice(indexOfUserInRetweetsArray, 1);
                        } else {
                            item.comment.post.retweets.push(userData);
                        }
                    }
                });
            return { ...prev, comments: tempArray };
        });
    } catch (error) {
        dispatchRetweet({ type: ACTIONS.RETWEET_POST_FAILURE, payload: error.response.data.message });
    }
};

export default RetweetPost;
