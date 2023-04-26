import React, { useEffect, useRef, useState } from "react";
import { Bookmark, Comments, HeartLike, HeartUnlike, Retweets } from "../../SVGs/SVGs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PhotoGallery from "./PhotoGallery";
import LikeUnlike from "../../../context/actions/LikeUnlike";
import "./AnimationUsedInPostAndTweetDetail.css";
import useAnimation from "../../../CustomHooks/useAnimation";
import { useGlobalContext } from "../../../CustomHooks/useGlobalContext";

const Post = ({ postId, tweet, ownerName, ownerId, ownerImage, postImage, postVideo, likes = [], comments = [], isDelete = false, isAccount = false }) => {
    const { ACTIONS, dispatchLikeUnlike, state } = useGlobalContext();

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
        navigate(`${ownerName}/${postId}`, { state: { tweet, ownerName, ownerId, ownerImage, postImage, postVideo, comments, isDelete, isAccount } });
    };
    const profile = "";
    return (
        <div className={` scroll-mt-32 hover:bg-gray-50 `} id={postId}>
            <div onClick={handleClick} className=" m-2 flex cursor-pointer gap-2 hover:bg-gray-50">
                {profile ? (
                    <div className="m-1 h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full   bg-gray-400">
                        <img src={profile} alt="profile image" className="h-full w-full rounded-full object-cover" />
                    </div>
                ) : (
                    <div className="relative m-1 flex h-[3.2rem] w-[3.2rem] items-center justify-center  rounded-full bg-gray-200">
                        <svg className="  h-9 w-9 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                )}

                <div className="relative mr-2 flex w-[87%] flex-col  gap-2">
                    <Link
                        to={`/user/${ownerId}`}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="absolute  w-fit  text-[1.1rem] font-bold hover:underline">
                        {ownerName}
                    </Link>
                    <pre className={` mt-10 max-w-[98%] whitespace-pre-wrap break-words  `}>{tweet}</pre>
                    <div className={`grid max-w-[98%]  ${gridClass}  ${photos.length > 1 ? `max-h-[18rem]` : "max-h-[30rem]  "}  gap-[0.05rem] rounded-xl  ${photos.length > 0 ? `border-[0.05rem]` : ``}`}>
                        {photos.length > 0 && photos.map((photo, index) => <PhotoGallery key={index} photos={photos} photo={photo} index={index} />)}
                    </div>
                </div>
            </div>

            <div className="my-4 ml-[4.25rem] flex w-[87.5%] gap-24   ">
                <div className="group flex items-center justify-center gap-2 ">
                    <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                        <Comments />
                    </button>
                    <span className="group-hover:text-blue-500">{likes.length}</span>
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
                    <span className={`group-hover:text-red-500 ${animationLikes}`}>{likedValue}</span>
                </div>
                <div className="group flex items-center justify-center gap-2 ">
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
