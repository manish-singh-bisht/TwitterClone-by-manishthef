import React, { useEffect, useState } from "react";
import { Bookmark, Comments, Retweets } from "../../SVGs/SVGs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PhotoGallery from "./PhotoGallery";
import "./AnimationUsedInPostAndTweetDetail.css";
import { usePostTime } from "../../../CustomHooks/usePostTime";
import Avatar from "../Avatar";
import LikeUnlikePost from "./LikeUnlikePost";
import CommentLikeUnlike from "../../../context/Actions/CommentLikeUnlike";
import { useGlobalContext } from "../../../CustomHooks/useGlobalContext";
import axios from "axios";

const Post = ({
    postId,
    tweet,
    ownerName,
    ownerId,
    ownerImage: profile,
    postImage,
    postVideo,
    handle,
    timeCreated,
    likes = [],
    comments = [],
    isDelete = false,
    isAccount = false,
    handler,
    dispatch,
    state,
    ACTIONS,
    isComment,
    fromTweetDetail,
    fromCommentDetail,
    commentsChildren,
    activeHandler,
    isParent,
    comment, //this is child comments of the active comment and is being passed from commentCard by commentDetail component
}) => {
    const { dispatchCommentLikeUnlike } = useGlobalContext();
    const formattedTime = usePostTime(Date.parse(timeCreated));

    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    let flag = 0;

    //For Scrolling to particular tweet after left arrow in TweetDetail.jsx/CommentDetail.jsx component is clicked
    const location = useLocation();
    useEffect(() => {
        if (location.state && location.state.sectionId) {
            const sectionId = location.state.sectionId;
            const section = document.getElementById(sectionId);

            if (section) {
                section.scrollIntoView();
            }
            document.body.style.overflow = "unset";
        }
    }, [location]);

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

    //For navigating to TweetDetail/CommentDetail with data
    const navigate = useNavigate();
    const commentId = postId;
    const newUrl = !isComment ? `/${ownerName}/${postId}` : `/${ownerName}/comment/${commentId}`;

    const handleClick = () => {
        isParent && activeHandler(commentId);
        navigate(newUrl, { replace: true, state: { tweet, ownerName, handle, timeCreated, ownerId, profile, postImage, postVideo, isDelete, isAccount } });
    };

    const replyHandler = async (childCommentId) => {
        const { data } = await axios.get(`http://localhost:4000/api/v1/comment/reply/${childCommentId}`, { withCredentials: true });
        setReplies(data.replies);
        setShowReplies(true);
    };

    return (
        <div className={` scroll-pt-32  hover:bg-gray-50`} id={postId}>
            <div onClick={handleClick} className=" m-2 flex cursor-pointer gap-2 hover:bg-gray-50">
                <Avatar profile={profile} />

                <div className="relative mr-2 flex w-[87%] flex-col  gap-2">
                    <Link
                        to={`/user/${ownerId}`}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="absolute flex w-fit  items-center gap-1 text-[1.1rem] font-bold ">
                        <span className="hover:underline">{ownerName}</span>
                        <span className="text-[0.9rem] font-normal text-gray-700">{`@${handle}`}</span>
                        <span className="mt-[-0.4rem] flex items-center justify-center  text-[0.8rem]">.</span>
                        <span className="flex text-[0.9rem] font-normal text-gray-700">{`${formattedTime}`}</span>
                    </Link>
                    <pre className={` mt-10 max-w-[98%] whitespace-pre-wrap break-words  `}>{tweet}</pre>
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
                    {fromTweetDetail || fromCommentDetail ? (
                        <span className="group-hover:text-blue-500">{commentsChildren.length > 0 ? commentsChildren.length : null}</span>
                    ) : (
                        <span className="group-hover:text-blue-500">{comments.length > 0 ? comments.length : null}</span>
                    )}
                </div>

                <div className="group flex w-[3rem] items-center justify-around">
                    <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-green-100 group-hover:text-green-500">
                        <Retweets />
                    </button>
                    <span className="group-hover:text-green-500">{likes.length}</span>
                </div>
                <div className=" group flex w-[3rem] items-center justify-around  ">
                    <LikeUnlikePost likes={likes} ACTIONS={ACTIONS} dispatch={dispatch} state={state} handler={handler} postId={postId} />
                </div>
                <div className="group flex w-[3rem] items-center justify-around ">
                    <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                        <Bookmark />
                    </button>
                    <span className="group-hover:text-blue-500"></span>
                </div>
            </div>

            {comment &&
                comment.length > 0 &&
                comment.map((item) => {
                    return (
                        <div key={item._id}>
                            {item &&
                                item.children.length > 0 &&
                                item.children.map((item2) => {
                                    if ((fromCommentDetail && item2.owner._id === item.parent.owner) || (fromTweetDetail && item2.owner._id === item.post.owner)) {
                                        const formattedTimeChildren = usePostTime(Date.parse(item2.createdAt));
                                        const ownerImage = item2.owner.profile && item2.owner.profile.image.url ? item2.owner.profile.image.url : null;
                                        const commentVideo = item2.video && item2.video.url ? item2.video.url : null;
                                        return (
                                            <div className={`  pt-[0.1rem] hover:bg-gray-50`} key={item2._id}>
                                                <div onClick={handleClick} className=" relative m-2 flex cursor-pointer gap-2 hover:bg-gray-50">
                                                    <Avatar profile={ownerImage} />
                                                    <div className="absolute   left-[1.8rem] -top-[16.8rem] h-[calc(100%+0.8rem)] border-[0.09rem]"></div>
                                                    <div className="relative mr-2 flex w-[87%] flex-col  gap-2 ">
                                                        <Link
                                                            to={`/user/${item2.owner}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                            }}
                                                            className="absolute flex w-fit  items-center gap-1 text-[1.1rem] font-bold ">
                                                            <span className="hover:underline">{item2.owner.name}</span>
                                                            <span className=" text-[0.9rem] font-normal text-gray-700">{`@${item2.owner.handle}`}</span>
                                                            <span className="mt-[-0.4rem] flex items-center justify-center  text-[0.8rem]">.</span>
                                                            <span className="flex text-[0.9rem] font-normal text-gray-700">{`${formattedTimeChildren}`}</span>
                                                        </Link>
                                                        <pre className={` mt-10 max-w-[98%] whitespace-pre-wrap break-words  `}>{item2.comment}</pre>
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

                                                        <span className="group-hover:text-blue-500">{item2.children.length > 0 ? item2.children.length : null}</span>
                                                    </div>

                                                    <div className="group flex w-[3rem] items-center justify-around">
                                                        <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-green-100 group-hover:text-green-500">
                                                            <Retweets />
                                                        </button>
                                                        <span className="group-hover:text-green-500">{item2.likes.length}</span>
                                                    </div>
                                                    <div className=" group flex w-[3rem] items-center justify-around  ">
                                                        <LikeUnlikePost likes={item2.likes} ACTIONS={ACTIONS} dispatch={dispatchCommentLikeUnlike} state={state} handler={CommentLikeUnlike} postId={item2._id} />
                                                    </div>
                                                    <div className="group flex w-[3rem] items-center justify-around ">
                                                        <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                                                            <Bookmark />
                                                        </button>
                                                        <span className="group-hover:text-blue-500"></span>
                                                    </div>
                                                </div>

                                                {item2.children &&
                                                    item2.children.length > 0 &&
                                                    item2.children.map((item3) => {
                                                        if (flag !== 1 && !showReplies && ((fromCommentDetail && item3.owner._id === item.owner._id) || (fromTweetDetail && item3.owner._id === item.owner._id))) {
                                                            flag = 1;
                                                            return (
                                                                <div key={item3._id}>
                                                                    <button
                                                                        className="w-full border-2 pl-[4.5rem] text-left text-blue-500 hover:bg-gray-50"
                                                                        onClick={() => {
                                                                            return replyHandler(item3._id);
                                                                        }}>
                                                                        Show replies
                                                                    </button>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                        </div>
                    );
                })}
            {showReplies &&
                replies &&
                replies.length > 0 &&
                replies.map((reply) => {
                    const formattedTimeReply = () => usePostTime(Date.parse(reply.createdAt));
                    const ownerImage = reply.owner.profile && reply.owner.profile.image.url ? reply.owner.profile.image.url : null;
                    const commentVideo = reply.video && reply.video.url ? reply.video.url : null;
                    return (
                        <div key={reply._id}>
                            <div className={`  pt-[0.1rem] hover:bg-gray-50`}>
                                <div onClick={handleClick} className=" relative m-2 flex cursor-pointer gap-2 hover:bg-gray-50">
                                    <Avatar profile={ownerImage} />
                                    <div className="absolute   left-[1.8rem] -top-[16.8rem] h-[calc(100%+0.8rem)] border-[0.09rem]"></div>
                                    <div className="relative mr-2 flex w-[87%] flex-col  gap-2 ">
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
                                        <pre className={` mt-10 max-w-[98%] whitespace-pre-wrap break-words  `}>{reply.comment}</pre>
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
            <hr className="w-full bg-gray-100" />
        </div>
    );
};

export default Post;
