import axios from "axios";

const LoadUserWhenToken = async ({ dispatch, ACTIONS }) => {
    try {
        dispatch({ type: ACTIONS.LOAD_REQUEST });

        const { data } = await axios.get("http://localhost:4000/api/v1/me", { withCredentials: true });

        dispatch({ type: ACTIONS.LOAD_SUCCESS, payload: data.myProfile });
    } catch (error) {
        dispatch({ type: ACTIONS.LOAD_FAILURE, payload: error.response.data.message });
    }
};

export default LoadUserWhenToken;
