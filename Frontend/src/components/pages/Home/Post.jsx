import React, { useEffect, useRef, useState } from "react";
import { Bookmark, Comments, HeartLike, HeartUnlike, Retweets } from "../../SVGs/SVGs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PhotoGallery from "./PhotoGallery";
import LikeUnlike from "../../../context/actions/LikeUnlike";
import "./AnimationUsedInPostAndTweetDetail.css";
import useAnimation from "../../../CustomHooks/useAnimation";
import { useGlobalContext } from "../../../CustomHooks/useGlobalContext";
import { usePostTime } from "../../../CustomHooks/usePostTime";
import Avatar from "../Avatar";

const Post = ({ postId, tweet, ownerName, ownerId, ownerImage, postImage, postVideo, handle, timeCreated, likes = [], comments = [], isDelete = false, isAccount = false }) => {
    const { ACTIONS, dispatchLikeUnlike, state } = useGlobalContext();

    const profile = state.user && state.user.profile && state.user.profile.image.url ? state.user.profile.image.url : null;

    const formattedTime = usePostTime(Date.parse(timeCreated));

    //For like and unlike of post
    const [isLiked, setIsLiked] = useState(false);
    const [liked, setLiked] = useState(likes.length);

    //ANIMATION FOR THE NUMBER NEXT TO LIKE/UNLIKE USING CUSTOM HOOK
    const [animationLikes, likedValue, handleLikesAnimation] = useAnimation(isLiked, setIsLiked, liked, setLiked);

    const likeHandler = async () => {
        handleLikesAnimation();
        await LikeUnlike({ dispatchLikeUnlike, ACTIONS, postId });
    };

    //For keeping the heart red or unred even after refreshing the page
    useEffect(() => {
        likes.forEach((item) => {
            if (item._id === state.user._id) {
                setIsLiked(true);
            }
        });
    }, []);

    //For Scrolling to particular tweet after left arrow in TweetDetail.jsx component is clicked
    const location = useLocation();
    useEffect(() => {
        if (location.state && location.state.sectionId) {
            const sectionId = location.state.sectionId;
            const section = document.getElementById(sectionId);

            if (section) {
                section.scrollIntoView();
            }
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

    //For navigating to detailtweet with data
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`${ownerName}/${postId}`, { state: { tweet, ownerName, handle, timeCreated, ownerId, ownerImage, postImage, postVideo, comments, isDelete, isAccount } });
    };

    return (
        <div className={` scroll-mt-32 hover:bg-gray-50 `} id={postId}>
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

            <div className="my-4 ml-[4.25rem] flex w-[87.5%] gap-24   border-2">
                <div className="group flex items-center justify-center gap-2 ">
                    <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                        <Comments />
                    </button>
                    <span className="group-hover:text-blue-500">{comments.length > 0 ? comments.length : null}</span>
                </div>

                <div className="group flex items-center justify-center gap-2 ">
                    <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-green-100 group-hover:text-green-500">
                        <Retweets />
                    </button>
                    <span className="group-hover:text-green-500">{likes.length}</span>
                </div>
                <div className=" group flex items-center justify-center gap-2  ">
                    <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-red-100 group-hover:text-red-500" onClick={likeHandler}>
                        {isLiked ? <HeartLike /> : <HeartUnlike />}
                    </button>
                    <span className={`group-hover:text-red-500 ${animationLikes}`}>{likedValue > 0 ? likedValue : null}</span>
                </div>
                <div className="group flex items-center justify-center gap-2 border-2">
                    <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                        <Bookmark />
                    </button>
                    <span className="group-hover:text-blue-500"></span>
                </div>
            </div>
            <hr className="w-full bg-gray-100" />
        </div>
    );
};

export default Post;
