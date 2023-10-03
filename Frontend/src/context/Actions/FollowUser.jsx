import axios from "axios";
import { API_BASE_URL } from "../../../config";

const FollowUser = async ({ dispatchFollowUser, ACTIONS, id }) => {
    try {
        dispatchFollowUser({ type: ACTIONS.FOLLOW_USER_REQUEST });

        await axios.get(`${API_BASE_URL}/follow/${id}`, { withCredentials: true });
        dispatchFollowUser({ type: ACTIONS.FOLLOW_USER_SUCCESS });
    } catch (error) {
        dispatchFollowUser({ type: ACTIONS.FOLLOW_USER_FAILURE, payload: error.response.data.message });
    }
};

export default FollowUser;
