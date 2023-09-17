import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LikeUnlike from "../../context/Actions/LikeUnlike";
import "../CommonPostComponent/AnimationUsedInPostAndTweetDetail.css";
import axios from "axios";
import useAnimation from "../../CustomHooks/useAnimation";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import Loader from "../Loader/Loader";
import { LeftArrow, ThreeDots, PeopleYouFollow, Mention } from "../SVGs/SVGs";
import { usePostTimeInTweetDetail } from "../../CustomHooks/usePostTime";
import Avatar from "../Avatar/Avatar";
import PhotoGallery from "../CommonPostComponent/PhotoGallery";
import RetweetPost from "../../context/Actions/RetweetPost";
import PostBookmark from "../../context/Actions/PostBookmark";
import useHoverCard from "../../CustomHooks/useHoverCard";
import HoverProfileCard from "../Profile/HoverProfileCard";
import useModal from "../../CustomHooks/useModal";
import ActionButtonPanelLong from "../CommonPostComponent/ActionButtonPanelLong";
import ShowValues from "../CommonPostComponent/ShowValues";

const ModalForLikesRetweets = React.lazy(() => import("../Modal/ModalForLikesRetweets"));
const CommentCard = React.lazy(() => import("../comment/CommentCard"));
const MoreOptionMenuModal = React.lazy(() => import("../Modal/MoreOptionMenuModal"));

