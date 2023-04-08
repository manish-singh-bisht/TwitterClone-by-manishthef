import React, { useContext, useReducer } from "react";
import { UserReducer, ACTIONS, PostOfFollowingReducer, LikeUnlikeReducer, GetPostByIdReducer } from "./Reducers";

//creating context
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    //reducer setup
    const initialState = { loading: false, user: {}, error: "", isAuthenticated: false };
    const [state, dispatch] = useReducer(UserReducer, initialState);

    const initialStatePostOfFollowing = { loading: false, posts: [], error: "" };
    const [statePostOfFollowing, dispatchPostOfFollowing] = useReducer(PostOfFollowingReducer, initialStatePostOfFollowing);

    const initialStateGetPostById = { loading: false, post: {}, error: "" };
    const [stateGetPostById, dispatchGetPostById] = useReducer(GetPostByIdReducer, initialStateGetPostById);

    const initialStateLikeUnlike = { loading: false, error: "" };
    const [stateLikeUnlike, dispatchLikeUnlike] = useReducer(LikeUnlikeReducer, initialStateLikeUnlike);

    return <AppContext.Provider value={{ ACTIONS, state, dispatch, statePostOfFollowing, dispatchPostOfFollowing, stateGetPostById, dispatchGetPostById, stateLikeUnlike, dispatchLikeUnlike }}>{children}</AppContext.Provider>;
};

//custom hook for using context
export const useGlobalContext = () => {
    return useContext(AppContext);
};
export { AppContext, AppProvider };
