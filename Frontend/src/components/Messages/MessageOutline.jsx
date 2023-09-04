import React, { Suspense, useState } from "react";
import { usePostTimeInTweetDetail } from "../../CustomHooks/usePostTime";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import { ThreeDots } from "../SVGs/SVGs";
import Loader from "../Loader/Loader";
const MoreOptionMenuModalMessage = React.lazy(() => import("../Modal/MoreOptionMenuModalMessage"));

const MessageOutline = ({ message, date, sender, messageFull, setMessageArray, replyTo, setReply }) => {
    const formattedTime = usePostTimeInTweetDetail(Date.parse(date));
    const { state } = useGlobalContext();

    const own = sender === state.user._id ? true : false;

    const [visibilityMoreOptionModalMessage, setVisibilityMoreOptionModalMessage] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
    const [infoToMoreOptionModal, setInfoToMoreOptionModal] = useState({ messageid: "" });

    const handleOutsideClickMoreOptionModalMessage = (event) => {
        if (event.target === event.currentTarget) {
            setVisibilityMoreOptionModalMessage(false);
        }
    };

    return (
        <>
            <div className={`${own ? " items-end" : ""} group flex flex-col`}>
                <div
                    className={`${
                        own ? " rounded-tl-3xl rounded-tr-3xl  rounded-bl-3xl	bg-[#1D9BF0] text-white" : "rounded-tl-3xl rounded-tr-3xl rounded-br-3xl bg-[#EFF3F4] text-black"
                    } relative m-2 mx-4 flex min-h-[3.5rem] w-fit min-w-[6%] max-w-[65%] flex-col  px-2 pb-3 pt-2 text-[1.1rem]`}>
                    {replyTo && (
                        <div className={`${own ? "border-l-black bg-blue-100" : "border-l-black bg-gray-300"} flex w-full flex-col  justify-between rounded-xl border-l-[0.4rem]  px-2 align-middle text-gray-500`}>
                            <div className="flex w-full justify-between ">
                                <div className="font-bold ">{replyTo.name}</div>
                            </div>
                            <div className="overflow-x-hidden break-words text-gray-800">{replyTo.message}</div>
                        </div>
                    )}

                    <div className="relative overflow-x-hidden break-words px-2 pt-2"> {message}</div>
                    <div
                        className={`${own ? "-left-9 text-black" : "-right-9"} absolute hidden h-fit cursor-pointer   rounded-full hover:bg-blue-100 hover:text-blue-500 group-hover:block`}
                        onClick={(e) => {
                            e.stopPropagation();
                            document.body.style.overflow = "hidden";
                            const buttonRect = e.target.getBoundingClientRect();
                            const top = buttonRect.top + buttonRect.height;
                            const left = buttonRect.left;
                            setButtonPosition({ top, left });
                            setVisibilityMoreOptionModalMessage(true);
                            setInfoToMoreOptionModal({ messageid: messageFull._id });
                        }}>
                        <ThreeDots />
                    </div>
                </div>
                <div className="mx-4 mt-[-0.5rem] mb-3 text-[0.9rem] text-gray-800">{formattedTime}</div>
            </div>
            <Suspense fallback={<Loader />}>
                <MoreOptionMenuModalMessage
                    visibility={visibilityMoreOptionModalMessage}
                    handleOutsideClick={handleOutsideClickMoreOptionModalMessage}
                    buttonPosition={buttonPosition}
                    own={own}
                    infoToMoreOptionModal={infoToMoreOptionModal}
                    setMessageArray={setMessageArray}
                    messageFull={messageFull}
                    setVisibilityMoreOptionModalMessage={setVisibilityMoreOptionModalMessage}
                    setReply={setReply}
                />
            </Suspense>
        </>
    );
};

export default MessageOutline;
