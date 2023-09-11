import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const UserSignUp = async ({ name, email, password, profile = null, handle, location = null, website = null, dispatch, ACTIONS }) => {
    try {
        dispatch({ type: ACTIONS.LOGIN_REQUEST });

        const { data } = await axios.post(
            "http://localhost:4000/api/v1/register",
            { name, email, password, profile, handle, location, website },
            {
                withCredentials: true,
                headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
            }
        );
        dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: data.user });
    } catch (err) {
        // Custom toast configuration
        const toastConfig = {
            position: "bottom-center",
            autoClose: 3000,
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

            dispatch({ type: ACTIONS.LOGIN_FAILURE, payload: err.response.data.message });
        }
    }
};

export default UserSignUp;
