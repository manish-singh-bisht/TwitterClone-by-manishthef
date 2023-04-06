import React, { useEffect, useRef, useState } from "react";
import { BiMessageRounded } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { Avatar } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import PhotoGallery from "./PhotoGallery";

const Post = ({ postId, tweet, ownerName, ownerId, ownerImage, postImage, postVideo, likes = [], comments = [], isDelete = false, isAccount = false }) => {
    const [isLiked, setIsLiked] = useState(false);
    const likeHandler = () => {
        setIsLiked(!isLiked);
    };

    //For Scrolling to particular tweet after left arrow in TweetDetail.jsx component is clicked
    const location = useLocation();
    useEffect(() => {
        if (location.state && location.state.sectionId) {
            const sectionId = location.state.sectionId;
            const section = document.getElementById(sectionId);

            if (section) {
                section.scrollIntoView(false);
            }
        }
    }, [location]);

    const photos = ["https://source.unsplash.com/random/1200x600", "https://source.unsplash.com/random/900x1000", "https://source.unsplash.com/random/1500x1600"];

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
        <div className={`.${postId} hover:bg-gray-50`} id={postId}>
            <Link to={`${ownerName}/${postId}`} className=" m-2 flex gap-2 hover:bg-gray-50">
                <div>
                    <Avatar className=" m-2" sx={{ width: 50, height: 50, zIndex: 1 }} src="./Public/logo/twitter.jpg" />
                </div>
                <div className="mr-2 flex w-[90%] flex-col gap-2 border-2 ">
                    <Link to={`/user/${ownerId}`} className="w-fit text-[1.1rem] font-bold hover:underline">
                        {ownerName}
                    </Link>
                    <pre className={` w-[98%] whitespace-pre-wrap break-words  `}>{tweet}</pre>
                    <div className={`grid w-[98%]  ${gridClass}  ${photos.length > 1 ? `max-h-[18rem]` : ""}  gap-[0.05rem] rounded-xl  ${photos.length > 0 ? `border-[0.05rem]` : ``}`}>
                        {photos.map((photo, index) => (
                            <PhotoGallery photos={photos} photo={photo} index={index} />
                        ))}
                    </div>
                </div>
            </Link>

            <div className="my-4 ml-[5rem] flex w-[89.5%] gap-24  ">
                <div className="h-[1.35rem] w-[1.35rem] ">
                    <BiMessageRounded className="h-full w-full " />
                </div>
                <div className="h-[1.35rem] w-[1.35rem] ">
                    <AiOutlineRetweet className="h-full w-full " />
                </div>
                <div className="">
                    <button className="h-[1.35rem] w-[1.35rem] " onClick={likeHandler}>
                        {isLiked ? <AiFillHeart className="h-full w-full  fill-red-400" /> : <AiOutlineHeart className="h-full w-full  hover:text-red-400" />}
                    </button>
                </div>
            </div>
            <hr className="w-full bg-gray-100" />
        </div>
    );
};

export default Post;
