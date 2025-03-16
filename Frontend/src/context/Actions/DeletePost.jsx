import axios from "axios";

import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../config";
const DeletePost = async ({ dispatchTweetDelete, ACTIONS, postID }) => {
  try {
    dispatchTweetDelete({ type: ACTIONS.TWEET_DELETE_REQUEST });
    const { data } = await axios.delete(`${API_BASE_URL}/post/${postID}`, {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    dispatchTweetDelete({
      type: ACTIONS.TWEET_DELETE_SUCCESS,
      payload: data.message,
    });
    return data.post;
  } catch (error) {
    dispatchTweetDelete({
      type: ACTIONS.TWEET_DELETE_FAILURE,
      payload: error.response.data.message,
    });
  }
};

export default DeletePost;
