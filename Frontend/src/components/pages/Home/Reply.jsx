import React, { Suspense, useRef, useState } from "react";
import { usePostTime } from "../../../CustomHooks/usePostTime";
import Avatar from "../Avatar";
import { Link } from "react-router-dom";
import PhotoGallery from "./PhotoGallery";
import { Bookmark, Comments, Retweets, ThreeDots } from "../../SVGs/SVGs";
import LikeUnlikePost from "./LikeUnlikePost";
import { useGlobalContext } from "../../../CustomHooks/useGlobalContext";
import CommentLikeUnlike from "../../../context/Actions/CommentLikeUnlike";
import Loader from "../Loader";
const MoreOptionMenuModal = React.lazy(() => import("../../Modal/MoreOptionMenuModal"));

const Reply = ({ replies, handleClick }) => {
    const { dispatchCommentLikeUnlike, state, ACTIONS } = useGlobalContext();

    ////Modal for more option
    const [visibility, setVisibility] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 }); //for getting the position of the button that triggers the modal to open
    const [infoToMoreOptionModal, setInfoToMoreOptionModal] = useState({ ownerID: "", commentID: "", postID: "" });

    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
            setVisibility(false);
            document.body.style.overflow = "unset";
        }
    };
    const onCloseMoreOptionModal = () => {
        setVisibility(false);
        document.body.style.overflow = "unset";
    };
    const photos = ["https://source.unsplash.com/random/1200x600", "https://source.unsplash.com/random/900x900"];

    //Grid layout for different numbers of image,used below
    let gridClass = "";
    switch (photos.length) {
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
    return (
        <>
            {replies &&
                replies.length > 0 &&
                replies.map((reply) => {
                    const formattedTimeReply = usePostTime(Date.parse(reply.createdAt));
                    const ownerImage = reply.owner.profile && reply.owner.profile.image.url ? reply.owner.profile.image.url : null;
                    const commentVideo = reply.video && reply.video.url ? reply.video.url : null;
                    return (
                        <div key={reply._id}>
                            <div className={`  pt-[0.1rem] hover:bg-gray-50`}>
                                <div onClick={handleClick} className=" relative m-2 flex cursor-pointer gap-2 hover:bg-gray-50">
                                    <Avatar profile={ownerImage} />
                                    <div className="absolute   left-[1.8rem] -top-[16.8rem] h-[calc(100%+0.8rem)] border-[0.09rem]"></div>
                                    <div className="relative mr-2 flex w-[87%] flex-col  gap-2 ">
                                        <div className="flex">
                                            <Link
                                                to={`/user/${reply.owner}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                className="absolute flex w-fit  items-center gap-1 text-[1.1rem] font-bold ">
                                                <span className="hover:underline">{reply.owner.name}</span>
                                                <span className=" text-[0.9rem] font-normal text-gray-700">{`@${reply.owner.handle}`}</span>
                                                <span className="mt-[-0.4rem] flex items-center justify-center  text-[0.8rem]">.</span>
                                                <span className="flex text-[0.9rem] font-normal text-gray-700">{`${formattedTimeReply}`}</span>
                                            </Link>
                                            <div
                                                className="ml-[34.2rem] rounded-full hover:bg-blue-100 hover:text-blue-500 "
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setVisibility(true);
                                                    const buttonRect = e.target.getBoundingClientRect();
                                                    const top = buttonRect.top + buttonRect.height;
                                                    const left = buttonRect.left;
                                                    setButtonPosition({ top, left });
                                                    setInfoToMoreOptionModal({ ownerID: reply.owner._id, commentID: reply._id, postID: reply.post });
                                                    document.body.style.overflow = "hidden";
                                                }}>
                                                <ThreeDots />
                                            </div>
                                        </div>

                                        <pre className={`  max-w-[98%] whitespace-pre-wrap break-words  `}>{reply.comment}</pre>
                                        <div className={`grid max-w-[98%]  ${gridClass}  ${photos.length > 1 ? `max-h-[18rem]` : "max-h-[30rem]  "}  gap-[0.05rem] rounded-xl  ${photos.length > 0 ? `border-[0.05rem]` : ``}`}>
                                            {photos.length > 0 && photos.map((photo, index) => <PhotoGallery key={index} photos={photos} photo={photo} index={index} />)}
                                        </div>
                                    </div>
                                </div>

                                <div className="my-4 ml-[4.25rem] flex w-[87.5%] gap-20   border-2">
                                    <div className="group flex w-[3rem] items-center justify-around">
                                        <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                                            <Comments />
                                        </button>

                                        <span className="group-hover:text-blue-500">{reply.children.length > 0 ? reply.children.length : null}</span>
                                    </div>

                                    <div className="group flex w-[3rem] items-center justify-around">
                                        <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-green-100 group-hover:text-green-500">
                                            <Retweets />
                                        </button>
                                        <span className="group-hover:text-green-500">{reply.likes.length}</span>
                                    </div>
                                    <div className=" group flex w-[3rem] items-center justify-around  ">
                                        <LikeUnlikePost likes={reply.likes} ACTIONS={ACTIONS} dispatch={dispatchCommentLikeUnlike} state={state} handler={CommentLikeUnlike} postId={reply._id} />
                                    </div>
                                    <div className="group flex w-[3rem] items-center justify-around ">
                                        <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                                            <Bookmark />
                                        </button>
                                        <span className="group-hover:text-blue-500"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

            <Suspense fallback={<Loader />}>
                <MoreOptionMenuModal visibility={visibility} handleOutsideClick={handleOutsideClick} buttonPosition={buttonPosition} infoToMoreOptionModal={infoToMoreOptionModal} onCloseMoreOptionModal={onCloseMoreOptionModal} />
            </Suspense>
        </>
    );
};

export default Reply;
