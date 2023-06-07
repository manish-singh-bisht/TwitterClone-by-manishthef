import React from "react";
import { useNavigate } from "react-router-dom";

const DeleteLogoutModal = ({ visibility, handleOutsideClick, fromDelete, deleteHandler, onClose, onCloseMoreOptionModal, fromReplies, deleteReplyHandler, fromActiveComment, infoToDeleteModal, detailsOfActiveComment, fromSideBar, logOutUser }) => {
    if (!visibility) return;
    const navigate = useNavigate();

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
                            className={`flex h-10 w-64 items-center justify-center rounded-3xl ${fromSideBar ? "bg-black hover:bg-gray-700 active:bg-gray-700" : "bg-red-500 hover:bg-red-600 active:bg-red-700"}  text-[1rem] font-semibold text-white `}
                            onClick={() => {
                                if (fromReplies) {
                                    deleteHandler();
                                    onClose();
                                    onCloseMoreOptionModal();
                                    deleteReplyHandler();
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
                                        },
                                    }); //to tweetdetail
                                } else if (fromSideBar) {
                                    logOutUser();
                                    onClose();
                                    onCloseMoreOptionModal();
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
