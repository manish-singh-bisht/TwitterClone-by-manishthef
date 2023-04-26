import React, { Suspense, useCallback, useEffect, useState } from "react";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import PhotoGallery from "./PhotoGallery";
import LikeUnlike from "../../../context/actions/LikeUnlike";
import "./AnimationUsedInPostAndTweetDetail.css";
import axios from "axios";
import useAnimation from "../../../CustomHooks/useAnimation";
import { useGlobalContext } from "../../../CustomHooks/useGlobalContext";
import Loader from "../Loader";
import { Bookmark, Comments, HeartLike, HeartUnlike, LeftArrow, Retweets } from "../../SVGs/SVGs";

const ModalForLikesBookmarksRetweets = React.lazy(() => import("../../Modal/ModalForLikesBookmarksRetweets"));

const TweetDetail = () => {
    const { ACTIONS, dispatchLikeUnlike, state } = useGlobalContext();

    //Modal for like,retweet,Bookmark
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState("");
    const [list, setList] = useState(null);
    const hideModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = "unset";
    };

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
    const [likedBy, setIsLikedBy] = useState([]);

    const fetchData = useCallback(async () => {
        //gets the updated data of likes, when user likes at homepage and then comes to detailpage,the user gets the updated data
        const { data } = await axios.get(`http://localhost:4000/api/v1/${postId}`, { withCredentials: true });
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
    }, [postId, state.user._id, isLiked]);

    useEffect(() => {
        //For scrolling to the top of window when the component shows up
        window.scrollTo(0, 0);
        //When user opens the like modal, when clicked on like, and clicks any profile, it takes them to their profile and when they click back arrow, it brings them here,so if its not there then the overflow will be hidden,so it prevents that.
        document.body.style.overflow = "unset";
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    //ANIMATION FOR THE NUMBER NEXT TO LIKE/UNLIKE USING CUSTOM HOOK
    const [animationLikes, likedValue, handleLikesAnimation] = useAnimation(isLiked, setIsLiked, liked, setLiked);

    const likeHandler = async () => {
        handleLikesAnimation();
        await LikeUnlike({ dispatchLikeUnlike, ACTIONS, postId });
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
    const profile = "";
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
                <div className=" m-2  gap-2  ">
                    <div className="flex gap-2">
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
                <div className="m-4  border-t-[0.01rem] opacity-80"></div>
                <div className="mx-4 flex gap-8  font-bold">
                    <div className="cursor-pointer">
                        <span className={`${animationLikes}`}>1</span> <span className={` text-[0.9rem] font-normal hover:underline`}>Retweets</span>
                    </div>
                    <div className="cursor-pointer">
                        <span className={`${animationLikes}`}>1</span> <span className={`text-[0.9rem] font-normal hover:underline`}>Quotes</span>
                    </div>
                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            setIsModalOpen(true);
                            document.body.style.overflow = "hidden";
                            setType("Liked");
                            setList(likedBy);
                        }}>
                        <span className={`${animationLikes}`}>{likedValue}</span>
                        <span className={`text-[0.9rem] font-normal hover:underline`}>Likes</span>
                    </div>
                    <div className="cursor-pointer">
                        <span className={`${animationLikes}`}>1</span> <span className={` text-[0.9rem] font-normal hover:underline`}>Bookmarks</span>
                    </div>
                </div>
                <div className="m-4  border-t-[0.01rem] opacity-80"></div>
                <div className="  mx-2 -mt-2 flex gap-20    pl-10">
                    <div className="group flex items-center justify-center gap-2 ">
                        <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                            <Comments />
                        </button>
                    </div>

                    <div className="group flex items-center justify-center gap-2 ">
                        <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-green-100 group-hover:text-green-500">
                            <Retweets />
                        </button>
                    </div>
                    <div className=" group flex items-center justify-center gap-2  ">
                        <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-red-100 group-hover:text-red-500" onClick={likeHandler}>
                            {isLiked ? <HeartLike /> : <HeartUnlike />}
                        </button>
                    </div>
                    <div className="group flex items-center justify-center gap-2 ">
                        <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                            <Bookmark />
                        </button>
                    </div>
                </div>
                <div className="m-5  border-t-[0.01rem] opacity-80"></div> <hr className="w-full bg-gray-100" />
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
            <Suspense fallback={<Loader />}>
                <ModalForLikesBookmarksRetweets visibility={isModalOpen} onClose={hideModal} type={type} list={list} />
            </Suspense>
        </main>
    );
};

export default TweetDetail;
