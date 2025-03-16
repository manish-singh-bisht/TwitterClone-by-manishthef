import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../config";

const DeleteComment = async ({
  dispatchCommentDelete,
  ACTIONS,
  postID,
  commentID,
}) => {
  try {
    dispatchCommentDelete({ type: ACTIONS.COMMENT_DELETE_REQUEST });
    const { data } = await axios.delete(
      `${API_BASE_URL}/${postID}/${commentID}`,
      {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
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

    dispatchCommentDelete({
      type: ACTIONS.COMMENT_DELETE_SUCCESS,
      payload: data.message,
    });
  } catch (err) {
    dispatchCommentDelete({
      type: ACTIONS.COMMENT_DELETE_FAILURE,
      payload: err.response.data.message,
    });
  }
};

export default DeleteComment;
