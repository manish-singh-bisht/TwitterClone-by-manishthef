import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BiMessageRounded } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { Avatar } from "@mui/material";
import PhotoGallery from "./PhotoGallery";
import LikeUnlike from "../context/actions/LikeUnlike";
import { useGlobalContext } from "../context/Context";
import "./AnimationUsedInPostAndTweetDetail.css";
const TweetDetail = () => {
    const { ACTIONS, dispatchLikeUnlike, state } = useGlobalContext();

    //For navigating to a particular section that is to the tweet that openend this component.
    const navigate = useNavigate();
    const { postId } = useParams();
    function handleClick() {
        navigate("/", { state: { sectionId: postId } });
    }

    //using data that was sent in the state  from Post
    const locaion = useLocation();
    const { tweet, ownerName, ownerId, ownerImage, postImage, postVideo, likes, comments, isDelete, isAccount } = locaion.state;

    //For scrolling to the top of window when the component shows up
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

    return (
        <main className="grid grid-cols-[44vw_auto]   ">
            <div className="flex h-[100%] flex-col  border-l  border-r">
                <div className=" sticky inset-0 z-10 flex h-[3.5rem] items-center gap-10 bg-white/60 backdrop-blur-md ">
                    <div onClick={handleClick}>
                        <div className="m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:border-2 hover:bg-gray-200 active:bg-gray-300">
                            <AiOutlineArrowLeft className="h-[65%] w-[65%] " />
                        </div>
                    </div>
                    <div className="text-[1.6rem] font-bold">Tweet</div>
                </div>

                <div className=" m-2 flex  gap-2  ">
                    <div>
                        <Avatar className=" m-2" sx={{ width: 50, height: 50, zIndex: 1 }} src="../Public/logo/twitter.jpg" />
                    </div>
                    <div className="mr-2 flex w-[87%] flex-col gap-2  ">
                        <Link to={`/user/${ownerId}`} className="w-fit text-[1.1rem] font-bold hover:underline">
                            {ownerName}
                        </Link>
                        <pre className={` max-w-[98%] whitespace-pre-wrap break-words  `}>{tweet}</pre>
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
        </main>
    );
};

export default TweetDetail;
