import React, { useContext, useReducer } from "react";
import { UserReducer, ACTIONS, PostOfFollowingReducer, GetAllUsersReducer } from "./Reducers";

//creating context
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    //reducer setup
    const initialState = { loading: false, user: {}, error: "", isAuthenticated: false };
    const [state, dispatch] = useReducer(UserReducer, initialState);

    const initialStatePostOfFollowing = { loading: false, posts: [], error: "" };
    const [statePostOfFollowing, dispatchPostOfFollowing] = useReducer(PostOfFollowingReducer, initialStatePostOfFollowing);

    const initialStateGetAllUsers = { loading: false, users: [], error: "" };
    const [stateGetAllUsers, dispatchGetAllUsers] = useReducer(GetAllUsersReducer, initialStateGetAllUsers);

    return <AppContext.Provider value={{ state, dispatch, statePostOfFollowing, dispatchPostOfFollowing, ACTIONS, stateGetAllUsers, dispatchGetAllUsers }}>{children}</AppContext.Provider>;
};

//custom hook for using context
export const useGlobalContext = () => {
    return useContext(AppContext);
};
export { AppContext, AppProvider };
