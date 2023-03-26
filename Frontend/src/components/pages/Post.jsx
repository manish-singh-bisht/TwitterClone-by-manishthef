import React, { useId, useState } from "react";
import { BiMessageRounded } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { FaRetweet } from "react-icons/fa";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";

const Post = ({ postId, tweet, ownerName, ownerId, ownerImage, postImage, postVideo, likes = [], comments = [], isDelete = false, isAccount = false }) => {
    const [isLiked, setIsLiked] = useState(false);
    const likeHandler = () => {
        setIsLiked(!isLiked);
    };
    return (
        <>
            <Link to={`${ownerId}/${postId}`} className="h-100% m-2 flex gap-2 hover:bg-gray-100">
                <Avatar className="" src={ownerImage} />
                <div className=" mr-2 flex w-[90%] flex-col gap-2 ">
                    <Link to={`/user/${ownerId}`} className="  ">
                        {ownerName}
                    </Link>
                    <pre className="whitespace-pre-wrap break-words">{tweet}</pre>
                    <div className="my-2 flex gap-24 ">
                        <BiMessageRounded />
                        <AiOutlineRetweet />
                        <button onClick={likeHandler}>{isLiked ? <AiFillHeart className="fill-red-400 " /> : <AiOutlineHeart className="  hover:text-red-400" />}</button>
                    </div>
                </div>
            </Link>
            <hr className=" w-full bg-gray-100 " />
        </>
    );
};

export default Post;
