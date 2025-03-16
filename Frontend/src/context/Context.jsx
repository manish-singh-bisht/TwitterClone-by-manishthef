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
    followUserReducer,
} from "./Reducers";

//creating context
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [mainTweetDetailPost, setMainTweetDetailPost] = useState();
    const [usersForRightSidebar, setUsersForRightSidebar] = useState([]);
    const [dataArray, setDataArray] = useState([]);
    const [CommentArray, setCommentArray] = useState([]); //for tweetDetail
    const [comment, setComment] = useState({ comments: [], activeComment: {} }); //for CommentDetail
    const [parentCollection, setParentCollection] = useState([]); //for getting the parent/parents
    const [parentCollectionId, setParentCollectionId] = useState([]); //for getting parent/parents id only

    //reducer setup
    const initialState = { loading: false, user: {}, total: {}, error: "", isAuthenticated: false };
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

    const initialStateFollowUser = { loading: false, message: "", error: "" };
    const [stateFollowUser, dispatchFollowUser] = useReducer(followUserReducer, initialStateFollowUser);

    return (
        <AppContext.Provider
            value={{
                posts,
                usersForRightSidebar,
                setUsersForRightSidebar,
                setPosts,
                dataArray,
                setDataArray,
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
                stateFollowUser,
                dispatchFollowUser,
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
                CommentArray,
                setCommentArray,
                comment,
                setComment,
                parentCollectionId,
                setParentCollectionId,
                parentCollection,
                setParentCollection,
                mainTweetDetailPost,
                setMainTweetDetailPost,
            }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
