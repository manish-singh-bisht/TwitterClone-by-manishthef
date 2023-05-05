import React, { useEffect } from "react";
import Post from "./Post";
import PostsOfFollowing from "../../../context/actions/PostsOfFollowing";
import Loader from "../Loader";
import { useGlobalContext } from "../../../CustomHooks/useGlobalContext";
import TweetBoxInHome from "./TweetBoxInHome";
import LikeUnlike from "../../../context/Actions/LikeUnlike";
const Home = () => {
    const { dispatchPostOfFollowing, ACTIONS, statePostOfFollowing, state, dispatchLikeUnlike } = useGlobalContext();

    const { posts, loading, error } = statePostOfFollowing;
    const profile = state.user && state.user.profile && state.user.profile.image.url ? state.user.profile.image.url : null;

    //For getting post of users that the current loggedin user follows.
    async function PostOfFollowingUsers() {
        await PostsOfFollowing({ dispatchPostOfFollowing, ACTIONS });
    }

    useEffect(() => {
        PostOfFollowingUsers();
    }, []);

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
                            <TweetBoxInHome profile={profile} />
                            {posts && posts.length > 0 ? (
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
                                            handle={post.owner.handle}
                                            timeCreated={post.createdAt}
                                            handler={LikeUnlike}
                                            dispatch={dispatchLikeUnlike}
                                            state={state}
                                            ACTIONS={ACTIONS}
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
