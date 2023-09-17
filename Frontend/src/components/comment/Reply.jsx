import React, { Suspense, useEffect, useState } from "react";
import Avatar from "../Avatar/Avatar";
import { Link, useNavigate } from "react-router-dom";
import { ThreeDots } from "../SVGs/SVGs";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import CommentLikeUnlike from "../../context/Actions/CommentLikeUnlike";
import Loader from "../Loader/Loader";
import PhotoGallery from "../CommonPostComponent/PhotoGallery";

import { usePostTime } from "../../CustomHooks/usePostTime";

import RetweetComment from "../../context/Actions/RetweetComment";
import CommentBookmark from "../../context/Actions/CommentBookmark";
import HoverProfileCard from "../Profile/HoverProfileCard";
import useHoverCard from "../../CustomHooks/useHoverCard";
import useModal from "../../CustomHooks/useModal";
import ActionButtonPanelShort from "../CommonPostComponent/ActionButtonPanelShort";
const MoreOptionMenuModal = React.lazy(() => import("../Modal/MoreOptionMenuModal"));

const Reply = ({ reply, handleClick, setReplyIdHandler, deleteReplyHandler }) => {
    const { dispatchCommentLikeUnlike, state, ACTIONS, dispatchRetweetComment, dispatchBookmarkComment } = useGlobalContext();
    const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverCard();

    const [commentt, setCommentt] = useState();

    ////Modal for more option
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 }); //for getting the position of the button that triggers the modal to open
    const [infoToMoreOptionModal, setInfoToMoreOptionModal] = useState({ ownerID: "", commentID: "", postID: "", handle: "" });
    const [visibility, setVisibility, handleOutsideClick, onCloseMoreOptionModal] = useModal();

    //Grid layout for different numbers of image,used below
    let gridClass = "";
    switch (reply.images.length) {
        case 0:
            gridClass = "";
            break;
        case 1:
            gridClass = "w-full h-full";
            break;
        case 2:
            gridClass = "grid-cols-2 grid-rows-1";
            break;
        case 3:
            gridClass = "grid-cols-2 grid-rows-2";
            break;
        case 4:
            gridClass = "grid-cols-2 grid-rows-2";
            break;
        default:
            break;
    }
    const navigate = useNavigate();

    const navigateHandlerToProfile = (handle) => {
        navigate(`/Profile/${handle}`);
    };
    useEffect(() => {
        // Regex pattern to find mentions and make them blue,in the display after it is posted
        const mentionRegex = /(@)(\w+)/g;
        const parts = reply.comment.split(mentionRegex);
        const renderedComment = [];
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (part.startsWith("@")) {
                // Merge the delimiter with the next word
                const nextPart = parts[i + 1];
                const mergedPart = nextPart ? part + nextPart : part;
                // Skip the next part;
                i++;

                if (reply.mentions.includes(nextPart?.toString())) {
                    renderedComment.push(
                        <span key={i} className="text-blue-500 hover:underline">
                            <Link
                                to={`/Profile/${nextPart}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}>
                                {mergedPart}
                            </Link>
                        </span>
                    );
                } else {
                    renderedComment.push(mergedPart);
                }
            } else {
                renderedComment.push(part);
            }
        }
        setCommentt(renderedComment);
    }, []);
    const formattedTimeReply = usePostTime(Date.parse(reply.createdAt));
    const ownerImage = reply.owner.profile && reply.owner.profile.image && reply.owner.profile.image.url ? reply.owner.profile.image.url : null;

    return (
        <div key={reply._id}>
            <div>
                <div className={`  pt-[0.1rem] hover:bg-gray-50`}>
                    <div onClick={handleClick} className=" relative my-2 flex cursor-pointer gap-2  hover:bg-gray-50">
                        <Avatar profile={ownerImage} />

                        <div className="relative mr-2 flex w-[87%] flex-col  gap-2 ">
                            <div className="flex" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateHandlerToProfile(reply.owner.handle);
                                    }}
                                    className="absolute flex w-fit  items-center gap-1 text-[1.1rem] font-bold ">
                                    <span className="hover:underline">{reply.owner.name}</span>
                                    <span className=" text-[0.9rem] font-normal text-gray-700">{`@${reply.owner.handle}`}</span>
                                    <span className="mt-[-0.4rem] flex items-center justify-center  text-[0.8rem]">.</span>
                                    <span className="flex text-[0.9rem] font-normal text-gray-700">{`${formattedTimeReply}`}</span>
                                </div>{" "}
                                {isHovered && (
                                    <div className="relative ">
                                        <HoverProfileCard description={reply.owner.description} name={reply.owner.name} handle={reply.owner.handle} ownerId={reply.owner._id} profile={ownerImage} />
                                    </div>
                                )}
                                <div
                                    className="ml-[auto] -mr-[0.7rem] rounded-full hover:bg-blue-100 hover:text-blue-500 "
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setVisibility(true);
                                        const buttonRect = e.target.getBoundingClientRect();
                                        const top = buttonRect.top + buttonRect.height;
                                        const left = buttonRect.left;
                                        setButtonPosition({ top, left });
                                        setInfoToMoreOptionModal({ ownerID: reply.owner._id, commentID: reply._id, postID: reply.post, handle: reply.owner.handle });
                                        setReplyIdHandler(reply._id);
                                        document.body.style.overflow = "hidden";
                                    }}>
                                    <ThreeDots />
                                </div>
                            </div>

                            <div className="relative">
                                <pre className={`  max-w-[98%] whitespace-pre-wrap break-words   `}>{commentt}</pre>
                                <div className={`grid max-w-[98%]  ${gridClass}  ${reply.images.length > 1 ? `max-h-[18rem]` : "max-h-[30rem]  "}  gap-[0.05rem] rounded-xl  ${reply.images.length > 0 ? `border-[0.05rem]` : ``}`}>
                                    {reply.images.length > 0 && reply.images.map((photo, index) => <PhotoGallery key={index} photos={reply.images} photo={photo.url} index={index} />)}
                                </div>
                            </div>
                            {/* <div className="absolute   left-[1.8rem] top-[calc(-100%-0.5rem)] h-[calc(100%+0.5rem)] border-[0.09rem]"></div> */}
                        </div>
                    </div>

                    <ActionButtonPanelShort
                        retweets={reply.retweets}
                        dispatchRetweet={dispatchRetweetComment}
                        handlerRetweet={RetweetComment}
                        postId={reply._id}
                        likes={reply.likes}
                        dispatch={dispatchCommentLikeUnlike}
                        handler={CommentLikeUnlike}
                        bookmarks={reply.bookmarks}
                        dispatchBookmark={dispatchBookmarkComment}
                        handlerBookmark={CommentBookmark}
                        ACTIONS={ACTIONS}
                        state={state}
                        fromReply={true}
                        replyChildren={reply.children}
                    />
                </div>
            </div>

            <Suspense fallback={<Loader />}>
                <MoreOptionMenuModal
                    visibility={visibility}
                    handleOutsideClick={handleOutsideClick}
                    buttonPosition={buttonPosition}
                    infoToMoreOptionModal={infoToMoreOptionModal}
                    onCloseMoreOptionModal={onCloseMoreOptionModal}
                    deleteReplyHandler={deleteReplyHandler}
                    fromReplies={true}
                />
            </Suspense>
        </div>
    );
};

export default Reply;
