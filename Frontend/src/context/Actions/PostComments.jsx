import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../config";
const PostComments = async ({ dispatchComment, ACTIONS, postId, comment, parent, mentions, images }) => {
    try {
        dispatchComment({ type: ACTIONS.COMMENT_REQUEST });
        const { data } = await axios.post(
            `${API_BASE_URL}/post/comment/${postId}`,
            { comment, parent, mentions, images },

            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
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
        dispatchComment({ type: ACTIONS.COMMENT_SUCCESS, payload: data.message });
        return data;
    } catch (err) {
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
        if (err.response) {
            toast(err.response.data.message, toastConfig);
            dispatchComment({ type: ACTIONS.COMMENT_FAILURE, payload: err.response.data.message });
        }
    }
};

export default PostComments;
