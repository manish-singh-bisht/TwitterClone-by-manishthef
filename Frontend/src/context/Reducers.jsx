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

    GET_POST_BY_ID_REQUEST: " GetPostById request",
    GET_POST_BY_ID_SUCCESS: " GetPostById success",
    GET_POST_BY_ID_FAILURE: " GetPostById failure",

    LIKE_UNLIKE_REQUEST: " LikeUnlike request",
    LIKE_UNLIKE_SUCCESS: " LikeUnlike success",
    LIKE_UNLIKE_FAILURE: " LikeUnlike failure",

    COMMENT_REQUEST: " Comment request",
    COMMENT_SUCCESS: " Comment success",
    COMMENT_FAILURE: " Comment failure",

    COMMENT_LIKE_UNLIKE_REQUEST: "Like Unlike Comment request",
    COMMENT_LIKE_UNLIKE_SUCCESS: "Like Unlike Comment success",
    COMMENT_LIKE_UNLIKE_FAILURE: "Like Unlike Comment failure",

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

export const GetPostByIdReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.GET_POST_BY_ID_REQUEST:
            return { ...state, loading: true, post: {}, error: "" };
        case ACTIONS.GET_POST_BY_ID_SUCCESS:
            return { ...state, loading: false, post: action.payload, error: "" };
        case ACTIONS.GET_POST_BY_ID_FAILURE:
            return { ...state, loading: false, post: {}, error: action.payload };
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};
export const LikeUnlikeReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.LIKE_UNLIKE_REQUEST:
            return { ...state, loading: true, message: "", error: "" };
        case ACTIONS.LIKE_UNLIKE_SUCCESS:
            return { ...state, loading: false, message: action.payload, error: "" };
        case ACTIONS.LIKE_UNLIKE_FAILURE:
            return { ...state, loading: false, message: "", error: action.payload };
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};

export const commentReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.COMMENT_REQUEST:
            return { ...state, loading: true, comment: "", error: "" };
        case ACTIONS.COMMENT_SUCCESS:
            return { ...state, loading: false, comment: action.payload, error: "" };
        case ACTIONS.COMMENT_FAILURE:
            return { ...state, loading: false, comment: "", error: action.payload };
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};
export const commentLikeUnlikeReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.COMMENT_LIKE_UNLIKE_REQUEST:
            return { ...state, loading: true, message: "", error: "" };
        case ACTIONS.COMMENT_LIKE_UNLIKE_SUCCESS:
            return { ...state, loading: false, message: action.payload, error: "" };
        case ACTIONS.COMMENT_LIKE_UNLIKE_FAILURE:
            return { ...state, loading: false, message: "", error: action.payload };
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};
