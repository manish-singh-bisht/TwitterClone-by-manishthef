import React, { Suspense, useEffect, useRef, useState } from "react";
import { Delete, PushPin, UserPlus } from "../SVGs/SVGs";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import DeleteComment from "../../context/Actions/DeleteComment";
import Loader from "../pages/Loader";
import DeleteLogoutModal from "./DeleteLogoutModal";

const MoreOptionMenuModal = ({ visibility, handleOutsideClick, buttonPosition, infoToMoreOptionModal, onCloseMoreOptionModal }) => {
    if (!visibility) return;

    const [visibilityDeleteModal, setVisibilityDeleteModal] = useState(false);
    const handleOutsideClickDeleteModal = (event) => {
        if (event.target === event.currentTarget) {
            setVisibilityDeleteModal(false);
        }
    };
    const onClose = () => {
        setVisibilityDeleteModal(false);
    };

    const modalRef = useRef(null);
    const { state, dispatchCommentDelete, ACTIONS } = useGlobalContext();

    useEffect(() => {
        const positionModal = () => {
            const modalRect = modalRef.current.getBoundingClientRect();
            let top = 0;
            let left = 0;

            // Calculate the desired position
            if (state.user._id === infoToMoreOptionModal.ownerID) {
                top = buttonPosition.top - modalRect.height + 83;
                left = buttonPosition.left - modalRect.width + 25;
            } else {
                top = buttonPosition.top - modalRect.height + 35;
                left = buttonPosition.left - modalRect.width + 25;
            }

            // Apply the position to the modal
            modalRef.current.style.top = `${top}px`;
            modalRef.current.style.left = `${left}px`;
        };

        if (visibility && buttonPosition) {
            positionModal();
        }
    }, [visibility, buttonPosition]);

    const deleteHandler = async () => {
        const postID = infoToMoreOptionModal.postID;
        const commentID = infoToMoreOptionModal.commentID;
        await DeleteComment({ dispatchCommentDelete, ACTIONS, postID, commentID });
    };

    return (
        <div className="fixed inset-0 z-30 h-[100vh] w-[100vw] ">
            <div className="fixed z-10  h-full w-full" onClick={handleOutsideClick}></div>
            <div className=" relative z-30  w-[20rem] rounded-xl border-2 bg-white shadow-md" ref={modalRef}>
                {state.user._id === infoToMoreOptionModal.ownerID ? (
                    <>
                        <button
                            className="flex w-full items-center gap-3 rounded-xl p-3 text-red-400  hover:bg-gray-50"
                            onClick={(e) => {
                                setVisibilityDeleteModal(true);
                                e.stopPropagation();
                                document.body.style.overflow = "hidden";
                            }}>
                            <Delete />
                            <div className="font-bold ">Delete</div>
                        </button>
                        <button className="flex w-full items-center gap-3 rounded-xl p-3  hover:bg-gray-50">
                            <PushPin />
                            <div className="font-bold ">Pin to your Profile</div>
                        </button>
                    </>
                ) : (
                    <button className="flex w-full items-center gap-3 rounded-xl p-3  hover:bg-gray-50">
                        <UserPlus />
                        <div className="font-bold ">Follow</div>
                    </button>
                )}
            </div>

            <Suspense fallback={<Loader />}>
                <DeleteLogoutModal visibility={visibilityDeleteModal} handleOutsideClick={handleOutsideClickDeleteModal} fromDelete={true} deleteHandler={deleteHandler} onClose={onClose} onCloseMoreOptionModal={onCloseMoreOptionModal} />
            </Suspense>
        </div>
    );
};

export default MoreOptionMenuModal;
