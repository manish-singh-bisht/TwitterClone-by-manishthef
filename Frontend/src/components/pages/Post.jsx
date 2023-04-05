import React, { useState } from "react";
import { BiMessageRounded } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import PhotoGallery from "./PhotoGallery";

const Post = ({ postId, tweet, ownerName, ownerId, ownerImage, postImage, postVideo, likes = [], comments = [], isDelete = false, isAccount = false }) => {
    const [isLiked, setIsLiked] = useState(false);
    const likeHandler = () => {
        setIsLiked(!isLiked);
    };

    const photos = [];
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
        <div className="   hover:bg-gray-50">
            <Link to={`${ownerName}/${postId}`} className=" m-2 flex gap-2 hover:bg-gray-50">
                <div>
                    <Avatar className=" m-2" sx={{ width: 50, height: 50, zIndex: 10 }} src="./Public/logo/twitter.jpg" />
                </div>
                <div className="mr-2 flex w-[90%] flex-col gap-2 ">
                    <Link to={`/user/${ownerId}`} className="text-[1.1rem] font-bold hover:underline ">
                        {ownerName}
                    </Link>
                    <pre className="whitespace-pre-wrap break-words text-lg">{tweet}</pre>
                    <div className={`grid ${gridClass}  ${photos.length > 1 ? `max-h-[18rem]` : ""}  gap-[0.05rem] rounded-xl  ${photos.length > 0 ? `border-[0.05rem]` : ``}`}>
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
