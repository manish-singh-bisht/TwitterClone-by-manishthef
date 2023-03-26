import React, { useContext, useReducer } from "react";
import { UserReducer, ACTIONS } from "./Reducers";

//creating context
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    //reducer setup
    const initialState = { loading: false, user: {}, error: "", isAuthenticated: false };
    const [state, dispatch] = useReducer(UserReducer, initialState);

    return <AppContext.Provider value={{ state, dispatch, ACTIONS }}>{children}</AppContext.Provider>;
};

//custom hook for using context
export const useGlobalContext = () => {
    return useContext(AppContext);
};
export { AppContext, AppProvider };
