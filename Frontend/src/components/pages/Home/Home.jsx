import React, { useEffect, useState } from "react";
import Post from "./Post";
import PostsOfFollowing from "../../../context/actions/PostsOfFollowing";
import Loader from "../Loader";
import { useGlobalContext } from "../../../CustomHooks/useGlobalContext";
import EditorInHome from "../../Editors/EditorInHome";
import { CircularRadialProgressForTweetTextLimit, Globe } from "../../SVGs/SVGs";
import { v4 as uuidv4 } from "uuid";
const Home = () => {
    const { dispatchPostOfFollowing, ACTIONS, statePostOfFollowing, state } = useGlobalContext();

    //For getting post of users that the current loggedin user follows.
    async function PostOfFollowingUsers() {
        await PostsOfFollowing({ dispatchPostOfFollowing, ACTIONS });
    }

    useEffect(() => {
        PostOfFollowingUsers();
    }, []);

    const { posts, loading, error } = statePostOfFollowing;
    const profile = state.user && state.user.profile && state.user.profile.image.url ? state.user.profile.image.url : null;

    const [singleTweet, setSingleTweet] = useState({ id: uuidv4(), text: "" });
    const [showGlobe, setShowGlobe] = useState(false);
    const handleChange = (value) => {
        setShowGlobe(true);
        setSingleTweet({ ...singleTweet, text: value });
    };
    const showGlobeHandler = () => {
        setShowGlobe(true);
    };
    const handleTweet = () => console.log(singleTweet.text, singleTweet.id);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className="sticky inset-0 z-10 flex h-[7rem] w-[44vw] flex-col gap-2 border-2  bg-white/60  backdrop-blur-md  ">
                        <h1 className="mx-2 mt-2  text-2xl font-bold">Home</h1>

                        <div className="flex h-full items-center justify-center  ">
                            <div className="flex h-full w-fit cursor-pointer flex-col items-center  justify-center  px-20 hover:border-2 hover:bg-gray-200">
                                <div className=" mt-[0.65rem]  text-center font-bold">Following</div>
                                <div className=" mt-[1.2rem] w-[4.8rem] rounded-3xl border-[0.15rem] border-blue-500  "></div>
                            </div>
                        </div>
                    </div>

                    <main className="grid grid-cols-[44vw_auto]  ">
                        <div className={` flex h-[100%] flex-col border-l border-r`}>
                            <div className="  min-h-[7.5rem] border-b">
                                <div className="m-2 flex  gap-2">
                                    <div className="">
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
                                    </div>
                                    <EditorInHome
                                        showGlobeHandler={showGlobeHandler}
                                        onChange={(value) => {
                                            handleChange(value);
                                        }}
                                    />
                                </div>
                                {showGlobe && (
                                    <>
                                        <div className="mt-2 ml-[3.6rem] flex  w-[15rem]   ">
                                            <div className="flex h-6  w-fit select-none items-center  gap-1 rounded-[1.8rem] px-3 text-[0.94rem] font-bold  text-blue-500 hover:bg-blue-100">
                                                <Globe />
                                                <p className="">Everyone can reply</p>
                                            </div>
                                        </div>{" "}
                                        <div className=" ml-[4.6rem] mt-3 w-[85%] border-[0.01rem] bg-gray-300"></div>
                                    </>
                                )}

                                <div className={` mx-5 mt-3 mb-2 flex justify-end gap-2 `}>
                                    {singleTweet.text.length > 0 && (
                                        <div className="flex gap-1">
                                            <div className={`  h-[2.3rem] w-fit `}>{<CircularRadialProgressForTweetTextLimit tweetCount={singleTweet.text.length} maxCount={280} />}</div>
                                            <div className="min-h-full border-l-2"></div>
                                            <button className=" h-9 w-9  rounded-full border-2 border-gray-200 font-bold text-blue-500 hover:bg-blue-100">+</button>
                                        </div>
                                    )}
                                    {singleTweet.text.length > 0 && singleTweet.text.length <= 280 ? (
                                        <button className=" w-fit rounded-3xl bg-blue-500  px-3 py-[0.2rem] font-bold text-white" onClick={handleTweet}>
                                            Tweet
                                        </button>
                                    ) : (
                                        <button className="w-fit rounded-3xl bg-gray-500  px-3 py-[0.2rem] font-bold text-white">Tweet </button>
                                    )}
                                </div>
                            </div>
                            {posts && posts.length > 1 ? (
                                posts.map((post) => {
                                    const ownerImage = post.owner.profile && post.owner.profile.image.url ? post.owner.profile.image.url : null;
                                    const postVideo = post.video && post.video.url ? post.video.url : null;

                                    return (
                                        <Post
                                            key={post._id}
                                            postId={post._id}
                                            tweet={post.tweet}
                                            postImage={post.images.url}
                                            postVideo={postVideo}
                                            likes={post.likes}
                                            comments={post.comments}
                                            ownerName={post.owner.name}
                                            ownerImage={ownerImage}
                                            ownerId={post.owner._id}
                                        />
                                    );
                                })
                            ) : (
                                <div>Follow someone to see their tweets</div>
                            )}
                        </div>
                    </main>
                </>
            )}
        </>
    );
};

export default Home;
