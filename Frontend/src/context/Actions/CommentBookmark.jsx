import axios from "axios";
import { toast } from "react-toastify";
const CommentBookmark = async ({ dispatchBookmark, ACTIONS, postId }) => {
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
    } catch (error) {
        dispatchBookmark({ type: ACTIONS.BOOKMARK_COMMENT_FAILURE, payload: error.response.data.message });
    }
};

export default CommentBookmark;
