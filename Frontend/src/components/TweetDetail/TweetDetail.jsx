import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LikeUnlike from "../../context/Actions/LikeUnlike";
import "../CommonPostComponent/AnimationUsedInPostAndTweetDetail.css";
import axios from "axios";
import useAnimation from "../../CustomHooks/useAnimation";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import Loader from "../Loader/Loader";
import { Bookmark, Comments, HeartLike, HeartUnlike, LeftArrow, Retweets, ThreeDots } from "../SVGs/SVGs";
import { usePostTimeInTweetDetail } from "../../CustomHooks/usePostTime";
import Avatar from "../Avatar/Avatar";
import PhotoGallery from "../CommonPostComponent/PhotoGallery";

const ModalForLikesBookmarksRetweets = React.lazy(() => import("../Modal/ModalForLikesBookmarksRetweets"));
const CommentCard = React.lazy(() => import("../comment/CommentCard"));
const MoreOptionMenuModal = React.lazy(() => import("../Modal/MoreOptionMenuModal"));

const TweetDetail = () => {
    const { ACTIONS, dispatchLikeUnlike: dispatch, state, stateComment, stateCommentDelete } = useGlobalContext();

    //Modal for more option
    const [visibility, setVisibility] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 }); //for getting the position of the button that triggers the modal to open
    const [infoToMoreOptionModal, setInfoToMoreOptionModal] = useState({ ownerID: "", commentID: "", postID: "" });

    const handleOutsideClickMoreOption = (event) => {
        if (event.target === event.currentTarget) {
            setVisibility(false);
            document.body.style.overflow = "unset";
        }
    };
    const onCloseMoreOptionModal = () => {
        setVisibility(false);
        document.body.style.overflow = "unset";
    };

    //Modal for like,retweet,Bookmark
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState("");
    const [list, setList] = useState(null);
    const hideModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = "unset";
    };
    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
            setIsModalOpen(false);
            document.body.style.overflow = "unset";
        }
    };

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
    const { tweet, ownerName, ownerId, handle, timeCreated, ownerImage: profile, postImage, isDelete, isAccount, mentions } = location.state;

    const formattedTime = usePostTimeInTweetDetail(Date.parse(timeCreated));

    //For like and unlike of post
    const [isLiked, setIsLiked] = useState(false);
    const [liked, setLiked] = useState(null);
    const [likedBy, setIsLikedBy] = useState([]);

    //For comments
    const [comments, setComments] = useState([]);
    const [commentt, setCommentt] = useState();
    const [mentionHandleCollection, setMentionHandleCollection] = useState([]);

    const fetchData = useCallback(async () => {
        //gets the updated data of likes, when user likes at homepage and then comes to detailpage,the user gets the updated data
        const { data } = await axios.get(`http://localhost:4000/api/v1/${postId}`, { withCredentials: true });

        setMentionHandleCollection(data.uniqueMentionHandleCollection);
        let like = [];
        like = data.post.likes;
        setIsLikedBy(like);
        setLiked(like.length);

        //For keeping the heart red or unred even after refreshing the page
        like.forEach((item) => {
            if (item._id === state.user._id) {
                setIsLiked(true);
            }
        });
        setComments(data.post.comments);

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

                if (mentions.includes(nextPart.toString())) {
                    renderedComment.push(
                        <span key={i} className="text-blue-500">
                            {mergedPart}
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
    }, [isLiked, stateComment.comment, stateCommentDelete.message]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    //ANIMATION FOR THE NUMBER NEXT TO LIKE/UNLIKE USING CUSTOM HOOK
    const [animationLikes, likedValue, handleLikesAnimation] = useAnimation(isLiked, setIsLiked, liked, setLiked);

    const likeHandler = async () => {
        handleLikesAnimation();
        await LikeUnlike({ dispatch, ACTIONS, postId });
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

    const tv = 0;

    return (
        <main className="grid grid-cols-[44vw_auto]   ">
            <div className="flex h-[100%] min-h-screen flex-col  border-l  border-r">
                <div className=" sticky inset-0 z-10 flex h-[3.5rem] items-center gap-7 bg-white/60 backdrop-blur-md ">
                    <div onClick={handleClick}>
                        <div className="m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:border-2 hover:bg-gray-200 active:bg-gray-300">
                            <LeftArrow className="h-[65%] w-[65%] " />
                        </div>
                    </div>
                    <div className="text-[1.6rem] font-bold">Tweet</div>
                </div>
                <div className=" m-2">
                    <div className="flex gap-2">
                        <div className="">
                            <Avatar profile={profile} />
                        </div>

                        <div className="flex h-fit w-full  flex-col ">
                            <div className="flex ">
                                <Link to={`/user/${ownerId}`} className="flex w-fit flex-col  text-[1.1rem] font-bold ">
                                    <span className="hover:underline">{ownerName}</span>
                                    <span className="mt-[-0.3rem] text-[0.9rem] font-normal text-gray-700">{`@${handle}`}</span>
                                </Link>
                                <div
                                    className="ml-auto h-min cursor-pointer  rounded-full hover:bg-blue-100 hover:text-blue-500"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setVisibility(true);
                                        document.body.style.overflow = "hidden";
                                        const buttonRect = e.target.getBoundingClientRect();
                                        const top = buttonRect.top + buttonRect.height;
                                        const left = buttonRect.left;
                                        setButtonPosition({ top, left });
                                        setInfoToMoreOptionModal({ ownerID: ownerId, postID: postId });
                                    }}>
                                    <ThreeDots />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="m-2">
                        <pre className={` mb-3 max-w-[98%] whitespace-pre-wrap break-words text-2xl`}>{commentt}</pre>
                        <div className={`m-[-0.25rem] grid max-w-[98%]  ${gridClass}  ${photos.length > 1 ? `max-h-[18rem]` : "max-h-[30rem]  "}  gap-[0.05rem] rounded-xl  ${photos.length > 0 ? `border-[0.05rem]` : ``}`}>
                            {photos.length > 0 && photos.map((photo, index) => <PhotoGallery key={index} photos={photos} photo={photo} index={index} />)}
                        </div>
                    </div>
                </div>
                <div className="mx-4  "> {formattedTime}</div>
                <div className="m-4  border-t-[0.01rem] opacity-80"></div>
                {likedValue > 0 || tv > 0 ? (
                    <>
                        <div className="mx-4 flex gap-8  font-bold">
                            {tv > 0 && (
                                <div className="cursor-pointer">
                                    <span className={`${animationLikes}`}>1</span> <span className={` text-[0.9rem] font-normal hover:underline`}>Retweets</span>
                                </div>
                            )}
                            <div className="cursor-pointer">
                                <span className={`${animationLikes}`}>1</span> <span className={`text-[0.9rem] font-normal hover:underline`}>Quotes</span>
                            </div>
                            {likedValue > 0 ? (
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setIsModalOpen(true);
                                        document.body.style.overflow = "hidden";
                                        setType("Liked");
                                        setList(likedBy);
                                    }}>
                                    {likedValue > 0 ? <span className={`${animationLikes} mr-1`}>{likedValue}</span> : null}
                                    <span className={`text-[0.9rem] font-normal hover:underline`}>Likes</span>
                                </div>
                            ) : null}
                            <div className="cursor-pointer">
                                <span className={`${animationLikes}`}>1</span> <span className={` text-[0.9rem] font-normal hover:underline`}>Bookmarks</span>
                            </div>
                        </div>
                        <div className="m-4  border-t-[0.01rem] opacity-80"></div>
                    </>
                ) : null}
                <div className="  mx-2 -mt-2 flex gap-20    pl-10">
                    <div className="group flex items-center justify-center gap-2 ">
                        <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                            <Comments bigIcon={true} />
                        </button>
                    </div>

                    <div className="group flex items-center justify-center gap-2 ">
                        <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-green-100 group-hover:text-green-500">
                            <Retweets bigIcon={true} />
                        </button>
                    </div>
                    <div className=" group flex items-center justify-center gap-2  ">
                        <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-red-100 group-hover:text-red-500" onClick={likeHandler}>
                            {isLiked ? <HeartLike bigIcon={true} /> : <HeartUnlike bigIcon={true} />}
                        </button>
                    </div>
                    <div className="group flex items-center justify-center gap-2 ">
                        <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                            <Bookmark bigIcon={true} />
                        </button>
                    </div>
                </div>
                <div className="mx-4 mt-4  border-t-[0.01rem] opacity-80"></div>{" "}
                <Suspense fallback={<Loader />}>
                    <ModalForLikesBookmarksRetweets visibility={isModalOpen} onClose={hideModal} type={type} list={list} handleOutsideClick={handleOutsideClick} />
                    <CommentCard comments={comments} postId={postId} fromTweetDetail={true} mentionHandleCollection={mentionHandleCollection} />

                    <MoreOptionMenuModal visibility={visibility} handleOutsideClick={handleOutsideClickMoreOption} buttonPosition={buttonPosition} infoToMoreOptionModal={infoToMoreOptionModal} onCloseMoreOptionModal={onCloseMoreOptionModal} />
                </Suspense>
            </div>
        </main>
    );
};

export default TweetDetail;
