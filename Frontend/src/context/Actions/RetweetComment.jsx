import axios from "axios";
const RetweetComment = async ({ dispatchRetweet, ACTIONS, postId, user, state, setComment }) => {
    //postId here is commentid

    const userData = { _id: state.user._id, name: state.user.name, handle: state.user.handle, profile: state.user.profile && state.user.profile, description: state.user.description };

    try {
        dispatchRetweet({ type: ACTIONS.RETWEET_COMMENT_REQUEST });

        const { data } = await axios.post(
            `http://localhost:4000/api/v1/comment/${postId}`,
            { user },

            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );

        dispatchRetweet({ type: ACTIONS.RETWEET_COMMENT_SUCCESS, payload: data.message });
        setComment((prev) => {
            const tempComments = [...prev.comments];
            const tempActiveComment = { ...prev.activeComment };

            const indexCommentInTempArray = tempComments.findIndex((item) => {
                return item.comment._id === postId;
            });
            if (indexCommentInTempArray !== -1) {
                const indexOfUserInRetweetArray = tempComments[indexCommentInTempArray].comment.retweets.findIndex((item) => {
                    return item._id === state.user._id;
                });
                if (indexOfUserInRetweetArray !== -1 && tempComments[indexCommentInTempArray].comment.retweets.length > 0) {
                    tempComments[indexCommentInTempArray].comment.retweets.splice(indexOfUserInRetweetArray, 1);
                    const parentId = tempComments[indexCommentInTempArray].comment.parent?._id;
                    const parentIndex = tempComments.findIndex((item) => {
                        return item.comment._id === parentId;
                    });
                    if (parentIndex !== -1) {
                        const childIndex = tempComments[parentIndex].comment.children.findIndex((item) => item._id === postId);
                        if (childIndex !== -1) {
                            const indexOfUserInRetweetArray = tempComments[parentIndex].comment.children[childIndex].retweets.findIndex((item) => {
                                return item._id === state.user._id;
                            });
                            tempComments[parentIndex].comment.children[childIndex].retweets.splice(indexOfUserInRetweetArray, 1);
                        }
                    }
                } else {
                    tempComments[indexCommentInTempArray].comment.retweets.push(userData);
                    const parentId = tempComments[indexCommentInTempArray].comment.parent?._id;
                    const parentIndex = tempComments.findIndex((item) => {
                        return item.comment._id === parentId;
                    });
                    if (parentIndex !== -1) {
                        const childIndex = tempComments[parentIndex].comment.children.findIndex((item) => item._id === postId);
                        if (childIndex !== -1) {
                            tempComments[parentIndex].comment.children[childIndex].retweets.push(userData);
                        }
                    }
                }
            } else {
                const parentId = tempActiveComment?.comment?._id;

                const parentIndex = tempComments.findIndex((item) => {
                    return item.comment._id === parentId;
                });

                if (parentIndex !== -1) {
                    const childIndex = tempComments[parentIndex].comment.children?.findIndex((item) => item._id === postId);
                    if (childIndex !== -1) {
                        const indexOfUserInRetweetArray = tempComments[parentIndex].comment.children[childIndex].retweets.findIndex((item) => {
                            return item._id === state.user._id;
                        });
                        if (indexOfUserInRetweetArray !== -1) {
                            tempComments[parentIndex].comment.children[childIndex].retweets.splice(indexOfUserInRetweetArray, 1);
                        } else {
                            tempComments[parentIndex].comment.children[childIndex].retweets.push(userData);
                        }
                    }
                }
            }

            return {
                ...prev,
                comment: tempComments,
            };
        });
    } catch (error) {
        dispatchRetweet({ type: ACTIONS.RETWEET_COMMENT_FAILURE, payload: error.response.data.message });
    }
};

export default RetweetComment;
