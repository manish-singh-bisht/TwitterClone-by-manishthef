import axios from "axios";
import { useEffect, useRef } from "react";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import { toast } from "react-toastify";

const SaveTweetModal = ({ visibilityCross, buttonPositionCross, handleOutsideClickCross, setvisibilityCross, closeAll, text, fromDraft, handleUpdateDraft, firstTweetText }) => {
    if (!visibilityCross) return;

    const { state } = useGlobalContext();
    const modalRef = useRef(null);

    useEffect(() => {
        const positionModal = () => {
            const modalRect = modalRef.current.getBoundingClientRect();
            let top = 0;
            let left = 0;

            // Calculate the desired position
            top = buttonPositionCross.top - 300 + modalRect.height;
            left = buttonPositionCross.left + 455 - modalRect.width;

            // Apply the position to the modal
            modalRef.current.style.top = `${top}px`;
            modalRef.current.style.left = `${left}px`;
        };

        if (visibilityCross && buttonPositionCross) {
            positionModal();
        }
    }, [visibilityCross, buttonPositionCross]);

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
    const createDraftHandler = async (text) => {
        const { data } = await axios.post(
            `http://localhost:4000/api/v1/draft/create`,
            { text },

            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        state.user.drafts = data.draft;
        toast(data.message, toastConfig);
        closeAll();
    };
    return (
        <>
            <div className="fixed inset-0 z-30 flex h-[100vh] w-[100vw] items-center justify-center">
                <div className={`fixed  h-full w-full bg-black/30`} onClick={handleOutsideClickCross}></div>
                <div className="absolute z-10 flex h-fit w-[20rem] flex-col gap-2 rounded-2xl bg-white p-8" ref={modalRef}>
                    <div className=" text-[1.4rem] font-bold">Save post? </div>
                    <div className="text-[0.97rem] text-gray-600">You can save this to send later from your drafts.</div>
                    <div className="flex flex-col gap-3 pt-3">
                        <button
                            className="flex h-10 w-64 items-center justify-center rounded-3xl bg-black font-bold text-white hover:bg-gray-600 active:bg-gray-800  disabled:bg-gray-300 "
                            onClick={() => {
                                if (fromDraft) {
                                    handleUpdateDraft(firstTweetText);
                                } else {
                                    createDraftHandler(text);
                                }
                            }}
                            disabled={state.user.drafts.length >= 5 && !fromDraft}>
                            Save
                        </button>
                        <button
                            className="flex h-10 w-64 items-center justify-center rounded-3xl border-2  text-[1rem] font-semibold hover:bg-gray-200 active:bg-gray-300 "
                            onClick={() => {
                                closeAll();
                            }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SaveTweetModal;
