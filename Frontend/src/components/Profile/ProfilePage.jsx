import React, { Suspense, useEffect, useState } from "react";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Calendar, LeftArrow, LinkInProfile, LocationInProfile } from "../SVGs/SVGs";
import { BannerImage, ProfileImage } from "./ProfileBanner";
import Loader from "../Loader/Loader";
import axios from "axios";
import Post from "../CommonPostComponent/Post";
import CommentLikeUnlike from "../../context/Actions/CommentLikeUnlike";
import LikeUnlike from "../../context/Actions/LikeUnlike";
import RetweetComment from "../../context/Actions/RetweetComment";
import RetweetPost from "../../context/Actions/RetweetPost";
import CommentBookmark from "../../context/Actions/CommentBookmark";
import PostBookmark from "../../context/Actions/PostBookmark";
import FollowUser from "../../context/Actions/FollowUser";
import InfiniteScrollWrapper from "../CommonPostComponent/InfiniteScrollWrapper";

const UpdateModal = React.lazy(() => import("../Modal/UpdateModal"));

const ProfilePage = () => {
    const { state, setUsersForRightSidebar, dispatchFollowUser, dispatch, dataArray, setDataArray, ACTIONS, dispatchBookmarkComment, dispatchLikeUnlike, dispatchRetweetPost, dispatchRetweetComment, dispatchCommentLikeUnlike, dispatchBookmarkTweet } =
        useGlobalContext();

    const [visibility, setVisibility] = useState(false);
    const [activeButton, setActiveButton] = useState("Tweets");
    const [user, setUser] = useState(null);
    const [total, setTotal] = useState(null);
    const [loading, setloading] = useState(false);
    const [isPinned, setIsPinned] = useState({ bool: false, id: null });

    const navigate = useNavigate();
    const params = useParams();
    const userHandle = params.userName;

    const handleClick = () => {
        navigate(-1);
    };

    const fetchDataForButton = async (label, endpoint) => {
        setActiveButton(label);
        setloading(true);
        const { data } = await axios.get(endpoint, { withCredentials: true });
        setDataArray(data.posts);
        setloading(false);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = "unset";
        setUsersForRightSidebar(null);

        const getTweets = (userHandle) => fetchDataForButton("Tweets", `http://localhost:4000/api/v1/getTweets/${userHandle}`);

        const getProfileUser = async (userHandle) => {
            const { data } = await axios.get(`http://localhost:4000/api/v1/user/${userHandle}`, { withCredentials: true });
            setUser(data.userProfile);
            setTotal(data.total);
            setIsPinned({ bool: data.userProfile.pinnedTweet ? true : false, id: data.userProfile.pinnedTweet ? data.userProfile.pinnedTweet : null });

            getTweets(userHandle);
        };

        if (state.user.handle === userHandle) {
            setUser(state.user);
            setTotal(state.total);
            setIsPinned({ bool: state.user.pinnedTweet ? true : false, id: state.user.pinnedTweet ? state.user.pinnedTweet : null });
            getTweets(userHandle);
        } else {
            getProfileUser(userHandle);
        }
    }, [window.location.pathname]);

    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
            setVisibility(false);
            document.body.style.overflow = "unset";
        }
    };
    const onClose = () => {
        setVisibility(false);
        document.body.style.overflow = "unset";
    };

    const tweetButtonHandler = () => fetchDataForButton("Tweets", `http://localhost:4000/api/v1/getTweets/${userHandle}`);
    const replyButtonHandler = () => fetchDataForButton("Replies", `http://localhost:4000/api/v1/getReply/${userHandle}`);
    const mediaButtonHandler = () => fetchDataForButton("Media", `http://localhost:4000/api/v1/getPostWithMedia/${userHandle}`);
    const likedButtonHandler = () => fetchDataForButton("Likes", `http://localhost:4000/api/v1/getLikedPost/${userHandle}`);

    const url =
        (activeButton === "Tweets" && `http://localhost:4000/api/v1/getTweets/${userHandle}?page=`) ||
        (activeButton === "Replies" && `http://localhost:4000/api/v1/getReply/${userHandle}?page=`) ||
        (activeButton === "Media" && `http://localhost:4000/api/v1/getPostWithMedia/${userHandle}?page=`) ||
        (activeButton === "Likes" && `http://localhost:4000/api/v1/getLikedPost/${userHandle}?page=`);

    const followHandler = async (id) => {
        await FollowUser({ dispatchFollowUser, ACTIONS, id });
        const { data } = await axios.get("http://localhost:4000/api/v1/me", { withCredentials: true });
        dispatch({ type: ACTIONS.LOAD_SUCCESS, payload: { myProfile: data.myProfile, total: data.total } });
    };

    return (
        <>
            {!user ? (
                <Loader />
            ) : (
                <>
                    <main className="w-full xl:grid xl:grid-cols-[44vw_auto]   ">
                        <div className="flex h-[100%] min-h-[1400px] flex-col  border-l  border-r">
                            <div className=" sticky inset-0 z-10 flex h-[3.5rem] items-center gap-7 bg-white/60 backdrop-blur-md ">
                                <div onClick={handleClick}>
                                    <div className="m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:border-2 hover:bg-gray-200 active:bg-gray-300">
                                        <LeftArrow className="h-[65%] w-[65%] " />
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col
                        ">
                                    <div className="text-[1.6rem] font-bold">{user.name}</div>
                                    {total > 0 ? <div className="text-[0.9rem] text-gray-500">{total > 1 ? `${total} Tweets` : `${total}Tweet`}</div> : <div className="text-[0.9rem] text-gray-500">0 Tweets</div>}
                                </div>
                            </div>
                            <div className="mt-2 h-[13rem]">
                                <BannerImage banner={user.profile && user.profile.banner && user.profile.banner.url ? user.profile.banner.url : null} />
                            </div>
                            <div className="relative flex   h-[6.5rem] w-full justify-end   ">
                                <ProfileImage profile={user.profile && user.profile.image && user.profile.image.url ? user.profile.image.url : null} />
                                {state.user.handle === userHandle ? (
                                    <button
                                        className="mr-[0.5rem] mt-[0.6rem] h-fit w-fit rounded-3xl border-2 py-1 px-4 font-semibold hover:bg-gray-200 active:bg-gray-300"
                                        onClick={() => {
                                            document.body.style.overflow = "hidden";
                                            setVisibility(true);
                                        }}>
                                        Edit profile
                                    </button>
                                ) : (
                                    <button
                                        className={`group mr-[0.5rem] mt-[0.6rem] h-fit w-fit rounded-3xl border-2 py-2 px-4 font-bold  ${
                                            state.user.following.includes(user._id) ? "border-2 bg-white text-black hover:border-red-200 hover:bg-red-100" : "bg-black text-white hover:text-gray-300 active:text-gray-400"
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            followHandler(user._id);
                                        }}>
                                        {state.user.following.includes(user._id) ? (
                                            <>
                                                <span className="group-hover:hidden">Following</span>
                                                <span className="hidden group-hover:block">Unfollow</span>
                                            </>
                                        ) : (
                                            <span>Follow</span>
                                        )}
                                    </button>
                                )}
                            </div>
                            <div className="ml-4 flex flex-col gap-2 ">
                                <div className=" mb-2 flex flex-col">
                                    <div className="text-2xl font-bold">{user.name}</div>
                                    <div className="text-gray-500">@{user.handle}</div>
                                </div>
                                <div className="flex max-w-[100%] flex-wrap">{user.description}</div>
                                <div className="flex flex-wrap gap-2">
                                    {user.location && (
                                        <span className="flex items-center gap-1">
                                            <LocationInProfile />
                                            {user.location}
                                        </span>
                                    )}
                                    {user.website && (
                                        <span className="flex cursor-pointer items-center gap-1 break-all leading-5 text-blue-500 hover:underline">
                                            <LinkInProfile />
                                            <a href={user.website} target="_blank">
                                                {user.website}
                                            </a>
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Calendar />
                                        {(() => {
                                            const dateTimeString = user.createdAt;
                                            const date = new Date(dateTimeString);
                                            const month = date.toLocaleString("default", { month: "long" });
                                            const year = date.getFullYear();
                                            const formattedDate = `${month} ${year}`;
                                            return `Joined ${formattedDate}`;
                                        })()}
                                    </span>
                                </div>
                                <div className=" flex gap-6">
                                    <Link
                                        to={{
                                            pathname: `/FollowersFollowingPage/${user.handle}`,
                                        }}
                                        state={{ choice: "following" }}
                                        className="cursor-pointer  text-gray-600 hover:underline">
                                        <span className="font-bold text-black">{user.following.length > 0 ? user.following.length : 0}</span> Following
                                    </Link>
                                    <Link
                                        to={{
                                            pathname: `/FollowersFollowingPage/${user.handle}`,
                                        }}
                                        state={{ choice: "followers" }}
                                        className="cursor-pointer text-gray-600 hover:underline">
                                        <span className="font-bold text-black">{user.followers.length > 0 ? user.followers.length : 0}</span> Followers
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-5 flex h-fit w-full items-center border-b">
                                <TabButton label="Tweets" active={activeButton === "Tweets"} onClick={tweetButtonHandler} />
                                <TabButton label="Replies" active={activeButton === "Replies"} onClick={replyButtonHandler} />
                                <TabButton label="Media" active={activeButton === "Media"} onClick={mediaButtonHandler} />
                                <TabButton label="Likes" active={activeButton === "Likes"} onClick={likedButtonHandler} />
                            </div>

                            {loading ? (
                                <Loader />
                            ) : (
                                <>
                                    <InfiniteScrollWrapper dataLength={dataArray.length} url={url} setArray={setDataArray}>
                                        {dataArray && dataArray.length > 0 ? (
                                            dataArray.map((item) => {
                                                if (activeButton === "Tweets") {
                                                    const post = item.originalPost ? item.originalPost : item;
                                                    const ownerRetweet = item.userRetweeted ? item.userRetweeted : null;
                                                    const ownerImage = post.owner.profile && post.owner.profile.image && post.owner.profile.image.url ? post.owner.profile.image.url : null;
                                                    const imageInPost = post.images ? post.images : null;

                                                    return (
                                                        <Post
                                                            key={`${post._id}+${item.createdAt}`}
                                                            postId={post._id}
                                                            POSTID={item.originalPost?.comment ? item.originalPost?.post : null}
                                                            tweet={post.tweet || post.comment}
                                                            isPinnedTweet={{ bool: isPinned.bool, id: isPinned.id }}
                                                            ownerRetweet={ownerRetweet}
                                                            isCommentRetweet={item.originalPost?.comment ? true : false}
                                                            likes={post.likes}
                                                            description={post.owner.description}
                                                            postImage={imageInPost}
                                                            retweets={post.retweets}
                                                            comments={item.originalPost?.comment ? post.children : post.comments}
                                                            ownerName={post.owner.name}
                                                            ownerImage={ownerImage}
                                                            ownerId={post.owner._id}
                                                            handle={post.owner.handle}
                                                            timeCreated={post.createdAt}
                                                            handler={item.originalPost?.comment ? CommentLikeUnlike : LikeUnlike}
                                                            dispatch={item.originalPost?.comment ? dispatchCommentLikeUnlike : dispatchLikeUnlike}
                                                            dispatchRetweet={item.originalPost?.comment ? dispatchRetweetComment : dispatchRetweetPost}
                                                            handlerRetweet={item.originalPost?.comment ? RetweetComment : RetweetPost}
                                                            handlerBookmark={item.originalPost?.comment ? CommentBookmark : PostBookmark}
                                                            dispatchBookmark={item.originalPost?.comment ? dispatchBookmarkComment : dispatchBookmarkTweet}
                                                            state={state}
                                                            bookmarks={post.bookmarks}
                                                            ACTIONS={ACTIONS}
                                                            mentions={post.mentions}
                                                            threadChildren={post.children}
                                                            fromProfile={true}
                                                            fromProfileTweets={true}
                                                            setIsPinned={setIsPinned}
                                                            whoCanReply={post.whoCanReply}
                                                            whoCanReplyNumber={post.whoCanReplyNumber}
                                                        />
                                                    );
                                                }

                                                if (activeButton === "Replies") {
                                                    const post = item.originalPost ? item.originalPost : item;
                                                    const ownerRetweet = item.userRetweeted ? item.userRetweeted : null;
                                                    const ownerImage = post.owner.profile && post.owner.profile.image && post.owner.profile.image.url ? post.owner.profile.image.url : null;
                                                    const imageInPost = post.images ? post.images : null;
                                                    const commentParentPost = item.originalPost?.tweet ? null : item.originalPost?.comment ? item.originalPost.comment.post : item.post;

                                                    return (
                                                        <div key={`overall+${post.createdAt}+${post._id}+${commentParentPost?.createdAt}`}>
                                                            {commentParentPost && (
                                                                <div key={commentParentPost._id}>
                                                                    {/* Parent Post */}
                                                                    <div className="relative  ">
                                                                        <Post
                                                                            key={`parent-${commentParentPost._id}+${post.createdAt}`}
                                                                            isComment={false}
                                                                            postId={commentParentPost._id}
                                                                            tweet={commentParentPost.tweet}
                                                                            likes={commentParentPost.likes}
                                                                            retweets={commentParentPost.retweets}
                                                                            bookmarks={commentParentPost.bookmarks}
                                                                            postImage={commentParentPost.images ? commentParentPost.images : null}
                                                                            commentsChildren={commentParentPost.comments}
                                                                            ownerName={commentParentPost.owner.name}
                                                                            description={commentParentPost.owner.description}
                                                                            ownerImage={
                                                                                commentParentPost.owner.profile && commentParentPost.owner.profile.image && commentParentPost.owner.profile.image.url ? commentParentPost.owner.profile.image.url : null
                                                                            }
                                                                            ownerId={commentParentPost.owner._id}
                                                                            handle={commentParentPost.owner.handle}
                                                                            timeCreated={commentParentPost.createdAt}
                                                                            handler={LikeUnlike}
                                                                            dispatch={dispatchLikeUnlike}
                                                                            dispatchRetweet={dispatchRetweetPost}
                                                                            handlerRetweet={RetweetPost}
                                                                            state={state}
                                                                            ACTIONS={ACTIONS}
                                                                            mentions={commentParentPost.mentions}
                                                                            handlerBookmark={PostBookmark}
                                                                            dispatchBookmark={dispatchBookmarkTweet}
                                                                            fromProfileRepliesParentPost={true}
                                                                            whoCanReply={commentParentPost.whoCanReply}
                                                                            whoCanReplyNumber={commentParentPost.whoCanReplyNumber}
                                                                        />
                                                                        <div className="absolute left-[2.37rem] top-[4.2rem] h-[calc(100%-3.85rem)]   w-fit border-2"></div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <Post
                                                                key={`${post._id}+${item.createdAt}`}
                                                                postId={post._id}
                                                                POSTID={item.originalPost?.tweet ? null : post.post.createdAt ? post.post._id : post.post}
                                                                tweet={post.tweet || post.comment}
                                                                ownerRetweet={ownerRetweet}
                                                                isCommentReply={item.originalPost?.tweet ? false : true}
                                                                likes={post.likes}
                                                                postImage={imageInPost}
                                                                retweets={post.retweets}
                                                                comments={item.originalPost?.tweet ? post.comments : post.children}
                                                                ownerName={post.owner.name}
                                                                description={post.owner.description}
                                                                ownerImage={ownerImage}
                                                                ownerId={post.owner._id}
                                                                handle={post.owner.handle}
                                                                timeCreated={post.createdAt}
                                                                handler={item.originalPost?.tweet ? LikeUnlike : CommentLikeUnlike}
                                                                dispatch={item.originalPost?.tweet ? dispatchLikeUnlike : dispatchCommentLikeUnlike}
                                                                dispatchRetweet={item.originalPost?.tweet ? dispatchRetweetPost : dispatchRetweetComment}
                                                                handlerRetweet={item.originalPost?.tweet ? RetweetPost : RetweetComment}
                                                                handlerBookmark={item.originalPost?.tweet ? PostBookmark : CommentBookmark}
                                                                dispatchBookmark={item.originalPost?.tweet ? dispatchBookmarkTweet : dispatchBookmarkComment}
                                                                state={state}
                                                                bookmarks={post.bookmarks}
                                                                ACTIONS={ACTIONS}
                                                                mentions={post.mentions}
                                                                threadChildren={post.children}
                                                                fromProfile={true}
                                                                fromProfileRepliesComment={true}
                                                            />
                                                        </div>
                                                    );
                                                }
                                                if (activeButton === "Media" || activeButton == "Likes") {
                                                    const post = item;
                                                    const ownerImage = post.owner.profile && post.owner.profile.image && post.owner.profile.image.url ? post.owner.profile.image.url : null;
                                                    const imageInPost = post.images ? post.images : null;

                                                    return (
                                                        <Post
                                                            key={post._id}
                                                            postId={post._id}
                                                            POSTID={post.comment ? post.post : null}
                                                            tweet={post.tweet || post.comment}
                                                            isCommentReply={post.comment ? true : false}
                                                            likes={post.likes}
                                                            postImage={imageInPost}
                                                            retweets={post.retweets}
                                                            comments={post.comments}
                                                            ownerName={post.owner.name}
                                                            ownerImage={ownerImage}
                                                            ownerId={post.owner._id}
                                                            handle={post.owner.handle}
                                                            description={post.owner.description}
                                                            timeCreated={post.createdAt}
                                                            handler={post.comment ? CommentLikeUnlike : LikeUnlike}
                                                            dispatch={post.comment ? dispatchCommentLikeUnlike : dispatchLikeUnlike}
                                                            dispatchRetweet={post.comment ? dispatchRetweetComment : dispatchRetweetPost}
                                                            handlerRetweet={post.comment ? RetweetComment : RetweetPost}
                                                            handlerBookmark={post.comment ? CommentBookmark : PostBookmark}
                                                            dispatchBookmark={post.comment ? dispatchBookmarkComment : dispatchBookmarkTweet}
                                                            state={state}
                                                            bookmarks={post.bookmarks}
                                                            ACTIONS={ACTIONS}
                                                            mentions={post.mentions}
                                                            threadChildren={post.children}
                                                            fromProfile={true}
                                                            fromMediaLikesProfile={true}
                                                            whoCanReply={post.whoCanReply}
                                                            whoCanReplyNumber={post.whoCanReplyNumber}
                                                        />
                                                    );
                                                }
                                            })
                                        ) : (
                                            <div>
                                                {dataArray.length === 0 && (
                                                    <div>
                                                        {activeButton === "Media" && renderEmptyMessage("hasn't Tweeted media", user.handle)}
                                                        {activeButton === "Likes" && renderEmptyMessage("hasn't liked any Tweets", user.handle)}
                                                        {activeButton === "Replies" && renderEmptyMessage("hasn't replied Tweets", user.handle)}
                                                        {activeButton === "Tweets" && renderEmptyMessage("hasn't Tweeted yet", user.handle)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </InfiniteScrollWrapper>
                                </>
                            )}
                        </div>
                    </main>
                    <Suspense fallback={<Loader />}>
                        <UpdateModal
                            visibility={visibility}
                            onClose={onClose}
                            handleOutsideClick={handleOutsideClick}
                            profile={user.profile && user.profile.image && user.profile.image.url ? user.profile.image.url : null}
                            banner={user.profile && user.profile.banner && user.profile.banner.url ? user.profile.banner.url : null}
                            name={user.name}
                            bio={user.description !== undefined ? user.description : null}
                            website={user.website !== undefined ? user.website : null}
                            location={user.location !== undefined ? user.location : null}
                            setUser={setUser}
                        />
                    </Suspense>
                </>
            )}
        </>
    );
};

export default ProfilePage;

export const TabButton = ({ label, active, onClick }) => (
    <button className={`w-full  font-semibold hover:bg-gray-200 md:w-fit md:px-12 md:text-[1.05rem] ${!active ? "py-[1rem] text-gray-600" : "pt-[0.8rem] text-black"}`} disabled={active} onClick={onClick}>
        {label}
        {active && (
            <div className="flex w-full items-center justify-center ">
                <div className=" mt-[0.8rem]  w-[2.5rem] rounded-3xl border-[0.15rem] border-blue-500  md:w-[3.4rem]"></div>
            </div>
        )}
    </button>
);

export const renderEmptyMessage = (message, handle) => (
    <div className="mt-6 flex flex-col items-center justify-center">
        <div className="flex w-[25rem] flex-col items-start">
            <span className="text-[1.9rem] font-bold">
                @<span className="break-all">{handle}</span> {message}
                <br />
            </span>
            <span className="text-gray-600">When they do, those Tweets will show up here.</span>
        </div>
    </div>
);
