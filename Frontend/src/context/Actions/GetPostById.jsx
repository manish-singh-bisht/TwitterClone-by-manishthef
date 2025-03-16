import axios from "axios";
import { API_BASE_URL } from "../../../config";
const GetPostById = async ({ dispatchGetPostById, ACTIONS, postId }) => {
  try {
    dispatchGetPostById({ type: ACTIONS.GET_POST_BY_ID_REQUEST });
    const { data } = await axios.get(`${API_BASE_URL}/${postId}`, {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    dispatchGetPostById({
      type: ACTIONS.GET_POST_BY_ID_SUCCESS,
      payload: data.post,
    });
  } catch (error) {
    dispatchGetPostById({
      type: ACTIONS.GET_POST_BY_ID_FAILURE,
      payload: error.response.data.message,
    });
  }
};

export default GetPostById;
