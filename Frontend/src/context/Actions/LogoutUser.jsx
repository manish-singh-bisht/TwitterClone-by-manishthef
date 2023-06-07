import axios from "axios";

const LogoutUser = async ({ dispatch, ACTIONS }) => {
    try {
        dispatch({ type: ACTIONS.LOGOUT_REQUEST });

        await axios.get("http://localhost:4000/api/v1/logout", { withCredentials: true });
        dispatch({ type: ACTIONS.LOGOUT_SUCCESS });
    } catch (error) {
        dispatch({ type: ACTIONS.LOGOUT_FAILURE, payload: error.response.data.message });
    }
};

export default LogoutUser;
