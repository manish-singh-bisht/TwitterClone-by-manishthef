import React, { useEffect } from "react";

import Post from "./Post";
import { useGlobalContext } from "../context/Context";
import PostsOfFollowing from "../context/actions/PostsOfFollowing";
import GetAllUsers from "../context/actions/GetAllUsers";
import Loader from "./Loader";

const Home = () => {
    const { dispatchPostOfFollowing, ACTIONS, statePostOfFollowing, stateGetAllUsers, dispatchGetAllUsers } = useGlobalContext();

    async function PostOfFollowingUsers() {
        await PostsOfFollowing({ dispatchPostOfFollowing, ACTIONS });
    }
    // async function GetAllUsers() {
    //     await GetAllUsers({ dispatchGetAllUsers, ACTIONS });
    // }
    useEffect(() => {
        PostOfFollowingUsers();
    }, [dispatchPostOfFollowing]);

    const { posts, loading, error } = statePostOfFollowing;

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className="sticky inset-0 z-10 flex h-[7rem] w-[46vw] flex-col gap-2 border-2  bg-white/60  backdrop-blur-md  ">
                        <h1 className="mx-2 mt-2  text-2xl font-bold">Home</h1>

                        <div className="flex h-full items-center justify-center  ">
                            <div className="flex h-full w-fit cursor-pointer flex-col items-center  justify-center  px-20 hover:border-2 hover:bg-gray-200">
                                <div className=" mt-[0.65rem]  text-center font-bold">Following</div>
                                <div className=" mt-[1.2rem] w-[4.8rem] rounded-3xl border-[0.15rem] border-blue-500  "></div>
                            </div>
                        </div>
                    </div>

                    <main className="grid grid-cols-[46vw_auto]  ">
                        <div className="flex h-[100%] flex-col border-l border-r">
                            {posts && posts.length > 1 ? (
                                posts.map((post) => {
                                    return (
                                        <Post
                                            key={post._id}
                                            postId={post._id}
                                            tweet={post.tweet}
                                            postImage={post.images.url}
                                            postVideo={post.video.url}
                                            likes={post.likes}
                                            comments={post.comments}
                                            ownerName={post.owner.name}
                                            ownerImage={post.owner.profile.image.url}
                                            ownerId={post.owner._id}
                                        />
                                    );
                                })
                            ) : (
                                <div>no posts yet</div>
                            )}
                        </div>
                    </main>
                </>
            )}
        </>
    );
};

export default Home;
