import React, { Suspense, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Bookmark, Comments, HeartLike, HeartUnlike, LeftArrow, Retweets } from "../../SVGs/SVGs";
import CommentCard from "./CommentCard";
import Loader from "../Loader";
import ModalForLikesBookmarksRetweets from "../../Modal/ModalForLikesBookmarksRetweets";
import PhotoGallery from "./PhotoGallery";
import Avatar from "../Avatar";
import axios from "axios";

const CommentDetail = () => {
    //For navigating to a particular section that is to the tweet that openend this component.
    const navigate = useNavigate();
    const { commentId } = useParams();
    let postId;
    let tweet;
    let timeCreated;
    let handle;
    let ownerImage;
    let ownerName;

    useEffect(() => {
        const getCommentById = async () => {
            const { data } = await axios.get(`http://localhost:4000/api/v1/comment/${commentId}`, { withCredentials: true });
            postId = data.comment.post._id;
            tweet = data.comment.post.tweet;
            handle = data.comment.post.owner.handle;
            timeCreated = data.comment.post.createdAt;
            ownerName = data.comment.post.owner.name;
            ownerImage = data.comment.post.owner.profile && data.comment.post.owner.profile.image.url ? data.comment.post.owner.profile.image.url : null;
        };
        getCommentById();
    }, []);

    function handleClick() {
        navigate(`/${ownerName}/${postId}`, { replace: true, state: { sectionId: commentId, tweet, handle, ownerName, timeCreated, ownerImage } });
    }
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
            </div>
        </main>
    );
};

export default CommentDetail;
