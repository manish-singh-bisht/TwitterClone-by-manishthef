export const ACTIONS = {
    LOGIN_REQUEST: "login request",
    LOGIN_SUCCESS: "login success",
    LOGIN_FAILURE: "login failure",

    LOAD_REQUEST: "load request",
    LOAD_SUCCESS: "load success",
    LOAD_FAILURE: "load failure",
};

export const UserReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.LOGIN_REQUEST:
            return { ...state, loading: true, user: {}, error: "", isAuthenticated: false };
        case ACTIONS.LOGIN_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: "", isAuthenticated: true };
        case ACTIONS.LOGIN_FAILURE:
            return { ...state, loading: false, user: {}, error: action.payload, isAuthenticated: false };

        case ACTIONS.LOAD_REQUEST:
            return { ...state, loading: true, user: {}, error: "", isAuthenticated: false };
        case ACTIONS.LOAD_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: "", isAuthenticated: true };
        case ACTIONS.LOAD_FAILURE:
            return { ...state, loading: false, user: {}, error: action.payload, isAuthenticated: false };

        default:
            return state;
    }
};
