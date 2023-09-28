import axios from "axios";
import { toast } from "react-toastify";
const CommentBookmark = async ({ dispatchBookmark, ACTIONS, postId, state, setComment }) => {
    const userData = { _id: state.user._id, name: state.user.name, handle: state.user.handle, profile: state.user.profile && state.user.profile, description: state.user.description };

    try {
        dispatchBookmark({ type: ACTIONS.BOOKMARK_COMMENT_REQUEST });
        const { data } = await axios.get(`http://localhost:4000/api/v1/comment/${postId}/bookmark`, { withCredentials: true });

        const toastConfig = {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            closeButton: false,
            style: {
                backgroundColor: "#1DA1F2",
                border: "none",
                boxShadow: "none",
                width: "fit-content",
                zIndex: 9999,
                color: "white",
                padding: "0px 16px",
                minHeight: "3rem",
            },
        };

        toast(data.message, toastConfig);
        dispatchBookmark({ type: ACTIONS.BOOKMARK_COMMENT_SUCCESS, payload: data.message });
        setComment((prev) => {
            const tempComments = [...prev.comments];
            const tempActiveComment = { ...prev.activeComment };

            const indexCommentInTempArray = tempComments.findIndex((item) => {
                return item.comment._id === postId;
            });
            if (indexCommentInTempArray !== -1) {
                const indexOfUserInBookmarksArray = tempComments[indexCommentInTempArray].comment.bookmarks.findIndex((item) => {
                    return item._id === state.user._id;
                });
                if (indexOfUserInBookmarksArray !== -1 && tempComments[indexCommentInTempArray].comment.bookmarks.length > 0) {
                    tempComments[indexCommentInTempArray].comment.bookmarks.splice(indexOfUserInBookmarksArray, 1);
                    const parentId = tempComments[indexCommentInTempArray].comment.parent?._id;
                    const parentIndex = tempComments.findIndex((item) => {
                        return item.comment._id === parentId;
                    });
                    if (parentIndex !== -1) {
                        const childIndex = tempComments[parentIndex].comment.children.findIndex((item) => item._id === postId);
                        if (childIndex !== -1) {
                            const indexOfUserInBookmarksArray = tempComments[parentIndex].comment.children[childIndex].bookmarks.findIndex((item) => {
                                return item._id === state.user._id;
                            });
                            tempComments[parentIndex].comment.children[childIndex].bookmarks.splice(indexOfUserInBookmarksArray, 1);
                        }
                    }
                } else {
                    tempComments[indexCommentInTempArray].comment.bookmarks.push(userData);
                    const parentId = tempComments[indexCommentInTempArray].comment.parent?._id;
                    const parentIndex = tempComments.findIndex((item) => {
                        return item.comment._id === parentId;
                    });
                    if (parentIndex !== -1) {
                        const childIndex = tempComments[parentIndex].comment.children.findIndex((item) => item._id === postId);
                        if (childIndex !== -1) {
                            tempComments[parentIndex].comment.children[childIndex].bookmarks.push(userData);
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
                        const indexOfUserInBookmarksArray = tempComments[parentIndex].comment.children[childIndex].bookmarks.findIndex((item) => {
                            return item._id === state.user._id;
                        });
                        if (indexOfUserInBookmarksArray !== -1) {
                            tempComments[parentIndex].comment.children[childIndex].bookmarks.splice(indexOfUserInBookmarksArray, 1);
                        } else {
                            tempComments[parentIndex].comment.children[childIndex].bookmarks.push(userData);
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
        dispatchBookmark({ type: ACTIONS.BOOKMARK_COMMENT_FAILURE, payload: error.response.data.message });
    }
};

export default CommentBookmark;
