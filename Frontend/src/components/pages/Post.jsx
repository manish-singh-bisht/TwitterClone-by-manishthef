import React, { useEffect, useRef, useState } from "react";
import { BiMessageRounded } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { Avatar } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PhotoGallery from "./PhotoGallery";
import LikeUnlike from "../context/actions/LikeUnlike";
import { useGlobalContext } from "../context/Context";
import "./AnimationUsedInPostAndTweetDetail.css";

const Post = ({ postId, tweet, ownerName, ownerId, ownerImage, postImage, postVideo, likes = [], comments = [], isDelete = false, isAccount = false }) => {
    const { ACTIONS, dispatchLikeUnlike, state } = useGlobalContext();

    //For like and unlike of post
    const [isLiked, setIsLiked] = useState(false);
    const [liked, setLiked] = useState(likes.length);

    //ANIMATION FOR THE NUMBER NEXT TO LIKE/UNLIKE
    const [animationLikes, setAnimationLikes] = useState("initial");
    const handleLikesAnimation = () => {
        {
            isLiked ? setTimeout(() => setAnimationLikes("goDown"), 0) : setTimeout(() => setAnimationLikes("goUp"), 0);
        }

        setTimeout(() => setLiked(isLiked ? liked - 1 : liked + 1), 200);
        {
            isLiked ? setTimeout(() => setAnimationLikes("waitUp"), 100) : setTimeout(() => setAnimationLikes("waitDown"), 100);
        }
        setTimeout(() => setAnimationLikes("initial"), 200);
    };
    const likeHandler = async () => {
        handleLikesAnimation();
        await LikeUnlike({ dispatchLikeUnlike, ACTIONS, postId });
        setIsLiked(!isLiked);
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

    const photos = ["https://source.unsplash.com/random/900x800", "https://source.unsplash.com/random/900x800"];

    //Grid layout for different numbers of image,used below
    let gridClass = "";
    switch (photos.length) {
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
        navigate(`${ownerName}/${postId}`, { state: { tweet, ownerName, ownerId, ownerImage, postImage, postVideo, likes, comments, isDelete, isAccount } });
    };

    return (
        <div className={` scroll-mt-32 hover:bg-gray-50 `} id={postId}>
            <div onClick={handleClick} className=" m-2 flex cursor-pointer gap-2 hover:bg-gray-50">
                <div>
                    <Avatar className=" m-2" sx={{ width: 50, height: 50, zIndex: 1 }} src="./Public/logo/twitter.jpg" />
                </div>
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
                        {photos.map((photo, index) => (
                            <PhotoGallery key={index} photos={photos} photo={photo} index={index} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="my-4 ml-[5rem] flex w-[87.5%] gap-24   ">
                <div className="group flex items-center justify-center gap-2 ">
                    <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                        <BiMessageRounded className="h-[1.35rem] w-[1.35rem] " />
                    </button>
                    <span className="group-hover:text-blue-500">{likes.length}</span>
                </div>

                <div className="group flex items-center justify-center gap-2 ">
                    <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-green-100 group-hover:text-green-500">
                        <AiOutlineRetweet className="h-[1.35rem] w-[1.35rem] " />
                    </button>
                    <span className="group-hover:text-green-500">{likes.length}</span>
                </div>
                <div className=" group flex items-center justify-center gap-2  ">
                    <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-red-100 group-hover:text-red-500" onClick={likeHandler}>
                        {isLiked ? <AiFillHeart className="h-[1.35rem] w-[1.35rem]  fill-red-500" /> : <AiOutlineHeart className="h-[1.35rem] w-[1.35rem]   " />}
                    </button>
                    <span className={`group-hover:text-red-500 ${animationLikes}`}>{liked}</span>
                </div>
            </div>
            <hr className="w-full bg-gray-100" />
        </div>
    );
};

export default Post;
