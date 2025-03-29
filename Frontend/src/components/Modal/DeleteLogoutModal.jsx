import React from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";

const DeleteLogoutModal = ({
    visibility,
    handleOutsideClick,
    fromDelete,
    deleteHandler,
    onClose,
    onCloseMoreOptionModal,
    fromReplies,
    deleteReplyHandler,
    fromActiveComment,
    infoToDeleteModal,
    detailsOfActiveComment,
    fromSideBar,
    logOutUser,
    fromCommentDetail,
}) => {
    if (!visibility) return;
    const navigate = useNavigate();
    const { mainTweetDetailPost, setMainTweetDetailPost } = useGlobalContext();
    return (
        <div className="fixed inset-0 z-30 flex h-[100vh] w-[100vw] items-center justify-center">
            <div className={`fixed  h-full w-full ${fromSideBar ? "bg-black  " : "bg-black opacity-20"}`} onClick={handleOutsideClick}></div>
            {fromDelete && (
                <div className="z-10 flex h-[20rem] w-[20rem] flex-col gap-2 rounded-2xl bg-white p-8">
                    <div className=" text-[1.4rem] font-semibold">{`${fromSideBar ? "Log out of Twitter?" : "Delete Tweet? "}`}</div>
                    <div className="text-[0.97rem] text-gray-600">{`${
                        fromSideBar
                            ? "You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account."
                            : "This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from Twitter search results."
                    }`}</div>
                    <div className="flex flex-col gap-3 pt-3">
                        <button
                            className={`flex h-10 w-64 items-center justify-center rounded-3xl ${fromSideBar ? "bg-black hover:bg-gray-700 active:bg-gray-500" : "bg-red-500 hover:bg-red-600 active:bg-red-700"}  text-[1rem] font-semibold text-white `}
                            onClick={() => {
                                if (fromReplies) {
                                    deleteHandler();
                                    onClose();
                                    onCloseMoreOptionModal();
                                    deleteReplyHandler();
                                    navigate(`/${mainTweetDetailPost.post.owner.name}/${infoToDeleteModal.postID}`, {
                                        state: {
                                            tweet: mainTweetDetailPost.post.tweet,
                                            ownerName: mainTweetDetailPost.post.owner.name,
                                            timeCreated: mainTweetDetailPost.post.createdAt,
                                            ownerId: mainTweetDetailPost.post.owner._id,
                                            handle: mainTweetDetailPost.post.owner.handle,
                                            postImage: mainTweetDetailPost.post.images,
                                            ownerImage: mainTweetDetailPost.post.owner.profile && mainTweetDetailPost.post.owner.profile.image.url ? mainTweetDetailPost.post.owner.profile.image.url : null,
                                            mentions: mainTweetDetailPost.post.mentions,
                                            description: mainTweetDetailPost.post.owner.description,

                                            whoCanReply: mainTweetDetailPost.post.whoCanReply,
                                            whoCanReplyNumber: mainTweetDetailPost.post.whoCanReplyNumber,
                                        },
                                    });
                                } else if (fromActiveComment) {
                                    deleteHandler();
                                    onClose();
                                    onCloseMoreOptionModal();
                                    navigate(`/${detailsOfActiveComment.post.owner.name}/${infoToDeleteModal.postID}`, {
                                        state: {
                                            tweet: detailsOfActiveComment.post.tweet,
                                            ownerName: detailsOfActiveComment.post.owner.name,
                                            timeCreated: detailsOfActiveComment.post.createdAt,
                                            ownerId: detailsOfActiveComment.post.owner._id,
                                            handle: detailsOfActiveComment.post.owner.handle,
                                            postImage: detailsOfActiveComment.post.images,
                                            ownerImage: detailsOfActiveComment.post.owner.profile && detailsOfActiveComment.post.owner.profile.image.url ? detailsOfActiveComment.post.owner.profile.image.url : null,
                                            mentions: detailsOfActiveComment.post.mentions,
                                            description: detailsOfActiveComment.post.owner.description,

                                            whoCanReply: detailsOfActiveComment.post.whoCanReply,
                                            whoCanReplyNumber: detailsOfActiveComment.post.whoCanReplyNumber,
                                        },
                                    }); //to tweetdetail
                                } else if (fromSideBar) {
                                    logOutUser();
                                    onClose();
                                    onCloseMoreOptionModal();
                                } else if (fromCommentDetail) {
                                    deleteHandler();
                                    onClose();
                                    onCloseMoreOptionModal();
                                    navigate(`/${mainTweetDetailPost.post.owner.name}/${infoToDeleteModal.postID}`, {
                                        state: {
                                            tweet: mainTweetDetailPost.post.tweet,
                                            ownerName: mainTweetDetailPost.post.owner.name,
                                            timeCreated: mainTweetDetailPost.post.createdAt,
                                            ownerId: mainTweetDetailPost.post.owner._id,
                                            handle: mainTweetDetailPost.post.owner.handle,
                                            postImage: mainTweetDetailPost.post.images,
                                            ownerImage: mainTweetDetailPost.post.owner.profile && mainTweetDetailPost.post.owner.profile.image.url ? mainTweetDetailPost.post.owner.profile.image.url : null,
                                            mentions: mainTweetDetailPost.post.mentions,
                                            description: mainTweetDetailPost.post.owner.description,

                                            whoCanReply: mainTweetDetailPost.post.whoCanReply,
                                            whoCanReplyNumber: mainTweetDetailPost.post.whoCanReplyNumber,
                                        },
                                    });
                                } else {
                                    deleteHandler();
                                    onClose();
                                    onCloseMoreOptionModal();
                                }
                            }}>
                            {`${fromSideBar ? "Log out" : "Delete"}`}
                        </button>
                        <button
                            className="flex h-10 w-64 items-center justify-center rounded-3xl border-2  text-[1rem] font-semibold hover:bg-gray-200 active:bg-gray-300 "
                            onClick={() => {
                                onClose();
                            }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteLogoutModal;
