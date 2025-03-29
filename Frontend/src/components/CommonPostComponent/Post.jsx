import React, { Suspense, useEffect, useState } from "react";
import {
  Mention,
  PeopleYouFollow,
  PushPin,
  Retweets,
  ThreeDots,
} from "../SVGs/SVGs";
import { Link, useNavigate } from "react-router-dom";
import PhotoGallery from "./PhotoGallery";
import "./AnimationUsedInPostAndTweetDetail.css";
import { usePostTime } from "../../CustomHooks/usePostTime";
import Avatar from "../Avatar/Avatar";
import axios from "axios";
import Reply from "../comment/Reply";
import Loader from "../Loader/Loader";
import useHoverCard from "../../CustomHooks/useHoverCard";
import useModal from "../../CustomHooks/useModal";
import ActionButtonPanelShort from "./ActionButtonPanelShort";
import { API_BASE_URL } from "../../../config";

const MoreOptionMenuModal = React.lazy(
  () => import("../Modal/MoreOptionMenuModal")
);
const HoverProfileCard = React.lazy(
  () => import("../Profile/HoverProfileCard")
);

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
  whoCanReply,
  whoCanReplyNumber,
}) => {
  const formattedTime = usePostTime(Date.parse(timeCreated));
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverCard();

  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);

  let flag = 0;

  //Modal for more option
  const [
    visibility,
    setVisibility,
    handleOutsideClick,
    onCloseMoreOptionModal,
  ] = useModal();

  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 }); //for getting the position of the button that triggers the modal to open
  const [infoToMoreOptionModal, setInfoToMoreOptionModal] = useState({
    ownerID: "",
    commentID: "",
    postID: "",
    handle: "",
  });

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
                }}
              >
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

  const newUrl =
    isCommentRetweet || isCommentReply || isCommentBookmark
      ? `/${ownerName}/comment/${commentId}`
      : !isComment
        ? `/${ownerName}/${postId}`
        : `/${ownerName}/comment/${commentId}`;

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
      whoCanReply: whoCanReply,
      whoCanReplyNumber: whoCanReplyNumber,
    };

    navigate(newUrl, { replace: true, state: stateObject });
  };

  const navigateHandlerToProfile = (handle) => {
    navigate(`/Profile/${handle}`);
  };

  const replyHandler = async (childCommentId) => {
    const { data } = await axios.get(
      `${API_BASE_URL}/comment/reply/${childCommentId}`,
      {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
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
          <div>
            {ownerRetweet.handle === state.user.handle
              ? `You retweeted`
              : `${ownerRetweet.name} retweeted`}
          </div>
        </div>
      )}
      {whoCanReplyNumber === 2 && (
        <div className="mx-10 mt-1 flex items-center gap-4 text-[0.86rem] font-bold text-gray-500">
          <PeopleYouFollow />
          <div>{`People @${ownerName} follows can reply`}</div>
        </div>
      )}
      {whoCanReplyNumber === 3 && (
        <div className="mx-10 mt-1 flex items-center gap-4 text-[0.86rem] font-bold text-gray-500">
          <Mention />
          <div>Only people mentioned in this tweet can reply</div>
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
        className="relative mb-2  flex cursor-pointer   pt-2    hover:bg-gray-50"
      >
        <div className="mr-[0.1rem]  md:mr-[0.5rem]">
          <Avatar profile={profile} />
        </div>
        {(fromHome || fromProfile) &&
          threadChildren &&
          threadChildren.length > 0 &&
          !isCommentRetweet &&
          !isCommentReply && (
            <div className="absolute left-[1.7rem] top-[4rem] z-0 h-[calc(100%-1.6rem)] min-h-[2rem] w-fit border-2 md:left-[1.8rem] "></div>
          )}
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
                    if (
                      (fromCommentDetail &&
                        item2.owner._id === item.parent.owner &&
                        item2.owner._id !== item.owner._id) ||
                      (fromTweetDetail && item2.owner._id === item.post.owner)
                    ) {
                      return (
                        <div
                          key={item2._id}
                          className="absolute top-[3.66rem]   left-[1.5rem] h-[103%] border-2  md:left-[1.85rem]
                                            lg:left-[1.95rem]
                                            xl:left-[1.95rem] "
                        ></div>
                      );
                    }
                  })}
              </div>
            );
          })}

        <div
          className="relative  mr-[1.4rem] flex w-full flex-col gap-2  "
          onClick={
            (fromHome || fromProfile) &&
            threadChildren &&
            threadChildren.length > 0
              ? (e) => {
                  e.stopPropagation();
                  handleClick(true);
                }
              : null
          }
        >
          <div className="flex  ">
            <div
              onClick={(e) => {
                e.stopPropagation();
                navigateHandlerToProfile(handle);
              }}
              className="absolute flex w-fit items-center gap-1 text-[1.1rem] font-bold "
            >
              <div
                className="flex w-fit  items-center gap-1 "
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="hidden hover:underline md:block">
                  {ownerName}
                </span>
                <span className="hidden w-[5rem]  text-[0.9rem] font-normal text-gray-700 md:block md:w-fit">{`@${handle}`}</span>

                <span className="hover:underline md:hidden">{`${ownerName.length > 5 ? ownerName.slice(0, 5).trim() + "..." : ownerName}`}</span>

                <span className="w-fit    text-[0.9rem] font-normal text-gray-700 md:hidden md:w-fit">{`@${handle.length > 5 ? handle.slice(0, 5).trim() + "..." : handle}`}</span>
                {isHovered && (
                  <div className="relative ml-[-100%] -mt-10">
                    <HoverProfileCard
                      description={description}
                      name={ownerName}
                      handle={handle}
                      ownerId={ownerId}
                      profile={profile}
                    />
                  </div>
                )}
              </div>
              <span className="mt-[-0.4rem] flex items-center justify-center  text-[0.8rem]">
                .
              </span>
              <span className="flex text-[0.9rem] font-normal text-gray-700">{`${formattedTime}`}</span>
            </div>

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
                  ? setInfoToMoreOptionModal({
                      ownerID: ownerId,
                      commentID: commentId,
                      postID: POSTID,
                      handle: handle,
                    })
                  : isCommentRetweet || isCommentReply
                    ? setInfoToMoreOptionModal({
                        ownerID: ownerId,
                        commentID: commentId,
                        postID: POSTID,
                        handle: handle,
                      })
                    : isCommentBookmark
                      ? setInfoToMoreOptionModal({
                          ownerID: ownerId,
                          commentID: commentId,
                          postID: POSTID,
                          handle: handle,
                        })
                      : isComment
                        ? setInfoToMoreOptionModal({
                            ownerID: ownerId,
                            commentID: commentId,
                            postID: POSTID,
                            handle: handle,
                          })
                        : setInfoToMoreOptionModal({
                            ownerID: ownerId,
                            postID: postId,
                            handle: handle,
                          });
              }}
            >
              <ThreeDots />
            </div>
          </div>
          <pre className={`max-w-[98%] whitespace-pre-wrap  break-words    `}>
            {commentt}
          </pre>
          <div
            className={`mb-2 grid max-w-[98%]  ${gridClass}  ${photos.length > 1 ? `max-h-[18rem]` : "max-h-[30rem]  "}  gap-[0.05rem] rounded-xl  ${photos.length > 0 ? `border-[0.05rem]` : ``}`}
          >
            {photos.length > 0 &&
              photos.map((photo, index) => (
                <PhotoGallery
                  key={index}
                  photos={photos}
                  photo={photo.url ? photo.url : photo}
                  index={index}
                  mark={false}
                  postId={postId}
                  url={window.location.pathname}
                />
              ))}
          </div>
        </div>
      </div>

      <ActionButtonPanelShort
        retweets={retweets}
        dispatchRetweet={dispatchRetweet}
        handlerRetweet={handlerRetweet}
        postId={postId}
        likes={likes}
        dispatch={dispatch}
        handler={handler}
        bookmarks={bookmarks}
        dispatchBookmark={dispatchBookmark}
        handlerBookmark={handlerBookmark}
        fromBookmarks={fromBookmarks}
        removeBookmark={removeBookmark}
        ACTIONS={ACTIONS}
        state={state}
        fromTweetDetail={fromTweetDetail}
        fromCommentDetail={fromCommentDetail}
        commentsChildren={commentsChildren}
        comments={comments}
      />
      {(fromHome || fromProfile) &&
        threadChildren &&
        threadChildren.length > 0 &&
        !isCommentRetweet &&
        !isCommentReply && (
          <button
            className=" flex h-12 w-full items-center  gap-2 hover:bg-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(true);
            }}
          >
            <div className="">
              {profile ? (
                <div className="m-[0.55rem] h-[2.6rem] w-[2.6rem] items-center justify-center rounded-full bg-gray-400 md:m-[0.65rem]  xl:m-[0.55rem]">
                  <img
                    src={profile}
                    alt="profile image"
                    loading="lazy"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative m-[0.5rem] flex h-[2.6rem]  w-[2.6rem] items-center justify-center rounded-full bg-gray-200 md:m-[0.65rem] xl:m-[1] ">
                  <svg
                    className="  h-8 w-8 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
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

                  if (
                    (fromCommentDetail &&
                      item2.owner._id === item.parent.owner &&
                      item2.owner._id !== item.owner._id) ||
                    (fromTweetDetail && item2.owner._id === item.post.owner)
                  ) {
                    return (
                      <div key={item2._id} className="relative ">
                        {((!showReplies &&
                          item2._id !== isLastElement._id &&
                          item2.id !== item2[item2.children.length - 1]) ||
                          showReplies) && (
                          <div className="absolute left-[1.5rem] top-[4.3rem] h-[86%] border-2 md:left-[1.9rem] xl:left-[1.95rem] "></div>
                        )}

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
                            if (
                              flag !== 1 &&
                              !showReplies &&
                              ((fromCommentDetail &&
                                item3.owner._id === item.owner._id) ||
                                (fromTweetDetail &&
                                  item3.owner._id === item.owner._id))
                            ) {
                              flag = 1;

                              return (
                                <div key={item3._id}>
                                  <button
                                    className="w-full  pl-[4.5rem] text-left text-blue-500 hover:bg-gray-200"
                                    onClick={() => {
                                      return replyHandler(item3._id);
                                    }}
                                  >
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
              {!isLastElement && (
                <div className="absolute left-[1.75rem] top-[4.2rem] h-[86.5%] border-2 md:left-[1.9rem] xl:left-[1.95rem] "></div>
              )}
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
