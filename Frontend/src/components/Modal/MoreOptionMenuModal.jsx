import React, { Suspense, useEffect, useRef, useState } from "react";
import { Delete, PushPin, UserMinus, UserPlus } from "../SVGs/SVGs";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import DeleteComment from "../../context/Actions/DeleteComment";

import DeleteLogoutModal from "./DeleteLogoutModal";
import Loader from "../Loader/Loader";
import DeletePost from "../../context/Actions/DeletePost";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import FollowUser from "../../context/Actions/FollowUser";
import useModal from "../../CustomHooks/useModal";

const MoreOptionMenuModal = ({
    visibility,
    handleOutsideClick,
    buttonPosition,
    infoToMoreOptionModal,
    onCloseMoreOptionModal,
    fromReplies,
    fromActiveComment,
    deleteReplyHandler,
    detailsOfActiveComment,
    fromSideBar,
    fromMobileSidebar,
    logOutUser,
    fromCommentDetail,
    fromHome,
    fromTweetDetail,
    isCommentRetweet,
    fromBookmarks,
    deleteAllBookmarks,
    setVisibilityBookmark,
    fromBookmarksForDeletingCommentPost,
    removeBookmark,
    fromProfileTweets,
    fromMediaLikesProfile,
    fromProfileRepliesParentPost,
    fromProfileRepliesComment,
    setIsPinned,
}) => {
    if (!visibility) return;

    const modalRef = useRef(null);
    const navigate = useNavigate();
    const { state, dispatchCommentDelete, dispatch, ACTIONS, setPosts, dispatchTweetDelete, dispatchFollowUser, setDataArray } = useGlobalContext();

    const [isAlreadyFollowing, setIsAlreadyFollowing] = useState({ bool: false, handle: "", ownerid: null });

    const toastConfig = {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        closeButton: false,
        style: {
            backgroundColor: "#1DA1F2",
            border: "none",
            boxShadow: "none",
            width: "fit-content",
            zIndex: 9999,
            color: "white",
            padding: "0px 16px",
            minHeight: "3rem",
        },
    };
    const [visibilityDeleteModal, setVisibilityDeleteModal, handleOutsideClickDeleteModal, onClose] = useModal();

    useEffect(() => {
        const positionModal = () => {
            const modalRect = modalRef.current.getBoundingClientRect();
            let top = 0;
            let left = 0;

            // Calculate the desired position
            if (!fromSideBar && !fromBookmarks) {
                if (state.user._id === infoToMoreOptionModal.ownerID) {
                    top = buttonPosition.top - modalRect.height + 83;
                    left = buttonPosition.left - modalRect.width + 25;
                } else {
                    top = buttonPosition.top - modalRect.height + 35;
                    left = buttonPosition.left - modalRect.width + 25;
                }
            } else {
                if (fromBookmarks) {
                    top = buttonPosition.top - 24;
                    left = buttonPosition.left - 140;
                } else {
                    top = buttonPosition.top - 79;
                    left = buttonPosition.left - 30;
                }
            }

            // Apply the position to the modal
            modalRef.current.style.top = `${top}px`;
            modalRef.current.style.left = `${left}px`;
        };

        if (visibility && buttonPosition) {
            positionModal();
        }
        followedOrNot();
    }, [visibility, buttonPosition]);

    const followedOrNot = async () => {
        const ownerID = infoToMoreOptionModal.ownerID;
        const handle = infoToMoreOptionModal.handle;

        if (state.user.following.includes(ownerID)) {
            setIsAlreadyFollowing({ bool: true, handle: handle, ownerid: ownerID });
        } else {
            setIsAlreadyFollowing({ bool: false, handle: handle, ownerid: ownerID });
        }
    };

    const followUnfollowHandler = async () => {
        const id = isAlreadyFollowing.ownerid;
        await FollowUser({ dispatchFollowUser, ACTIONS, id });
        const { data } = await axios.get("http://localhost:4000/api/v1/me", { withCredentials: true });

        await dispatch({ type: ACTIONS.LOAD_SUCCESS, payload: { myProfile: data.myProfile, total: data.total } });
    };

    const deleteHandler = async () => {
        const postID = infoToMoreOptionModal.postID;
        let tempPostId = postID;
        const commentID = infoToMoreOptionModal.commentID;
        let tempCommentId = commentID;

        if (fromProfileTweets) {
            //can be a tweet, a comment retweet, a post retweet
            setDataArray((prev) =>
                prev.filter((item) => {
                    if (item.onModel === "Comments") {
                        tempPostId = ""; //by doing this only the comment gets deleted and not the post as well, because in comment type it will have both postid and commentid initiating both,a post will only have a postid not causing same effect for the comment.
                        return item.originalPost._id !== commentID;
                    }
                    if (item.onModel === "Posts") {
                        return item.originalPost._id !== tempPostId;
                    }
                    if (item.onModel === undefined) {
                        return item._id !== tempPostId;
                    }
                })
            );
            toast("Your Tweet was deleted", toastConfig);
            if (postID && commentID) {
                await axios.delete(`http://localhost:4000/api/v1/${postID}/${commentID}`, { withCredentials: true });
            } else if (postID && commentID === undefined) {
                await DeletePost({ dispatchTweetDelete, ACTIONS, postID });
            }
        } else if (fromMediaLikesProfile) {
            //can be a tweet, a comment
            setDataArray((prev) =>
                prev.filter((item) => {
                    if (item.comment) {
                        tempPostId = ""; //by doing this only the comment gets deleted and not the post as well, because in comment type it will have both postid and commentid initiating both,a post will only have a postid not causing same effect for the comment.
                        return item._id !== commentID;
                    }
                    if (item.tweet) {
                        return item._id !== tempPostId;
                    }
                })
            );
            toast("Your Tweet was deleted", toastConfig);
            if (postID && commentID) {
                await axios.delete(`http://localhost:4000/api/v1/${postID}/${commentID}`, { withCredentials: true });
            } else if (postID && commentID === undefined) {
                await DeletePost({ dispatchTweetDelete, ACTIONS, postID });
            }
        }

        if (fromProfileRepliesParentPost) {
            //parent post
            setDataArray((prev) =>
                prev.filter((item) => {
                    if (item.comment && item.post && item.post.tweet && commentID === undefined) {
                        return item.post._id !== postID;
                    } else {
                        return true;
                    }
                })
            );
            toast("Your Tweet was deleted", toastConfig);
            if (postID && commentID === undefined) {
                await DeletePost({ dispatchTweetDelete, ACTIONS, postID });
            }
        } else if (fromProfileRepliesComment) {
            //retweet post and comment,comment

            setDataArray((prev) =>
                prev.filter((item) => {
                    if (item.onModel === "Posts" && commentID === undefined) {
                        tempCommentId = "";
                        return item.originalPost._id !== tempPostId;
                    }
                    if (item.onModel === "Comments") {
                        tempPostId = "";
                        return item.originalPost._id !== tempCommentId;
                    }
                    if (item.onModel === undefined) {
                        tempCommentId = "";
                        return item._id !== commentID;
                    } else {
                        return true;
                    }
                })
            );
            toast("Your Tweet was deleted", toastConfig);
            if (postID && commentID === undefined) {
                await DeletePost({ dispatchTweetDelete, ACTIONS, postID });
            } else if (postID && commentID) {
                await axios.delete(`http://localhost:4000/api/v1/${postID}/${commentID}`, { withCredentials: true });
            }
        }

        if (fromBookmarksForDeletingCommentPost && commentID === undefined) {
            toast("Your Tweet was deleted", toastConfig);
            removeBookmark(postID);
            await DeletePost({ dispatchTweetDelete, ACTIONS, postID });
        }
        if (fromHome) {
            setPosts((prev) =>
                prev.filter((item) => {
                    if (item.onModel === "Comments") {
                        tempPostId = ""; //by doing this only the comment gets deleted and not the post as well, because in comment type it will have both postid and commentid initiating both,a post will only have a postid not causing same effect for the comment.
                        return item.originalPost._id !== commentID;
                    }
                    if (item.onModel === "Posts") {
                        return item.originalPost._id !== tempPostId;
                    }
                    if (item.onModel === undefined) {
                        return item._id !== tempPostId;
                    }
                })
            );
            toast("Your Tweet was deleted", toastConfig);
            if (isCommentRetweet) {
                await axios.delete(`http://localhost:4000/api/v1/${postID}/${commentID}`, { withCredentials: true });
            } else {
                await DeletePost({ dispatchTweetDelete, ACTIONS, postID });
            }
        } else if (fromTweetDetail && commentID === undefined) {
            const post = await DeletePost({ dispatchTweetDelete, ACTIONS, postID });
            toast("Your Tweet was deleted", toastConfig);
            navigate(`/`, {
                replace: true,
            });
        } else {
            if (fromBookmarksForDeletingCommentPost) {
                removeBookmark(commentID);
            }
            if (!fromProfileTweets && !fromMediaLikesProfile && !fromProfileRepliesParentPost && !fromProfileRepliesComment) {
                await DeleteComment({ dispatchCommentDelete, ACTIONS, postID, commentID });
            }
        }
    };

    const pinHandler = async (handle, tweetId) => {
        if (!state.user.pinnedTweet && infoToMoreOptionModal.commentID === undefined) {
            const { data } = await axios.get(`http://localhost:4000/api/v1/pinTweet/${handle}/${tweetId}`, { withCredentials: true });

            setDataArray((prev) => {
                const pinnedTweetIndex = prev.findIndex((tweet) => {
                    if (!tweet.originalPost) return tweet._id === tweetId;
                });

                if (pinnedTweetIndex !== -1) {
                    const pinnedTweet = prev[pinnedTweetIndex];
                    const pinnedTweetCopy = { ...pinnedTweet };

                    prev.splice(pinnedTweetIndex, 1);
                    const newArray = [pinnedTweetCopy, ...prev];

                    return newArray;
                }

                return prev;
            });

            {
                fromProfileTweets && setIsPinned({ bool: true, id: tweetId });
            }

            toast(data.message, toastConfig);
        } else if (state.user.pinnedTweet && state.user.pinnedTweet !== infoToMoreOptionModal.postID && infoToMoreOptionModal.commentID === undefined) {
            const { data } = await axios.put(`http://localhost:4000/api/v1/pinTweet/${handle}/${tweetId}`, null, { withCredentials: true });

            setDataArray((prev) => {
                const pinnedTweetIndex = prev.findIndex((tweet) => {
                    if (!tweet.originalPost) return tweet._id === tweetId;
                });

                if (pinnedTweetIndex !== -1) {
                    const pinnedTweet = prev[pinnedTweetIndex];
                    const pinnedTweetCopy = { ...pinnedTweet };

                    prev.splice(pinnedTweetIndex, 1);
                    const newArray = [pinnedTweetCopy, ...prev];

                    return newArray;
                }

                return prev;
            });
            {
                fromProfileTweets && setIsPinned({ bool: true, id: tweetId });
            }

            toast(data.message, toastConfig);
        } else if (infoToMoreOptionModal.commentID) {
            toast("Only Tweet can be pinned.", toastConfig);
        } else {
            const { data } = await axios.get(`http://localhost:4000/api/v1/unpinTweet/${handle}/${tweetId}`, { withCredentials: true });

            setDataArray((prev) => {
                const pinnedTweetIndex = prev.findIndex((tweet) => {
                    if (!tweet.originalPost) return tweet._id === tweetId;
                });

                if (pinnedTweetIndex !== -1) {
                    const pinnedTweet = prev[pinnedTweetIndex];
                    prev.splice(pinnedTweetIndex, 1);
                    const originalIndex = prev.findIndex((tweet) => tweet.createdAt < pinnedTweet.createdAt);

                    if (originalIndex !== -1) {
                        prev.splice(originalIndex, 0, pinnedTweet);
                    } else {
                        prev.push(pinnedTweet);
                    }

                    return [...prev];
                }

                return prev;
            });

            {
                fromProfileTweets && setIsPinned({ bool: false, id: null });
            }
            toast(data.message, toastConfig);
        }
        const { data } = await axios.get("http://localhost:4000/api/v1/me", { withCredentials: true });

        await dispatch({ type: ACTIONS.LOAD_SUCCESS, payload: { myProfile: data.myProfile, total: data.total } });
    };
    return (
        <div className="fixed inset-0 z-30 h-[100vh] w-[100vw] ">
            <div className="fixed z-10  h-full w-full" onClick={handleOutsideClick}></div>
            <div className={`relative z-30   ${fromBookmarks ? "w-[60vw] lg:w-fit" : "w-[60vw] lg:w-[20rem]"}  rounded-xl border-2 bg-white shadow-md`} ref={modalRef}>
                {!fromSideBar && !fromBookmarks ? (
                    state.user._id === infoToMoreOptionModal.ownerID ? (
                        <>
                            <button
                                className="flex w-full items-center gap-2 rounded-xl p-3 text-red-400 hover:bg-gray-50  xl:gap-3"
                                onClick={(e) => {
                                    setVisibilityDeleteModal(true);
                                    e.stopPropagation();
                                    document.body.style.overflow = "hidden";
                                }}>
                                <Delete />
                                <div className="font-bold ">Delete</div>
                            </button>
                            <button
                                className="flex w-full items-center gap-2 rounded-xl p-3 hover:bg-gray-50 xl:gap-3  "
                                onClick={() => {
                                    pinHandler(infoToMoreOptionModal.handle, infoToMoreOptionModal.postID);
                                    onCloseMoreOptionModal();
                                }}>
                                <PushPin />
                                <div className="font-bold ">{state.user.pinnedTweet && state.user.pinnedTweet === infoToMoreOptionModal.postID ? "Unpin from profile" : "Pin to your Profile"}</div>
                            </button>
                        </>
                    ) : (
                        <button
                            className="flex w-full items-center gap-2 rounded-xl p-3 hover:bg-gray-50  xl:gap-3"
                            onClick={() => {
                                followUnfollowHandler();
                                onCloseMoreOptionModal();
                            }}>
                            {isAlreadyFollowing.bool ? <UserMinus /> : <UserPlus />}
                            <div className="font-bold ">
                                {isAlreadyFollowing.bool
                                    ? `Unfollow @${isAlreadyFollowing.handle.length > 20 ? isAlreadyFollowing.handle.slice(0, 20).trim() + "..." : isAlreadyFollowing.handle}`
                                    : `Follow @${isAlreadyFollowing.handle.length > 20 ? isAlreadyFollowing.handle.slice(0, 20).trim() + "..." : isAlreadyFollowing.handle}`}
                            </div>
                        </button>
                    )
                ) : fromBookmarks ? (
                    <button
                        className="flex w-full items-center gap-2 rounded-xl p-3   text-red-400 hover:bg-gray-50  xl:gap-3"
                        onClick={() => {
                            setVisibilityBookmark(false);
                            deleteAllBookmarks();
                        }}>
                        <div className="font-bold ">Clear all Bookmarks</div>
                    </button>
                ) : (
                    <button
                        className={`flex w-full items-center justify-center gap-2 rounded-xl bg-black p-3  text-red-500 hover:bg-gray-800 xl:gap-3 ${fromMobileSidebar && "ml-6 py-5"} `}
                        onClick={(e) => {
                            setVisibilityDeleteModal(true);
                            e.stopPropagation();
                            document.body.style.overflow = "hidden";
                        }}>
                        <div className=" font-bold">
                            Logout <span className="max-w-[100%] break-words text-white">{`@${state.user.handle}`}</span>
                        </div>
                    </button>
                )}
            </div>

            <Suspense fallback={<Loader />}>
                <DeleteLogoutModal
                    visibility={visibilityDeleteModal}
                    handleOutsideClick={handleOutsideClickDeleteModal}
                    fromDelete={true}
                    deleteHandler={deleteHandler}
                    onClose={onClose}
                    onCloseMoreOptionModal={onCloseMoreOptionModal}
                    fromReplies={fromReplies}
                    deleteReplyHandler={deleteReplyHandler}
                    fromActiveComment={fromActiveComment}
                    infoToDeleteModal={infoToMoreOptionModal}
                    detailsOfActiveComment={detailsOfActiveComment}
                    fromSideBar={fromSideBar}
                    logOutUser={logOutUser}
                    fromCommentDetail={fromCommentDetail}
                />
            </Suspense>
        </div>
    );
};

export default MoreOptionMenuModal;
