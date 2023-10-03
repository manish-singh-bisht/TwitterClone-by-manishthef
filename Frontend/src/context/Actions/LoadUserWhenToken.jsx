import axios from "axios";
import { API_BASE_URL } from "../../../config";

const LoadUserWhenToken = async ({ dispatch, ACTIONS }) => {
    try {
        dispatch({ type: ACTIONS.LOAD_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/me`, { withCredentials: true });

        dispatch({ type: ACTIONS.LOAD_SUCCESS, payload: { myProfile: data.myProfile, total: data.total } });
    } catch (err) {
        dispatch({ type: ACTIONS.LOAD_FAILURE, payload: err.response.data.message });
    }
};

export default LoadUserWhenToken;
