import axios from "axios";

const UserLogin = async ({ email, password, dispatch, ACTIONS }) => {
    try {
        dispatch({ type: ACTIONS.LOGIN_REQUEST });

        const { data } = await axios.post(
            "http://localhost:4000/api/v1/login",
            { email, password },
            {
                withCredentials: true,
                headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
            }
        );
        dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: data.user });
    } catch (error) {
        dispatch({ type: ACTIONS.LOGIN_FAILURE, payload: error.response.data.message });
    }
};

export default UserLogin;
