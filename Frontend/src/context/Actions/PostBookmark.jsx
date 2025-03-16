import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../config";
const PostBookmark = async ({
  dispatchBookmark,
  ACTIONS,
  postId,
  state,
  setComment,
}) => {
  const userData = {
    _id: state.user._id,
    name: state.user.name,
    handle: state.user.handle,
    profile: state.user.profile && state.user.profile,
    description: state.user.description,
  };

  try {
    dispatchBookmark({ type: ACTIONS.BOOKMARK_POST_REQUEST });
    const { data } = await axios.get(`${API_BASE_URL}/${postId}/bookmark`, {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
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
    dispatchBookmark({
      type: ACTIONS.BOOKMARK_POST_SUCCESS,
      payload: data.message,
    });
    setComment((prev) => {
      const tempArray = [...prev.comments];
      tempArray.length > 0 &&
        tempArray.forEach((item) => {
          if (item.comment.post && item.comment.post._id === postId) {
            const indexOfUserInBookmarksArray =
              item.comment.post.bookmarks.findIndex((item) => {
                return item._id === state.user._id;
              });
            if (indexOfUserInBookmarksArray !== -1) {
              item.comment.post.bookmarks.splice(
                indexOfUserInBookmarksArray,
                1
              );
            } else {
              item.comment.post.bookmarks.push(userData);
            }
          }
        });
      return { ...prev, comments: tempArray };
    });
  } catch (err) {
    dispatchBookmark({
      type: ACTIONS.BOOKMARK_POST_FAILURE,
      payload: err.response.data.message,
    });
  }
};

export default PostBookmark;
