import axios from "axios";

const FollowUser = async ({ dispatchFollowUser, ACTIONS, id }) => {
    try {
        dispatchFollowUser({ type: ACTIONS.FOLLOW_USER_REQUEST });

        await axios.get(`http://localhost:4000/api/v1/follow/${id}`, { withCredentials: true });
        dispatchFollowUser({ type: ACTIONS.FOLLOW_USER_SUCCESS });
    } catch (error) {
        dispatchFollowUser({ type: ACTIONS.FOLLOW_USER_FAILURE, payload: error.response.data.message });
    }
};

export default FollowUser;
