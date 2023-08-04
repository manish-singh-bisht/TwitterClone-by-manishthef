export const ACTIONS = {
    LOGIN_REQUEST: "login request",
    LOGIN_SUCCESS: "login success",
    LOGIN_FAILURE: "login failure",

    LOAD_REQUEST: "load request",
    LOAD_SUCCESS: "load success",
    LOAD_FAILURE: "load failure",

    LOGOUT_REQUEST: "logout request",
    LOGOUT_SUCCESS: "logout success",
    LOGOUT_FAILURE: "logout failure",

    POST_OF_FOLLOWING_AND_ME_REQUEST: " PostOfFollowingAndMe request",
    POST_OF_FOLLOWING_AND_ME_SUCCESS: " PostOfFollowingAndMe success",
    POST_OF_FOLLOWING_AND_ME_FAILURE: " PostOfFollowingAndMe failure",

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

    COMMENT_DELETE_REQUEST: "Delete Comment request",
    COMMENT_DELETE_SUCCESS: "Delete Comment success",
    COMMENT_DELETE_FAILURE: "Delete Comment failure",

    MENTION_COLLECTOR_SUCCESS: "Mention Collector Success",

    POST_TWEET_REQUEST: "Post Tweet request",
    POST_TWEET_SUCCESS: "Post Tweet success",
    POST_TWEET_FAILURE: "Post Tweet failure",

    TWEET_DELETE_REQUEST: "Delete Tweet request",
    TWEET_DELETE_SUCCESS: "Delete Tweet success",
    TWEET_DELETE_FAILURE: "Delete Tweet failure",

    RETWEET_COMMENT_REQUEST: "Retweet Comment request",
    RETWEET_COMMENT_SUCCESS: "Retweet Comment success",
    RETWEET_COMMENT_FAILURE: "Retweet Comment Failure",

    RETWEET_POST_REQUEST: "Retweet Post request",
    RETWEET_POST_SUCCESS: "Retweet Post success",
    RETWEET_POST_FAILURE: "Retweet Post Failure",

    BOOKMARK_POST_REQUEST: "Bookmark Post request",
    BOOKMARK_POST_SUCCESS: "Bookmark Post success",
    BOOKMARK_POST_FAILURE: "Bookmark Post Failure",

    BOOKMARK_COMMENT_REQUEST: "Bookmark Comment request",
    BOOKMARK_COMMENT_SUCCESS: "Bookmark Comment success",
    BOOKMARK_COMMENT_FAILURE: "Bookmark Comment Failure",

    FOLLOW_USER_REQUEST: "Follow User request",
    FOLLOW_USER_SUCCESS: "Follow User success",
    FOLLOW_USER_FAILURE: "Follow User Failure",

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
            return { ...state, loading: true, user: {}, total: {}, error: "", isAuthenticated: false };
        case ACTIONS.LOAD_SUCCESS:
            return { ...state, loading: false, user: action.payload.myProfile, total: action.payload.total, error: "", isAuthenticated: true };
        case ACTIONS.LOAD_FAILURE:
            return { ...state, loading: false, user: {}, total: {}, error: action.payload, isAuthenticated: false };

        case ACTIONS.LOGOUT_REQUEST:
            return { ...state, loading: true, user: {}, error: "", isAuthenticated: false };
        case ACTIONS.LOGOUT_SUCCESS:
            return { ...state, loading: false, user: null, error: "", isAuthenticated: false };
        case ACTIONS.LOGOUT_FAILURE:
            return { ...state, loading: false, error: action.payload, isAuthenticated: true };

        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};

export const PostOfFollowingAndMeReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.POST_OF_FOLLOWING_AND_ME_REQUEST:
            return { ...state, loading: true, posts: [], error: "" };
        case ACTIONS.POST_OF_FOLLOWING_AND_ME_SUCCESS:
            return { ...state, loading: false, posts: action.payload, error: "" };
        case ACTIONS.POST_OF_FOLLOWING_AND_ME_FAILURE:
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
export const commentDeleteReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.COMMENT_DELETE_REQUEST:
            return { ...state, loading: true, message: "", error: "" };
        case ACTIONS.COMMENT_DELETE_SUCCESS:
            return { ...state, loading: false, message: action.payload, error: "" };
        case ACTIONS.COMMENT_DELETE_FAILURE:
            return { ...state, loading: false, message: "", error: action.payload };
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};
export const mentionCollectorReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.MENTION_COLLECTOR_SUCCESS:
            return { mentions: action.payload };

        default:
            return state;
    }
};
export const postTweetReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.POST_TWEET_REQUEST:
            return { ...state, loading: true, tweet: [], error: "" };
        case ACTIONS.POST_TWEET_SUCCESS:
            return { ...state, loading: false, tweet: action.payload, error: "" };
        case ACTIONS.POST_TWEET_FAILURE:
            return { ...state, loading: false, tweet: [], error: action.payload };
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};
export const tweetDeleteReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.TWEET_DELETE_REQUEST:
            return { ...state, loading: true, message: "", error: "" };
        case ACTIONS.TWEET_DELETE_SUCCESS:
            return { ...state, loading: false, message: action.payload, error: "" };
        case ACTIONS.TWEET_DELETE_FAILURE:
            return { ...state, loading: false, message: "", error: action.payload };
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};
export const RetweetPostReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.RETWEET_POST_REQUEST:
            return { ...state, loading: true, message: "", error: "" };
        case ACTIONS.RETWEET_POST_SUCCESS:
            return { ...state, loading: false, message: action.payload, error: "" };
        case ACTIONS.RETWEET_POST_FAILURE:
            return { ...state, loading: false, message: "", error: action.payload };
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};
export const RetweetCommentReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.RETWEET_COMMENT_REQUEST:
            return { ...state, loading: true, message: "", error: "" };
        case ACTIONS.RETWEET_COMMENT_SUCCESS:
            return { ...state, loading: false, message: action.payload, error: "" };
        case ACTIONS.RETWEET_COMMENT_FAILURE:
            return { ...state, loading: false, message: "", error: action.payload };
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};
export const commentBookmarkReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.BOOKMARK_COMMENT_REQUEST:
            return { ...state, loading: true, message: "", error: "" };
        case ACTIONS.BOOKMARK_COMMENT_SUCCESS:
            return { ...state, loading: false, message: action.payload, error: "" };
        case ACTIONS.BOOKMARK_COMMENT_FAILURE:
            return { ...state, loading: false, message: "", error: action.payload };
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};
export const tweetBookmarkReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.BOOKMARK_POST_REQUEST:
            return { ...state, loading: true, message: "", error: "" };
        case ACTIONS.BOOKMARK_POST_SUCCESS:
            return { ...state, loading: false, message: action.payload, error: "" };
        case ACTIONS.BOOKMARK_POST_FAILURE:
            return { ...state, loading: false, message: "", error: action.payload };
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};
export const followUserReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.FOLLOW_USER_REQUEST:
            return { ...state, loading: true, message: "", error: "" };
        case ACTIONS.FOLLOW_USER_SUCCESS:
            return { ...state, loading: false, message: action.payload, error: "" };
        case ACTIONS.FOLLOW_USER_FAILURE:
            return { ...state, loading: false, message: "", error: action.payload };
        case ACTIONS.CLEAR_ERRORS:
            return { ...state, error: "" };

        default:
            return state;
    }
};
