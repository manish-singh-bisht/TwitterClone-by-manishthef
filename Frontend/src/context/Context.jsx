import React, { useReducer, useState } from "react";
import {
    UserReducer,
    ACTIONS,
    LikeUnlikeReducer,
    GetPostByIdReducer,
    commentReducer,
    commentLikeUnlikeReducer,
    commentDeleteReducer,
    mentionCollectorReducer,
    PostOfFollowingAndMeReducer,
    postTweetReducer,
    tweetDeleteReducer,
    RetweetCommentReducer,
    RetweetPostReducer,
    commentBookmarkReducer,
    tweetBookmarkReducer,
} from "./Reducers";

//creating context
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    //reducer setup
    const initialState = { loading: false, user: {}, error: "", isAuthenticated: false };
    const [state, dispatch] = useReducer(UserReducer, initialState);

    const initialStatePostOfFollowingAndMe = { loading: false, posts: [], error: "" };
    const [statePostOfFollowingAndMe, dispatchPostOfFollowingAndMe] = useReducer(PostOfFollowingAndMeReducer, initialStatePostOfFollowingAndMe);

    const initialStateGetPostById = { loading: false, post: {}, error: "" };
    const [stateGetPostById, dispatchGetPostById] = useReducer(GetPostByIdReducer, initialStateGetPostById);

    const initialStateLikeUnlike = { loading: false, message: "", error: "" };
    const [stateLikeUnlike, dispatchLikeUnlike] = useReducer(LikeUnlikeReducer, initialStateLikeUnlike);

    const initialStateRetweetPost = { loading: false, message: "", error: "" };
    const [stateRetweetPost, dispatchRetweetPost] = useReducer(RetweetPostReducer, initialStateRetweetPost);

    const initialStateRetweetComment = { loading: false, message: "", error: "" };
    const [stateRetweetComment, dispatchRetweetComment] = useReducer(RetweetCommentReducer, initialStateRetweetComment);

    const initialComment = { loading: false, comment: "", error: "" };
    const [stateComment, dispatchComment] = useReducer(commentReducer, initialComment);

    const initialLikeUnlikeComment = { loading: false, message: "", error: "" };
    const [stateCommentLikeUnlike, dispatchCommentLikeUnlike] = useReducer(commentLikeUnlikeReducer, initialLikeUnlikeComment);

    const deleteComment = { loading: false, message: "", error: "" };
    const [stateCommentDelete, dispatchCommentDelete] = useReducer(commentDeleteReducer, deleteComment);

    const mentionCollector = { mentions: [] };
    const [stateMentionCollector, dispatchMentionCollector] = useReducer(mentionCollectorReducer, mentionCollector);

    const initialStatePostTweet = { loading: false, tweet: [], error: "" };
    const [statePostTweet, dispatchPostTweet] = useReducer(postTweetReducer, initialStatePostTweet);

    const deleteTweet = { loading: false, message: "", error: "" };
    const [stateTweetDelete, dispatchTweetDelete] = useReducer(tweetDeleteReducer, deleteTweet);

    const bookmarkTweet = { loading: false, message: "", error: "" };
    const [stateBookmarkTweet, dispatchBookmarkTweet] = useReducer(tweetBookmarkReducer, bookmarkTweet);

    const bookmarkComment = { loading: false, message: "", error: "" };
    const [stateBookmarkComment, dispatchBookmarkComment] = useReducer(commentBookmarkReducer, bookmarkComment);

    return (
        <AppContext.Provider
            value={{
                posts,
                setPosts,
                ACTIONS,
                state,
                dispatch,
                statePostOfFollowingAndMe,
                dispatchPostOfFollowingAndMe,
                stateGetPostById,
                dispatchGetPostById,
                stateRetweetPost,
                stateRetweetComment,
                dispatchRetweetComment,
                dispatchRetweetPost,
                stateLikeUnlike,
                dispatchLikeUnlike,
                stateComment,
                dispatchComment,
                dispatchCommentLikeUnlike,
                stateCommentLikeUnlike,
                stateCommentDelete,
                dispatchCommentDelete,
                stateMentionCollector,
                dispatchMentionCollector,
                stateBookmarkComment,
                dispatchBookmarkComment,
                stateBookmarkTweet,
                dispatchBookmarkTweet,
                statePostTweet,
                dispatchPostTweet,
                stateTweetDelete,
                dispatchTweetDelete,
            }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
