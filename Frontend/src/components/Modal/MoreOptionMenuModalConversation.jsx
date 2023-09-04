import React, { useEffect, useRef } from "react";
import { Delete, PushPin } from "../SVGs/SVGs";
import axios from "axios";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";

const MoreOptionMenuModalConversation = ({ visibility, handleOutsideClick, buttonPosition, infoToMoreOptionModal, setMessages, setVisibilityMoreOptionModalConversation, setConversationsArray, setIsPinnedConversation }) => {
    if (!visibility) return;

    const modalRef = useRef(null);
    const { state, dispatch, ACTIONS } = useGlobalContext();
    useEffect(() => {
        const positionModal = () => {
            const modalRect = modalRef.current.getBoundingClientRect();
            let top = 0;
            let left = 0;

            // Calculate the desired position

            top = buttonPosition.top - 130 + modalRect.height;
            left = buttonPosition.left + 20 - modalRect.width;

            // Apply the position to the modal
            modalRef.current.style.top = `${top}px`;
            modalRef.current.style.left = `${left}px`;
        };

        if (visibility && buttonPosition) {
            positionModal();
        }
    }, [visibility, buttonPosition]);

    const deleteForYou = async () => {
        const userId = state.user._id;
        await axios.delete(`http://localhost:4000/api/v1/chat/conversation/deleteConversation/${infoToMoreOptionModal.conversationid}`, {
            data: {
                userId,
            },
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });

        setConversationsArray((prev) =>
            prev.filter((item) => {
                return item._id !== infoToMoreOptionModal.conversationid;
            })
        );

        setIsPinnedConversation({ bool: false, id: null });
        setMessages((prev) => ({ ...prev, showingMessages: false }));

        const { data } = await axios.get("http://localhost:4000/api/v1/me", { withCredentials: true });

        await dispatch({ type: ACTIONS.LOAD_SUCCESS, payload: { myProfile: data.myProfile, total: data.total } });
    };

    const pinHandler = async (handle, conversationid) => {
        if (!state.user.pinnedConversation) {
            const { data } = await axios.get(`http://localhost:4000/api/v1/pinConversation/${handle}/${conversationid}`, { withCredentials: true });

            setConversationsArray((prev) => {
                const pinnedConversationIndex = prev.findIndex((item) => {
                    return item._id === conversationid;
                });

                if (pinnedConversationIndex >= 0) {
                    const pinnedConversation = prev[pinnedConversationIndex];

                    const pinnedConversationCopy = { ...pinnedConversation };

                    const newArray = [...prev];
                    newArray.splice(pinnedConversationIndex, 1);
                    newArray.unshift(pinnedConversationCopy);
                    setIsPinnedConversation({ bool: true, id: conversationid });
                    return newArray;
                } else {
                    return prev;
                }
            });
        } else if (state.user.pinnedConversation && state.user.pinnedConversation !== infoToMoreOptionModal.conversationid) {
            const { data } = await axios.put(`http://localhost:4000/api/v1/pinConversation/${handle}/${conversationid}`, null, { withCredentials: true });

            setConversationsArray((prev) => {
                const pinnedConversationIndex = prev.findIndex((item) => {
                    return item._id === conversationid;
                });

                if (pinnedConversationIndex !== -1) {
                    const pinnedConversation = prev[pinnedConversationIndex];
                    const pinnedConversationCopy = { ...pinnedConversation };

                    const newArray = [...prev];
                    newArray.splice(pinnedConversationIndex, 1);
                    newArray.unshift(pinnedConversationCopy);
                    setIsPinnedConversation({ bool: true, id: conversationid });
                    return newArray;
                }

                return prev;
            });
        } else {
            const { data } = await axios.get(`http://localhost:4000/api/v1/unpinConversation/${handle}/${conversationid}`, { withCredentials: true });

            setConversationsArray((prev) => {
                const pinnedConversationIndex = prev.findIndex((item) => {
                    return item._id === conversationid;
                });

                if (pinnedConversationIndex !== -1) {
                    const pinnedConversation = prev[pinnedConversationIndex];
                    prev.splice(pinnedConversationIndex, 1);
                    const originalIndex = prev.findIndex((item) => item.createdAt < pinnedConversation.createdAt);

                    if (originalIndex !== -1) {
                        prev.splice(originalIndex, 0, pinnedConversation);
                    } else {
                        prev.push(pinnedConversation);
                    }
                    setIsPinnedConversation({ bool: false, id: null });
                    return [...prev];
                }

                return prev;
            });
        }

        const { data } = await axios.get("http://localhost:4000/api/v1/me", { withCredentials: true });

        await dispatch({ type: ACTIONS.LOAD_SUCCESS, payload: { myProfile: data.myProfile, total: data.total } });
    };

    return (
        <>
            <div className="fixed inset-0 z-30 h-[100vh] w-[100vw] ">
                <div className="fixed z-10  h-full w-full" onClick={handleOutsideClick}></div>
                <div className="relative z-30 w-fit " ref={modalRef}>
                    <div className=" h-fit w-fit rounded-xl border-2 bg-white">
                        <button
                            className="flex w-full items-center gap-3 rounded-t-xl p-3 text-black  hover:bg-gray-100"
                            onClick={() => {
                                pinHandler(state.user.handle, infoToMoreOptionModal.conversationid);
                                setVisibilityMoreOptionModalConversation(false);
                            }}>
                            <PushPin />
                            <div className="font-bold ">{state.user.pinnedConversation && state.user.pinnedConversation === infoToMoreOptionModal.conversationid ? "Unpin Conversation" : "Pin Conversation"}</div>
                        </button>

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

export default MoreOptionMenuModalConversation;
