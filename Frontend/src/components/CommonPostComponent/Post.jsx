import React, { Suspense, useEffect, useState } from "react";
import { Comments, PushPin, Retweets, ThreeDots } from "../SVGs/SVGs";
import { Link, useNavigate } from "react-router-dom";
import PhotoGallery from "./PhotoGallery";
import "./AnimationUsedInPostAndTweetDetail.css";
import { usePostTime } from "../../CustomHooks/usePostTime";
import Avatar from "../Avatar/Avatar";
import LikeUnlikePost from "./LikeUnlikePost";
import axios from "axios";
import Reply from "../comment/Reply";
import Loader from "../Loader/Loader";
import Retweet from "./Retweet";
import BookMark from "./BookMark";
import useHoverCard from "../../CustomHooks/useHoverCard";

const MoreOptionMenuModal = React.lazy(() => import("../Modal/MoreOptionMenuModal"));
const HoverProfileCard = React.lazy(() => import("../Profile/HoverProfileCard"));

const Post = ({
    postId,
    POSTID, //this is the post id when being passed from CommentCard component,and the CommentCard for this situation is being passed from TweetDetail,also for comment retweet from home component,also for comment bookmark.
    tweet,
    ownerName,
    ownerId,
    description,
    ownerImage: profile,
    postImage,
    handle,
    timeCreated,
    likes = [],
    retweets = [],
    comments = [],
    bookmarks = [],
    handler,
    dispatch,
    dispatchRetweet,
    handlerRetweet,
    state,
    ACTIONS,
    isComment,
    fromTweetDetail,
    fromCommentDetail,
    commentsChildren,
    activeHandler,
    isParent,
    isThread: passedIsThread,
    fromHome,
    comment, //this is child comments of the active comment and is being passed from commentCard by commentDetail component
    threadChildren,
    mentions,
    ownerRetweet,
    isPinnedTweet,
    setIsPinned,
    isCommentRetweet,
    isCommentReply,
    dispatchBookmark,
    handlerBookmark,
    fromBookmarks,
    fromProfile,
    removeBookmark,
    isCommentBookmark,
    fromProfileTweets,
    fromMediaLikesProfile,
    fromProfileRepliesParentPost,
    fromProfileRepliesComment,
}) => {
    const formattedTime = usePostTime(Date.parse(timeCreated));
    const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverCard();

    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);

    let flag = 0;

    //Modal for more option
    const [visibility, setVisibility] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 }); //for getting the position of the button that triggers the modal to open
    const [infoToMoreOptionModal, setInfoToMoreOptionModal] = useState({ ownerID: "", commentID: "", postID: "", handle: "" });

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
    const [commentt, setCommentt] = useState();

    // //For Scrolling to particular tweet after left arrow in TweetDetail.jsx/CommentDetail.jsx component is clicked
    // const location = useLocation();

    useEffect(() => {
        // if (location.state && location.state.sectionId) {
        //     const sectionId = location.state.sectionId;
        //     const section = document.getElementById(sectionId);

        //     if (section) {
        //         section.scrollIntoView({ behavior: "smooth" });
        //     }

        // }
        document.body.style.overflow = "unset";
        // Regex pattern to find mentions and make them blue,in the display after it is posted
        const mentionRegex = /(@)(\w+)/g;

        const parts = tweet.split(mentionRegex);
        const renderedComment = [];
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (part.startsWith("@")) {
                // Merge the delimiter with the next word
                const nextPart = parts[i + 1];
                const mergedPart = nextPart ? part + nextPart : part;
                // Skip the next part;
                i++;

                if (mentions.includes(nextPart?.toString())) {
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
    }, [location]);

    const photos = postImage ? postImage : [];

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

    const newUrl = isCommentRetweet || isCommentReply || isCommentBookmark ? `/${ownerName}/comment/${commentId}` : !isComment ? `/${ownerName}/${postId}` : `/${ownerName}/comment/${commentId}`;

    const handleClick = (isThread = passedIsThread) => {
        const stateObject = {
            tweet: tweet,
            ownerName: ownerName,
            handle: handle,
            timeCreated: timeCreated,
            ownerId: ownerId,
            profile: profile,
            postImage: postImage,
            mentions: mentions,
            isThread: isThread,
            description: description,
        };
        isParent && activeHandler(commentId);
        navigate(newUrl, { replace: true, state: stateObject });
    };

    const navigateHandlerToProfile = (handle) => {
        navigate(`/Profile/${handle}`);
    };

    const replyHandler = async (childCommentId) => {
        const { data } = await axios.get(`http://localhost:4000/api/v1/comment/reply/${childCommentId}`, { withCredentials: true });
        setReplies(data.replies);
        setShowReplies(true);
    };

    //if there's a reply to a comment then this assist in deleting the comment and updating the data on the screen
    const [replyId, setReplyId] = useState(); // reply id to be deleted

    //gets the reply id to be deleted
    const setReplyIdHandler = (id) => {
        setReplyId(id);
    };

    const deleteReplyHandler = () => {
        const index = replies.indexOf(replyId);
        const filteredReplies = replies.splice(0, index);
        setReplies(filteredReplies);
    };

    return (
        <div className={`   hover:bg-gray-50`} key={postId}>
            {/* id={postId} */}
            {ownerRetweet && (
                <div className="mx-10 mt-1 flex items-center gap-4 text-[0.86rem] font-bold text-gray-500">
                    <Retweets />
                    <div>{ownerRetweet.handle === state.user.handle ? `You retweeted` : `${ownerRetweet.name} retweeted`}</div>
                </div>
            )}
            {isPinnedTweet?.bool && isPinnedTweet?.id === postId && !ownerRetweet && (
                <div className="mx-10 mt-1 flex items-center gap-4 text-[0.86rem] font-bold text-gray-500">
                    <PushPin />
                    <div>Pinned</div>
                </div>
            )}
            <div
                onClick={() => {
                    if (!passedIsThread) {
                        handleClick(false);
                    } else {
                        handleClick();
                    }
                }}
                className="relative  mx-2 mb-2 flex cursor-pointer pt-2    hover:bg-gray-50">
                <div className="mr-[0.5rem]">
                    <Avatar profile={profile} />
                </div>
                {(fromHome || fromProfile) && threadChildren && threadChildren.length > 0 && !isCommentRetweet && !isCommentReply && <div className="absolute left-[1.8rem] top-[3.65rem] z-0 h-[calc(100%-1.4rem)] min-h-[2rem] w-fit border-2"></div>}
                {!fromHome &&
                    comment &&
                    comment.length > 0 &&
                    comment.map((item) => {
                        return (
                            <div key={item._id}>
                                {item &&
                                    item.owner._id !== item.post.owner &&
                                    item.children.length > 0 &&
                                    item.children.map((item2) => {
                                        if ((fromCommentDetail && item2.owner._id === item.parent.owner && item2.owner._id !== item.owner._id) || (fromTweetDetail && item2.owner._id === item.post.owner)) {
                                            return <div key={item2._id} className="absolute   top-[3.66rem] left-[1.8rem]  h-[103%] border-2 "></div>;
                                        }
                                    })}
                            </div>
                        );
                    })}

                <div
                    className="relative mr-2 flex w-[87%] flex-col  gap-2   "
                    onClick={
                        (fromHome || fromProfile) && threadChildren && threadChildren.length > 0
                            ? (e) => {
                                  e.stopPropagation();
                                  handleClick(true);
                              }
                            : null
                    }>
                    <div className="flex  " onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                navigateHandlerToProfile(handle);
                            }}
                            className="absolute flex w-fit  items-center gap-1 text-[1.1rem] font-bold ">
                            <span className="hover:underline">{ownerName}</span>
                            <span className="text-[0.9rem] font-normal text-gray-700">{`@${handle}`}</span>
                            <span className="mt-[-0.4rem] flex items-center justify-center  text-[0.8rem]">.</span>
                            <span className="flex text-[0.9rem] font-normal text-gray-700">{`${formattedTime}`}</span>
                        </div>
                        {isHovered && (
                            <div className="relative">
                                <HoverProfileCard description={description} name={ownerName} handle={handle} ownerId={ownerId} profile={profile} />
                            </div>
                        )}
                        <div
                            className="ml-[auto] -mr-[0.7rem] rounded-full  hover:bg-blue-100 hover:text-blue-500 "
                            onClick={(e) => {
                                e.stopPropagation();
                                setVisibility(true);
                                document.body.style.overflow = "hidden";
                                const buttonRect = e.target.getBoundingClientRect();
                                const top = buttonRect.top + buttonRect.height;
                                const left = buttonRect.left;
                                setButtonPosition({ top, left });
                                fromCommentDetail
                                    ? setInfoToMoreOptionModal({ ownerID: ownerId, commentID: commentId, postID: POSTID, handle: handle })
                                    : isCommentRetweet || isCommentReply
                                    ? setInfoToMoreOptionModal({ ownerID: ownerId, commentID: commentId, postID: POSTID, handle: handle })
                                    : isCommentBookmark
                                    ? setInfoToMoreOptionModal({ ownerID: ownerId, commentID: commentId, postID: POSTID, handle: handle })
                                    : isComment
                                    ? setInfoToMoreOptionModal({ ownerID: ownerId, commentID: commentId, postID: POSTID, handle: handle })
                                    : setInfoToMoreOptionModal({ ownerID: ownerId, postID: postId, handle: handle });
                            }}>
                            <ThreeDots />
                        </div>
                    </div>
                    <pre className={`  max-w-[98%] whitespace-pre-wrap break-words  `}>{commentt}</pre>
                    <div className={`mb-2 grid max-w-[98%]  ${gridClass}  ${photos.length > 1 ? `max-h-[18rem]` : "max-h-[30rem]  "}  gap-[0.05rem] rounded-xl  ${photos.length > 0 ? `border-[0.05rem]` : ``}`}>
                        {photos.length > 0 && photos.map((photo, index) => <PhotoGallery key={index} photos={photos} photo={photo.url ? photo.url : photo} index={index} mark={false} postId={postId} url={window.location.pathname} />)}
                    </div>
                </div>
            </div>
            <div className="-mt-3 mb-2 ml-[4.25rem] flex w-[87.5%] gap-20  ">
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
                <div className=" group flex w-[3rem] items-center justify-around  ">
                    <Retweet retweets={retweets} ACTIONS={ACTIONS} dispatchRetweet={dispatchRetweet} state={state} handlerRetweet={handlerRetweet} postId={postId} />
                </div>
                <div className=" group flex w-[3rem] items-center justify-around  ">
                    <LikeUnlikePost likes={likes} ACTIONS={ACTIONS} dispatch={dispatch} state={state} handler={handler} postId={postId} />
                </div>
                <div className=" group flex w-[3rem] items-center justify-around  ">
                    <BookMark bookmarks={bookmarks} ACTIONS={ACTIONS} dispatchBookmark={dispatchBookmark} state={state} handlerBookmark={handlerBookmark} postId={postId} fromBookmarks={fromBookmarks} removeBookmark={(id) => removeBookmark(id)} />
                </div>
            </div>
            {(fromHome || fromProfile) && threadChildren && threadChildren.length > 0 && !isCommentRetweet && !isCommentReply && (
                <button
                    className=" flex h-12 w-full items-center  gap-2 hover:bg-gray-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick(true);
                    }}>
                    <div className="">
                        {profile ? (
                            <div className="m-[1.05rem] h-[2.6rem] w-[2.6rem] items-center justify-center rounded-full   bg-gray-400">
                                <img src={profile} alt="profile image" loading="lazy" className="h-full w-full rounded-full object-cover" />
                            </div>
                        ) : (
                            <div className="relative m-1 ml-[1.15rem]  flex h-[2.6rem] w-[2.6rem] items-center justify-center  rounded-full bg-gray-200">
                                <svg className="  h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="  text-left  ">
                        <div className="  text-blue-500">Show Thread</div>
                    </div>
                </button>
            )}
            {comment &&
                comment.length > 0 &&
                comment.map((item) => {
                    return (
                        <div key={item._id} className="relative -mt-1 ">
                            {item &&
                                item.owner._id !== item.post.owner &&
                                item.children.length > 0 &&
                                item.children.map((item2) => {
                                    const isLastElement = item.children[item.children.length - 1];
                                    if ((fromCommentDetail && item2.owner._id === item.parent.owner && item2.owner._id !== item.owner._id) || (fromTweetDetail && item2.owner._id === item.post.owner)) {
                                        return (
                                            <div key={item2._id} className="relative ">
                                                {((!showReplies && item2._id !== isLastElement._id) || showReplies) && <div className="absolute left-[2.3rem] top-[4.3rem] h-[86%] border-2  "></div>}

                                                <Reply
                                                    key={item2._id}
                                                    reply={item2}
                                                    handleClick={handleClick}
                                                    setReplyIdHandler={(id) => {
                                                        setReplyIdHandler(id);
                                                    }}
                                                    deleteReplyHandler={deleteReplyHandler}
                                                />
                                                {item2.children &&
                                                    item2.children.length > 0 &&
                                                    item2.children.map((item3) => {
                                                        if (flag !== 1 && !showReplies && ((fromCommentDetail && item3.owner._id === item.owner._id) || (fromTweetDetail && item3.owner._id === item.owner._id))) {
                                                            flag = 1;
                                                            return (
                                                                <div key={item3._id}>
                                                                    <button
                                                                        className="w-full  pl-[4.5rem] text-left text-blue-500 hover:bg-gray-200"
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
            {/* creating this separate component <Reply/> because if not shows error, "Uncaught error:rendered more hooks than previous" */}
            {showReplies &&
                replies &&
                replies.length > 0 &&
                replies.map((reply) => {
                    const isLastElement = reply === replies[replies.length - 1];

                    return (
                        <div className="relative -mt-[0.01rem]" key={reply._id}>
                            {!isLastElement && <div className="absolute left-[2.3rem] top-[4.2rem] h-[86.5%] border-2 "></div>}
                            <Reply
                                key={reply._id}
                                reply={reply}
                                handleClick={handleClick}
                                setReplyIdHandler={(id) => {
                                    setReplyIdHandler(id);
                                }}
                                deleteReplyHandler={deleteReplyHandler}
                            />
                        </div>
                    );
                })}
            <hr className="w-full bg-gray-100" />
            <Suspense fallback={<Loader />}>
                <MoreOptionMenuModal
                    visibility={visibility}
                    handleOutsideClick={handleOutsideClick}
                    buttonPosition={buttonPosition}
                    infoToMoreOptionModal={infoToMoreOptionModal}
                    onCloseMoreOptionModal={onCloseMoreOptionModal}
                    fromCommentDetail={fromCommentDetail}
                    fromHome={fromHome}
                    isCommentRetweet={isCommentRetweet}
                    fromTweetDetail={fromTweetDetail}
                    fromBookmarksForDeletingCommentPost={fromBookmarks ? true : false}
                    removeBookmark={(id) => removeBookmark(id)}
                    fromProfileTweets={fromProfileTweets}
                    fromMediaLikesProfile={fromMediaLikesProfile}
                    fromProfileRepliesParentPost={fromProfileRepliesParentPost}
                    fromProfileRepliesComment={fromProfileRepliesComment}
                    setIsPinned={setIsPinned}
                />
            </Suspense>
        </div>
    );
};

export default Post;
