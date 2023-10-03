import axios from "axios";
import { API_BASE_URL } from "../../../config";

const LogoutUser = async ({ dispatch, ACTIONS }) => {
    try {
        dispatch({ type: ACTIONS.LOGOUT_REQUEST });

        await axios.get(`${API_BASE_URL}/logout`, { withCredentials: true });
        dispatch({ type: ACTIONS.LOGOUT_SUCCESS });
    } catch (error) {
        dispatch({ type: ACTIONS.LOGOUT_FAILURE, payload: error.response.data.message });
    }
};

export default LogoutUser;
