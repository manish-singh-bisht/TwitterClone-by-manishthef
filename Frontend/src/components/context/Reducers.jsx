export const ACTIONS = {
    LOGIN_REQUEST: "login request",
    LOGIN_SUCCESS: "login success",
    LOGIN_FAILURE: "login failure",

    LOAD_REQUEST: "load request",
    LOAD_SUCCESS: "load success",
    LOAD_FAILURE: "load failure",

    POST_OF_FOLLOWING_REQUEST: " PostOfFollowing request",
    POST_OF_FOLLOWING_SUCCESS: " PostOfFollowing success",
    POST_OF_FOLLOWING_FAILURE: " PostOfFollowing failure",

    GET_ALL_USERS_REQUEST: " GetAllUsers request",
    GET_ALL_USERS_SUCCESS: " GetAllUsers success",
    GET_ALL_USERS_FAILURE: " GetAllUsers failure",

    CLEAR_ERRORS: "clear Errors",
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
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};

export const PostOfFollowingReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.POST_OF_FOLLOWING_REQUEST:
            return { ...state, loading: true, posts: [], error: "" };
        case ACTIONS.POST_OF_FOLLOWING_SUCCESS:
            return { ...state, loading: false, posts: action.payload, error: "" };
        case ACTIONS.POST_OF_FOLLOWING_FAILURE:
            return { ...state, loading: false, posts: [], error: action.payload };
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};

export const GetAllUsersReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.GET_ALL_USERS_REQUEST:
            return { ...state, loading: true, users: [], error: "" };
        case ACTIONS.GET_ALL_USERS_SUCCESS:
            return { ...state, loading: false, users: action.payload, error: "" };
        case ACTIONS.GET_ALL_USERS_FAILURE:
            return { ...state, loading: false, users: [], error: action.payload };
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};
