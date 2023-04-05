import React from "react";

const GetAllUsers = async ({ dispatchGetAllUsers, ACTIONS }) => {
    try {
        dispatchGetAllUsers({ type: ACTIONS.GET_ALL_USERS_REQUEST });
        const { data } = await axios.get("http://localhost:4000/api/v1/users", { withCredentials: true });
        dispatchGetAllUsers({ type: ACTIONS.GET_ALL_USERS_SUCCESS, payload: data.users });
    } catch (error) {
        dispatchGetAllUsers({ type: ACTIONS.GET_ALL_USERS_FAILURE, payload: error.response.data.message });
    }
};

export default GetAllUsers;