const TweetDetail = () => {
    const { ACTIONS, dispatchLikeUnlike: dispatch, state, stateComment, stateCommentDelete, dispatchRetweetPost: dispatchRetweet, dispatchBookmarkTweet: dispatchBookmark, setUsersForRightSidebar, usersForRightSidebar } = useGlobalContext();
    const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverCard();

    //Modal for more option

    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 }); //for getting the position of the button that triggers the modal to open
    const [infoToMoreOptionModal, setInfoToMoreOptionModal] = useState({ ownerID: "", commentID: "", postID: "", handle: "" });

    const [visibility, setVisibility, handleOutsideClickMoreOption, onCloseMoreOptionModal] = useModal();
    const [isModalOpen, setIsModalOpen, handleOutsideClick, hideModal] = useModal();

    //Modal for like,retweet,Bookmark
    const [type, setType] = useState("");
    const [list, setList] = useState(null);

    //For navigating to a particular section that is to the tweet that openend this component.
    const navigate = useNavigate();
    const { postId } = useParams();
    function handleClick() {
        navigate("/", { state: { sectionId: postId } });
    }

    useEffect(() => {
        //For scrolling to the top of window when the component shows up
        window.scrollTo(0, 0);
        //When user opens the like modal, when clicked on like, and clicks any profile, it takes them to their profile and when they click back arrow, it brings them here,so if its not there then the overflow will be hidden,so it prevents that.
        document.body.style.overflow = "unset";
    }, []);

    //using data that was sent in the state  from Post
    const location = useLocation();
    const { tweet, ownerName, ownerId, handle, timeCreated, profile, postImage, mentions, isThread, description, whoCanReply, whoCanReplyNumber } = location.state;

    const formattedTime = usePostTimeInTweetDetail(Date.parse(timeCreated));

    //For like and unlike of post
    const [isLiked, setIsLiked] = useState(false);
    const [liked, setLiked] = useState(null);
    const [likedBy, setLikedBy] = useState([]);

    //For comments
    const [comments, setComments] = useState([]);
    const [commentt, setCommentt] = useState();
    const [mentionHandleCollection, setMentionHandleCollection] = useState([]);

    const [thread, setThread] = useState([]);

    //For retweet of post
    const [isRetweet, setIsRetweet] = useState(false);
    const [retweet, setRetweet] = useState(null);
    const [retweetBy, setRetweetBy] = useState([]);

    //For bookmark
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarked, setBookmarked] = useState(null); // no bookmarkedBy for bookmark as in for like and retweet

    const fetchData = useCallback(async () => {
        //gets the updated data of likes, when user likes at homepage and then comes to detailpage,the user gets the updated data
        let value;
        if (isThread) {
            const { data } = await axios.get(`http://localhost:4000/api/v1/${postId}/thread`, { withCredentials: true });
            setThread(data.thread.slice(1));
            value = data.thread[0];
        } else {
            const { data } = await axios.get(`http://localhost:4000/api/v1/${postId}`, { withCredentials: true });
            value = data;
        }
        if (value.post?.tweet !== usersForRightSidebar?.post.tweet) {
            setUsersForRightSidebar(value);
        }
        setMentionHandleCollection(value.uniqueMentionHandleCollection);
        let like = [];
        like = value.post.likes;
        setLikedBy(like);
        setLiked(like.length);

        //For keeping the heart red or unred even after refreshing the page
        like.forEach((item) => {
            if (item._id === state.user._id) {
                setIsLiked(true);
            }
        });

        let retweet = [];
        retweet = value.post.retweets;

        setRetweetBy(retweet);
        setRetweet(retweet.length);

        retweet.forEach((item) => {
            if (item._id === state.user._id) {
                setIsRetweet(true);
            }
        });

        let bookmark = [];
        bookmark = value.post.bookmarks;

        setBookmarked(bookmark.length);

        bookmark.forEach((item) => {
            if (item._id === state.user._id) {
                setIsBookmarked(true);
            }
        });
        setComments(value.post.comments);

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
    }, [stateComment.comment, stateCommentDelete, postId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    //ANIMATION FOR THE NUMBER NEXT TO LIKE/UNLIKE USING CUSTOM HOOK
    const [animationLikes, likedValue, handleLikesAnimation] = useAnimation(isLiked, setIsLiked, liked, setLiked);

    const likeHandler = async () => {
        handleLikesAnimation();
        await LikeUnlike({ dispatch, ACTIONS, postId });
        if (isLiked) {
            setLikedBy((prev) =>
                prev.filter((item) => {
                    return item._id !== state.user._id;
                })
            );
        } else {
            setLikedBy((prev) => [...prev, { _id: state.user._id, name: state.user.name, handle: state.user.handle, profile: state.user.profile && state.user.profile, description: state.user.description }]);
        }
    };
    //ANIMATION FOR THE NUMBER NEXT TO RETWEET USING CUSTOM HOOK
    const [animationRetweet, retweetValue, handleRetweetAnimation] = useAnimation(isRetweet, setIsRetweet, retweet, setRetweet);

    const retweetHandler = async () => {
        handleRetweetAnimation();
        await RetweetPost({ dispatchRetweet, ACTIONS, postId, user: state.user._id });
        if (isRetweet) {
            setRetweetBy((prev) =>
                prev.filter((item) => {
                    return item._id !== state.user._id;
                })
            );
        } else {
            setRetweetBy((prev) => [...prev, { _id: state.user._id, name: state.user.name, handle: state.user.handle, profile: state.user.profile && state.user.profile, description: state.user.description }]);
        }
    };

    //ANIMATION FOR THE NUMBER NEXT TO BOOKMARK USING CUSTOM HOOK
    const [animationBookmarked, bookmarkedValue, handleBookmarkedAnimation] = useAnimation(isBookmarked, setIsBookmarked, bookmarked, setBookmarked);

    const bookmarkedHandler = async () => {
        handleBookmarkedAnimation();
        await PostBookmark({ dispatchBookmark, ACTIONS, postId });
        if (isBookmarked) {
            setBookmarked((prev) => prev - 1);
        } else {
            setBookmarked((prev) => prev + 1);
        }
    };
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

    const navigateHandlerToProfile = (handle) => {
        navigate(`/Profile/${handle}`);
    };
    return (
        <main className="w-[100%] xl:grid  xl:grid-cols-[44vw_auto] ">
            <div className="flex max-h-[full] min-h-[1400px] flex-col  border-l  border-r">
                <div className=" sticky inset-0 z-10 flex h-[3.5rem] items-center gap-7 bg-white/60 backdrop-blur-md ">
                    <div onClick={handleClick}>
                        <div className="m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:border-2 hover:bg-gray-200 active:bg-gray-300">
                            <LeftArrow className="h-[65%] w-[65%] " />
                        </div>
                    </div>
                    <div className="text-[1.6rem] font-bold">{thread.length > 0 ? "Thread" : "Tweet"}</div>
                </div>
                <div className="m-2">
                    <div className="flex gap-2">
                        <div className="">
                            <Avatar profile={profile} />
                        </div>

                        <div className="flex h-fit w-full  flex-col ">
                            <div className="flex ">
                                <div
                                    className="flex w-fit flex-col  text-[1.1rem] font-bold "
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateHandlerToProfile(handle);
                                    }}>
                                    <span className="hover:underline">{ownerName}</span>
                                    <span className="mt-[-0.3rem] text-[0.9rem] font-normal text-gray-700">{`@${handle}`}</span>
                                    {isHovered && (
                                        <div className="">
                                            <HoverProfileCard description={description} name={ownerName} handle={handle} ownerId={ownerId} profile={profile} />
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="ml-auto mr-[0.25rem] h-min cursor-pointer  rounded-full hover:bg-blue-100 hover:text-blue-500"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setVisibility(true);
                                        document.body.style.overflow = "hidden";
                                        const buttonRect = e.target.getBoundingClientRect();
                                        const top = buttonRect.top + buttonRect.height;
                                        const left = buttonRect.left;
                                        setButtonPosition({ top, left });
                                        setInfoToMoreOptionModal({ ownerID: ownerId, postID: postId, handle: handle });
                                    }}>
                                    <ThreeDots />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="m-2">
                        <pre className={` mb-3 max-w-[98%] whitespace-pre-wrap break-words text-2xl`}>{commentt}</pre>
                        <div className={`m-[-0.25rem] grid max-w-[98%]  ${gridClass}  ${photos.length > 1 ? `max-h-[18rem]` : "max-h-[30rem]  "}  gap-[0.05rem] rounded-xl  ${photos.length > 0 ? `border-[0.05rem]` : ``}`}>
                            {photos.length > 0 && photos.map((photo, index) => <PhotoGallery key={index} photos={photos} photo={photo.url} index={index} />)}
                        </div>
                    </div>
                </div>
                <div className="mx-4  "> {formattedTime}</div>
                <div className="m-4  border-t-[0.01rem] opacity-80"></div>
                <ShowValues
                    retweetValue={retweetValue}
                    likedValue={likedValue}
                    bookmarkedValue={bookmarkedValue}
                    animationBookmarked={animationBookmarked}
                    animationLikes={animationLikes}
                    animationRetweet={animationRetweet}
                    setIsModalOpen={setIsModalOpen}
                    setType={setType}
                    setList={setList}
                    retweetBy={retweetBy}
                    likedBy={likedBy}
                />
                <ActionButtonPanelLong retweetHandler={retweetHandler} likeHandler={likeHandler} bookmarkedHandler={bookmarkedHandler} isRetweet={isRetweet} isLiked={isLiked} isBookmarked={isBookmarked} />
                {whoCanReplyNumber === 2 && (
                    <div className="mx-10 mt-1 flex w-fit items-center gap-1 bg-blue-400 p-2 text-[0.86rem] font-bold ">
                        <PeopleYouFollow />
                        <div>{`People @${ownerName} follows can reply`}</div>
                    </div>
                )}
                {whoCanReplyNumber === 3 && (
                    <div className="mx-10 mt-1 flex w-fit items-center gap-1 bg-blue-400 p-2 text-[0.86rem] font-bold ">
                        <Mention />
                        <div>Only people mentioned in this tweet can reply</div>
                    </div>
                )}
                <div className="mx-4 mt-4  border-t-[0.01rem] opacity-80"></div>
                <Suspense fallback={<Loader />}>
                    <ModalForLikesRetweets visibility={isModalOpen} onClose={hideModal} type={type} list={list} handleOutsideClick={handleOutsideClick} />
                    {<CommentCard comments={comments} postId={postId} fromTweetDetail={true} mentionHandleCollection={mentionHandleCollection} isThread={isThread} thread={thread} whoCanReply={whoCanReply} />}

                    <MoreOptionMenuModal
                        visibility={visibility}
                        handleOutsideClick={handleOutsideClickMoreOption}
                        buttonPosition={buttonPosition}
                        infoToMoreOptionModal={infoToMoreOptionModal}
                        onCloseMoreOptionModal={onCloseMoreOptionModal}
                        fromTweetDetail={true}
                    />
                </Suspense>
            </div>
        </main>
    );
};

export default TweetDetail;
