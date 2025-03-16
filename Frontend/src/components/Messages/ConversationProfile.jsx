import { ThreeDots } from "../SVGs/SVGs";
import Avatar from "../Avatar/Avatar";
import { usePostTime } from "../../CustomHooks/usePostTime";
import useModal from "../../CustomHooks/useModal";

import React, { Suspense, useState } from "react";
import Loader from "../Loader/Loader";
const MoreOptionMenuModalConversation = React.lazy(() => import("../Modal/MoreOptionMenuModalConversation"));

const ConversationProfile = ({ profile, name, handle, latest, date, conversationid, setConversationsArray, setMessages, setIsPinnedConversation }) => {
    const formattedTime = usePostTime(Date.parse(date));

    const [visibilityMoreOptionModalConversation, setVisibilityMoreOptionModalConversation, handleOutsideClickMoreOptionModalConversation] = useModal();

    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
    const [infoToMoreOptionModal, setInfoToMoreOptionModal] = useState({ conversationid: "" });

    return (
        <div className="flex  cursor-pointer justify-between  p-2 hover:bg-gray-100">
            <div className="flex gap-2">
                <div>
                    <Avatar profile={profile} />
                </div>
                <div className=" ">
                    <div className="flex ">
                        <div className=" flex w-fit  items-center gap-1 text-[1.1rem] font-bold ">
                            <div className="flex w-fit  items-center gap-1 ">
                                <span className="hover:underline">{name.length > 8 ? name.slice(0, 8).trim() + "..." : name}</span>
                                <span className="text-[0.9rem] font-normal text-gray-700">{`@${handle.length > 8 ? handle.slice(0, 8).trim() + "..." : handle}`}</span>
                            </div>
                            <span className="mt-[-0.4rem] flex items-center justify-center  text-[0.8rem]">{date != "" && "."}</span>
                            <span className="flex text-[0.9rem] font-normal text-gray-700">{date != "" && `${formattedTime}`}</span>
                        </div>
                    </div>
                    <div className="overflow-x-hidden text-[0.95rem] text-gray-700">{`${latest?.length > 30 ? latest?.slice(0, 30).trim() + "..." : latest}`}</div>
                </div>
            </div>
            <div
                className=" h-fit rounded-full  hover:bg-blue-100 hover:text-blue-500 "
                onClick={(e) => {
                    e.stopPropagation();

                    document.body.style.overflow = "hidden";
                    const buttonRect = e.target.getBoundingClientRect();
                    const top = buttonRect.top + buttonRect.height;
                    const left = buttonRect.left;
                    setButtonPosition({ top, left });
                    setVisibilityMoreOptionModalConversation(true);
                    setInfoToMoreOptionModal({ conversationid: conversationid });
                }}>
                <ThreeDots />
            </div>
            <Suspense fallback={<Loader />}>
                <MoreOptionMenuModalConversation
                    visibility={visibilityMoreOptionModalConversation}
                    handleOutsideClick={handleOutsideClickMoreOptionModalConversation}
                    buttonPosition={buttonPosition}
                    infoToMoreOptionModal={infoToMoreOptionModal}
                    setVisibilityMoreOptionModalConversation={setVisibilityMoreOptionModalConversation}
                    setConversationsArray={setConversationsArray}
                    setMessages={setMessages}
                    setIsPinnedConversation={setIsPinnedConversation}
                />
            </Suspense>
        </div>
    );
};

export default ConversationProfile;
