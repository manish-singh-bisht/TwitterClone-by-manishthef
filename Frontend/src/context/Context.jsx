import React, { useReducer } from "react";
import { UserReducer, ACTIONS, LikeUnlikeReducer, GetPostByIdReducer, commentReducer, commentLikeUnlikeReducer, commentDeleteReducer, mentionCollectorReducer, PostOfFollowingAndMeReducer } from "./Reducers";

//creating context
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    //reducer setup
    const initialState = { loading: false, user: {}, error: "", isAuthenticated: false };
    const [state, dispatch] = useReducer(UserReducer, initialState);

    const initialStatePostOfFollowingAndMe = { loading: false, posts: [], error: "" };
    const [statePostOfFollowingAndMe, dispatchPostOfFollowingAndMe] = useReducer(PostOfFollowingAndMeReducer, initialStatePostOfFollowingAndMe);

    const initialStateGetPostById = { loading: false, post: {}, error: "" };
    const [stateGetPostById, dispatchGetPostById] = useReducer(GetPostByIdReducer, initialStateGetPostById);

    const initialStateLikeUnlike = { loading: false, message: "", error: "" };
    const [stateLikeUnlike, dispatchLikeUnlike] = useReducer(LikeUnlikeReducer, initialStateLikeUnlike);

    const initialComment = { loading: false, comment: "", error: "" };
    const [stateComment, dispatchComment] = useReducer(commentReducer, initialComment);

    const initialLikeUnlikeComment = { loading: false, message: "", error: "" };
    const [stateCommentLikeUnlike, dispatchCommentLikeUnlike] = useReducer(commentLikeUnlikeReducer, initialLikeUnlikeComment);

    const deleteComment = { loading: false, message: "", error: "" };
    const [stateCommentDelete, dispatchCommentDelete] = useReducer(commentDeleteReducer, deleteComment);

    const mentionCollector = { mentions: [] };
    const [stateMentionCollector, dispatchMentionCollector] = useReducer(mentionCollectorReducer, mentionCollector);

    return (
        <AppContext.Provider
            value={{
                ACTIONS,
                state,
                dispatch,
                statePostOfFollowingAndMe,
                dispatchPostOfFollowingAndMe,
                stateGetPostById,
                dispatchGetPostById,
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
            }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
