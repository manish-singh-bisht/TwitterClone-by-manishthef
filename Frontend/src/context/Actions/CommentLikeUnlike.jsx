import axios from "axios";
import { API_BASE_URL } from "../../../config";
const CommentLikeUnlike = async ({ dispatch, ACTIONS, postId, state, setComment }) => {
    const userData = { _id: state.user._id, name: state.user.name, handle: state.user.handle, profile: state.user.profile && state.user.profile, description: state.user.description };
    try {
        dispatch({ type: ACTIONS.COMMENT_LIKE_UNLIKE_REQUEST });
        const { data } = await axios.get(`${API_BASE_URL}/post/comment/${postId}`, { withCredentials: true });
        dispatch({ type: ACTIONS.COMMENT_LIKE_UNLIKE_SUCCESS, payload: data.message });

        setComment((prev) => {
            const tempComments = [...prev.comments];
            const tempActiveComment = { ...prev.activeComment };
            const indexCommentInTempArray = tempComments.findIndex((item) => {
                return item.comment._id === postId;
            });
            if (indexCommentInTempArray !== -1) {
                const indexOfUserInLikedArray = tempComments[indexCommentInTempArray].comment.likes.findIndex((item) => {
                    return item._id === state.user._id;
                });
                if (indexOfUserInLikedArray !== -1 && tempComments[indexCommentInTempArray].comment.likes.length > 0) {
                    tempComments[indexCommentInTempArray].comment.likes.splice(indexOfUserInLikedArray, 1);
                    const parentId = tempComments[indexCommentInTempArray].comment.parent?._id;
                    const parentIndex = tempComments.findIndex((item) => {
                        return item.comment._id === parentId;
                    });
                    if (parentIndex !== -1) {
                        const childIndex = tempComments[parentIndex].comment.children.findIndex((item) => item._id === postId);
                        if (childIndex !== -1) {
                            const indexOfUserInLikedArray = tempComments[parentIndex].comment.children[childIndex].likes.findIndex((item) => {
                                return item._id === state.user._id;
                            });
                            tempComments[parentIndex].comment.children[childIndex].likes.splice(indexOfUserInLikedArray, 1);
                        }
                    }
                } else {
                    tempComments[indexCommentInTempArray].comment.likes.push(userData);
                    const parentId = tempComments[indexCommentInTempArray].comment.parent?._id;
                    const parentIndex = tempComments.findIndex((item) => {
                        return item.comment._id === parentId;
                    });
                    if (parentIndex !== -1) {
                        const childIndex = tempComments[parentIndex].comment.children.findIndex((item) => item._id === postId);
                        if (childIndex !== -1) {
                            tempComments[parentIndex].comment.children[childIndex].likes.push(userData);
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
                        const indexOfUserInLikedArray = tempComments[parentIndex].comment.children[childIndex].likes.findIndex((item) => {
                            return item._id === state.user._id;
                        });
                        if (indexOfUserInLikedArray !== -1) {
                            tempComments[parentIndex].comment.children[childIndex].likes.splice(indexOfUserInLikedArray, 1);
                        } else {
                            tempComments[parentIndex].comment.children[childIndex].likes.push(userData);
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
        dispatch({ type: ACTIONS.COMMENT_LIKE_UNLIKE_FAILURE, payload: error.response.data.message });
    }
};

export default CommentLikeUnlike;
