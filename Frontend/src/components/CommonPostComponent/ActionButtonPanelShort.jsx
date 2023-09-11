import React from "react";
import Retweet from "./Retweet";
import LikeUnlikePost from "./LikeUnlikePost";
import BookMark from "./BookMark";
import { Comments } from "../SVGs/SVGs";

const ActionButtonPanelShort = ({
    retweets,
    dispatchRetweet,
    handlerRetweet,
    postId,
    likes,
    dispatch,
    handler,
    bookmarks,
    dispatchBookmark,
    handlerBookmark,
    fromBookmarks,
    removeBookmark,
    ACTIONS,
    state,
    fromTweetDetail,
    fromCommentDetail,
    commentsChildren,
    comments,
    fromReply,
    replyChildren,
}) => {
    const actionButtons = [
        {
            name: "comments",
            component: <Comments />,
        },
        {
            name: "retweet",
            component: <Retweet retweets={retweets} ACTIONS={ACTIONS} dispatchRetweet={dispatchRetweet} state={state} handlerRetweet={handlerRetweet} postId={postId} />,
        },
        {
            name: "like",
            component: <LikeUnlikePost likes={likes} ACTIONS={ACTIONS} dispatch={dispatch} state={state} handler={handler} postId={postId} />,
        },
        {
            name: "bookmarke",
            component: <BookMark bookmarks={bookmarks} ACTIONS={ACTIONS} dispatchBookmark={dispatchBookmark} state={state} handlerBookmark={handlerBookmark} postId={postId} fromBookmarks={fromBookmarks} removeBookmark={(id) => removeBookmark(id)} />,
        },
    ];
    return (
        <div className="-mt-3 mb-2 ml-[4.25rem] flex w-[87.5%] gap-20  ">
            {actionButtons.map((button, index) => {
                return (
                    <div key={index}>
                        {!fromReply && button.name === "comments" ? (
                            <div className="group flex w-[3rem] items-center justify-around">
                                <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                                    <Comments />
                                </button>
                                {fromTweetDetail || fromCommentDetail ? (
                                    <span className="group-hover:text-blue-500">{commentsChildren.length > 0 ? commentsChildren.length : null}</span>
                                ) : (
                                    <span className="group-hover:text-blue-500">{comments.length > 0 ? comments.length : null}</span>
                                )}
                            </div>
                        ) : fromReply && button.name === "comments" ? (
                            <div className="group flex w-[3rem] items-center justify-around">
                                <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                                    <Comments />
                                </button>

                                <span className="group-hover:text-blue-500">{replyChildren.length > 0 ? replyChildren.length : null}</span>
                            </div>
                        ) : (
                            <div className=" group flex w-[3rem] items-center justify-around  ">{button.component}</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
export default ActionButtonPanelShort;
