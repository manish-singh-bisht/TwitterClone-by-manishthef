import axios from "axios";
import { API_BASE_URL } from "../../../config";
const LikeUnlike = async ({ dispatch, ACTIONS, postId, state, setComment }) => {
  const userData = {
    _id: state.user._id,
    name: state.user.name,
    handle: state.user.handle,
    profile: state.user.profile && state.user.profile,
    description: state.user.description,
  };

  try {
    dispatch({ type: ACTIONS.LIKE_UNLIKE_REQUEST });

    const { data } = await axios.get(`${API_BASE_URL}/post/${postId}`, {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    dispatch({ type: ACTIONS.LIKE_UNLIKE_SUCCESS, payload: data.message });
    setComment((prev) => {
      const tempArray = [...prev.comments];
      tempArray.length > 0 &&
        tempArray.forEach((item) => {
          if (item.comment.post && item.comment.post._id === postId) {
            const indexOfUserInLikedArray = item.comment.post.likes.findIndex(
              (item) => {
                return item._id === state.user._id;
              }
            );
            if (indexOfUserInLikedArray !== -1) {
              item.comment.post.likes.splice(indexOfUserInLikedArray, 1);
            } else {
              item.comment.post.likes.push(userData);
            }
          }
        });
      return { ...prev, comments: tempArray };
    });
  } catch (error) {
    dispatch({
      type: ACTIONS.LIKE_UNLIKE_FAILURE,
      payload: error.response.data.message,
    });
  }
};

export default LikeUnlike;
