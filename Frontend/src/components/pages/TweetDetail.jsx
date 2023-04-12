import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BiMessageRounded } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { Avatar } from "@mui/material";
import PhotoGallery from "./PhotoGallery";
import LikeUnlike from "../context/actions/LikeUnlike";
import "./AnimationUsedInPostAndTweetDetail.css";
import axios from "axios";
import useAnimation from "../CustomHooks/useAnimation";
import { useGlobalContext } from "../CustomHooks/useGlobalContext";

const TweetDetail = () => {
    const { ACTIONS, dispatchLikeUnlike, state } = useGlobalContext();

    //For navigating to a particular section that is to the tweet that openend this component.
    const navigate = useNavigate();
    const { postId } = useParams();
    function handleClick() {
        navigate("/", { state: { sectionId: postId } });
    }

    //using data that was sent in the state  from Post
    const location = useLocation();
    const { tweet, ownerName, ownerId, ownerImage, postImage, postVideo, comments, isDelete, isAccount } = location.state;

    //For like and unlike of post
    const [isLiked, setIsLiked] = useState(false);
    const [liked, setLiked] = useState(null);

    const fetchData = useCallback(async () => {
        window.scrollTo(0, 0); //For scrolling to the top of window when the component shows up

        //gets the updated data of likes, when user likes at homepage and then comes to detailpage,the user gets the updated data
        const { data } = await axios.get(`http://localhost:4000/api/v1/${postId}`, { withCredentials: true });
        let like = [];
        like = data.post.likes;
        setLiked(like.length);

        //For keeping the heart red or unred even after refreshing the page
        like.forEach((item) => {
            if (item._id === state.user._id) {
                setIsLiked(true);
            }
        });
    }, [postId, state.user._id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    //ANIMATION FOR THE NUMBER NEXT TO LIKE/UNLIKE USING CUSTOM HOOK
    const [animationLikes, liked1, handleLikesAnimation] = useAnimation(isLiked, setIsLiked, liked, setLiked);

    const likeHandler = async () => {
        handleLikesAnimation();
        await LikeUnlike({ dispatchLikeUnlike, ACTIONS, postId });
    };

    const photos = [];
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

    return (
        <main className="grid grid-cols-[44vw_auto]   ">
            <div className="flex h-[100%] min-h-screen flex-col  border-l  border-r">
                <div className=" sticky inset-0 z-10 flex h-[3.5rem] items-center gap-7 bg-white/60 backdrop-blur-md ">
                    <div onClick={handleClick}>
                        <div className="m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:border-2 hover:bg-gray-200 active:bg-gray-300">
                            <AiOutlineArrowLeft className="h-[65%] w-[65%] " />
                        </div>
                    </div>
                    <div className="text-[1.6rem] font-bold">Tweet</div>
                </div>
                <div className=" m-2  gap-2  ">
                    <div className="flex gap-2">
                        <div>
                            <Avatar className=" m-2 " sx={{ width: 50, height: 50, zIndex: 1 }} src="../Public/logo/twitter.jpg" />
                        </div>
                        <div className="mr-2 flex w-[87%] flex-col gap-2 ">
                            <Link to={`/user/${ownerId}`} className="w-fit text-[1.1rem] font-bold hover:underline">
                                {ownerName}
                            </Link>
                            handle
                        </div>
                    </div>
                    <div className="m-2">
                        <pre className={` mb-3 max-w-[98%] whitespace-pre-wrap break-words `}>{tweet}</pre>
                        <div className={`grid max-w-[98%]  ${gridClass}  ${photos.length > 1 ? `max-h-[18rem]` : "max-h-[30rem]  "}  gap-[0.05rem] rounded-xl  ${photos.length > 0 ? `border-[0.05rem]` : ``}`}>
                            {photos.length > 0 && photos.map((photo, index) => <PhotoGallery key={index} photos={photos} photo={photo} index={index} />)}
                        </div>
                    </div>
                </div>
                <div className="mx-4 -mt-1  "> time</div>
                <div className="m-4  border-t-[0.05rem]"></div>
                <div className="mx-4 flex gap-8  font-bold">
                    <div className="cursor-pointer">
                        <span className={`${animationLikes}`}>1</span> <span className={` text-[0.9rem] font-normal hover:underline`}>Retweets</span>
                    </div>
                    <div className="cursor-pointer">
                        <span className={`${animationLikes}`}>1</span> <span className={`text-[0.9rem] font-normal hover:underline`}>Quotes</span>
                    </div>
                    <div className="cursor-pointer">
                        <span className={`${animationLikes}`}>{liked1}</span> <span className={`text-[0.9rem] font-normal hover:underline`}>Likes</span>
                    </div>
                    <div className="cursor-pointer">
                        <span className={`${animationLikes}`}>1</span> <span className={` text-[0.9rem] font-normal hover:underline`}>Bookmarks</span>
                    </div>
                </div>
                <div className="m-4  border-t-[0.05rem]"></div>
                <div className="  mx-2 -mt-2 flex gap-20    pl-10">
                    <div className="group flex items-center justify-center gap-2 ">
                        <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                            <BiMessageRounded className="h-[1.35rem] w-[1.35rem] " />
                        </button>
                    </div>

                    <div className="group flex items-center justify-center gap-2 ">
                        <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-green-100 group-hover:text-green-500">
                            <AiOutlineRetweet className="h-[1.35rem] w-[1.35rem] " />
                        </button>
                    </div>
                    <div className=" group flex items-center justify-center gap-2  ">
                        <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-red-100 group-hover:text-red-500" onClick={likeHandler}>
                            {isLiked ? <AiFillHeart className="h-[1.35rem] w-[1.35rem]  fill-red-500" /> : <AiOutlineHeart className="h-[1.35rem] w-[1.35rem]   " />}
                        </button>
                    </div>
                    <div className="group flex items-center justify-center gap-2 ">
                        <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                            <FaRegBookmark className="h-[1.2rem] w-[1.2rem] " />
                        </button>
                    </div>
                </div>
                <div className="m-5  border-t-[0.05rem]"></div> <hr className="w-full bg-gray-100" />
                <div className="mt-10">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia, vero ducimus. Doloribus, quam est voluptatibus vero odio quia repellendus dolor et nulla quibusdam asperiores hic, harum aliquid eaque, aspernatur laboriosam alias
                    officia quod numquam quos! Dignissimos fugit molestias quasi nemo nihil aspernatur itaque, ea, et doloribus obcaecati dolore amet reiciendis ipsa delectus, iste magni similique. Enim debitis molestiae mollitia numquam, pariatur
                    corrupti nostrum dolores nemo qui harum iusto laborum porro necessitatibus dolorem et fugiat fugit esse aliquid saepe deserunt vitae. Officia qui labore perferendis vero illo deleniti non odit necessitatibus accusamus omnis
                    eveniet molestiae facilis tempore sapiente natus nam, commodi eum aut autem esse sed nesciunt sequi aliquam ipsam. Libero sequi impedit nihil laboriosam aliquam repudiandae cum doloribus error molestias, facere dolores alias iste
                    odit iure doloremque debitis iusto inventore voluptatem commodi voluptatibus accusantium maiores repellendus, porro ipsum. Officiis, dolorem cum! Cupiditate expedita iure magnam fugiat repellendus blanditiis quae, mollitia nisi id
                    error sunt minima iste quaerat aliquid repudiandae incidunt. Fugit eos et officiis tempore doloribus sed quibusdam. Sit, voluptates? Dolorem ipsa cum exercitationem numquam, reiciendis, hic illo pariatur, quia culpa nulla
                    consectetur iure et? Ipsa mollitia recusandae laborum omnis. Quis, placeat! Reiciendis libero sed rerum accusantium, quisquam iste nihil.S
                </div>
            </div>
        </main>
    );
};

export default TweetDetail;
