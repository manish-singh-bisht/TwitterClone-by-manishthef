import React, { useEffect, useRef } from "react";
import { CopyMessage, Delete, Share } from "../SVGs/SVGs";
import axios from "axios";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../config";

const MoreOptionMenuModalMessage = ({ visibility, handleOutsideClick, buttonPosition, own, infoToMoreOptionModal, setMessageArray, messageFull, setVisibilityMoreOptionModalMessage, setReply }) => {
    if (!visibility) return;

    const modalRef = useRef(null);
    const { state } = useGlobalContext();

    useEffect(() => {
        const positionModal = () => {
            const modalRect = modalRef.current.getBoundingClientRect();
            let top = 0;
            let left = 0;

            // Calculate the desired position

            if (own) {
                top = buttonPosition.top - 221 + modalRect.height;
                left = buttonPosition.left + 20 - modalRect.width;
            } else {
                top = buttonPosition.top - 180 + modalRect.height;
                left = buttonPosition.left + 170 - modalRect.width;
            }

            // Apply the position to the modal
            modalRef.current.style.top = `${top}px`;
            modalRef.current.style.left = `${left}px`;
        };

        if (visibility && buttonPosition) {
            positionModal();
        }
    }, [visibility, buttonPosition]);

    const deleteForAll = async () => {
        setMessageArray((prev) =>
            prev.filter((item) => {
                return item._id !== infoToMoreOptionModal.messageid;
            })
        );
        const { data } = await axios.delete(`${API_BASE_URL}/chat/message/deleteForAll/${infoToMoreOptionModal.messageid}`, { withCredentials: true });
    };

    const deleteForYou = async () => {
        const messageId = infoToMoreOptionModal.messageid;
        const userId = state.user._id;
        setMessageArray((prev) =>
            prev.filter((item) => {
                return item._id !== infoToMoreOptionModal.messageid;
            })
        );
        const { data } = await axios.delete(`${API_BASE_URL}/chat/message/deleteMessage`, {
            data: {
                messageId,
                userId,
            },
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(messageFull.content);
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

        toast("Copied to clipboard", toastConfig);
        setVisibilityMoreOptionModalMessage(false);
    };

    return (
        <>
            <div className="fixed inset-0 z-30 h-[100vh] w-[100vw] ">
                <div className="fixed z-10  h-full w-full" onClick={handleOutsideClick}></div>
                <div className="relative z-30 ml-[5.2rem] w-fit md:ml-0" ref={modalRef}>
                    <div className=" h-fit w-fit rounded-xl border-2 bg-white">
                        <button
                            className="flex w-full items-center gap-3 rounded-t-xl p-3 text-black  hover:bg-gray-100"
                            onClick={() => {
                                setReply({ bool: true, name: messageFull.sender.name, content: messageFull.content });
                                setVisibilityMoreOptionModalMessage(false);
                            }}>
                            <Share />
                            <div className="font-bold ">Reply</div>
                        </button>
                        <button className="flex w-full items-center gap-3 p-3 text-black  hover:bg-gray-100" onClick={copyToClipboard}>
                            <CopyMessage />
                            <div className="font-bold ">Copy Message</div>
                        </button>
                        {own && (
                            <button className="flex w-full items-center gap-3 p-3 text-red-400  hover:bg-gray-100" onClick={deleteForAll}>
                                <Delete />
                                <div className="font-bold ">Delete For All</div>
                            </button>
                        )}
                        <button className="flex w-full items-center gap-3 rounded-b-xl p-3 text-black  hover:bg-gray-100" onClick={deleteForYou}>
                            <Delete />
                            <div className="font-bold ">Delete For You</div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MoreOptionMenuModalMessage;
