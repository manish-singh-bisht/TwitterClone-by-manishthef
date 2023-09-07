import React, { useEffect, useRef } from "react";
import { Globe, Mention, PeopleYouFollow } from "../SVGs/SVGs";

const WhoCanReplyModal = ({ visibility, buttonPosition, handleOutsideClickWhoCanReply, setWhoCanReply, setvisibility, fromTweetModal }) => {
    if (!visibility) return;
    const modalRef = useRef(null);
    useEffect(() => {
        const positionModal = () => {
            const modalRect = modalRef.current.getBoundingClientRect();
            let top = 0;
            let left = 0;

            // Calculate the desired position

            if (!fromTweetModal) {
                top = buttonPosition.top - 300 + modalRect.height;
                left = buttonPosition.left + 200 - modalRect.width;
            } else {
                top = buttonPosition.top - 540 + modalRect.height;
                left = buttonPosition.left + 210 - modalRect.width;
            }

            // Apply the position to the modal
            modalRef.current.style.top = `${top}px`;
            modalRef.current.style.left = `${left}px`;
        };

        if (visibility && buttonPosition) {
            positionModal();
        }
    }, [visibility, buttonPosition]);

    return (
        <>
            <div className="fixed inset-0 z-30 h-[100vh] w-[100vw] ">
                <div className="fixed z-10  h-full w-full" onClick={handleOutsideClickWhoCanReply}></div>
                <div className="relative z-30 w-fit " ref={modalRef}>
                    <div className=" h-fit w-fit rounded-xl border-2 bg-white p-3">
                        <div className="overflow-x-hidden text-[1.1rem] text-gray-700">
                            <span className="font-bold text-black">Who can reply?</span> <br />
                            Choose who can reply to this post.
                        </div>
                        <button
                            className="flex w-full items-center gap-3  p-3 text-black  hover:bg-gray-100"
                            onClick={() => {
                                setWhoCanReply(1);
                                setvisibility(false);
                            }}>
                            <div className="rounded-full bg-blue-500 p-3 text-white">
                                <Globe className="text-white" />
                            </div>
                            <div className="font-bold ">Everyone</div>
                        </button>
                        <button
                            className="flex w-full items-center gap-3  p-3 text-black  hover:bg-gray-100"
                            onClick={() => {
                                setWhoCanReply(2);
                                setvisibility(false);
                            }}>
                            <div className="rounded-full bg-blue-500 p-3 text-white">
                                <PeopleYouFollow className="text-white" />
                            </div>
                            <div className="font-bold ">People You Follow</div>
                        </button>
                        <button
                            className="flex w-full items-center gap-3  p-3 text-black  hover:bg-gray-100"
                            onClick={() => {
                                setWhoCanReply(3);
                                setvisibility(false);
                            }}>
                            <div className="rounded-full bg-blue-500 p-3 text-white">
                                <Mention className="text-white" />
                            </div>
                            <div className="font-bold ">Only people you mention</div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WhoCanReplyModal;
