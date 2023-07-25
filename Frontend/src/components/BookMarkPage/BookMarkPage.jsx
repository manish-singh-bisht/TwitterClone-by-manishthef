import React, { Suspense, useEffect, useState } from "react";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import { ThreeDots } from "../SVGs/SVGs";
import MoreOptionMenuModal from "../Modal/MoreOptionMenuModal";
import Loader from "../Loader/Loader";
import axios from "axios";
import Post from "../CommonPostComponent/Post";
import CommentLikeUnlike from "../../context/Actions/CommentLikeUnlike";
import LikeUnlike from "../../context/Actions/LikeUnlike";
import RetweetComment from "../../context/Actions/RetweetComment";
import RetweetPost from "../../context/Actions/RetweetPost";
import PostBookmark from "../../context/Actions/PostBookmark";
import CommentBookmark from "../../context/Actions/CommentBookmark";

const BookMarkPage = () => {
    // this is just for showing the posts that were bookmarked by the logged in user, to see how the number of the bookmark is being changed or from where the api call is being made to mark a post as bookmark, refer to Frontend\src\components\CommonPostComponent\BookMark.jsx.
    const { state, ACTIONS, dispatchCommentLikeUnlike, dispatchLikeUnlike, dispatchRetweetPost, dispatchRetweetComment, dispatchBookmarkComment, dispatchBookmarkTweet } = useGlobalContext();

    //Modal for more option
    const [visibility, setVisibility] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

    const handleOutsideClickMoreOption = (event) => {
        if (event.target === event.currentTarget) {
            setVisibility(false);
            document.body.style.overflow = "unset";
        }
    };
    const onCloseMoreOptionModal = () => {
        setVisibility(false);
        document.body.style.overflow = "unset";
    };

    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const functionToGetAllBookmarks = async () => {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:4000/api/v1/getBookmarks/${state.user._id}`, { withCredentials: true });
            setLoading(false);
            setBookmarks(data.bookmarks);
        };
        functionToGetAllBookmarks();
    }, []);

    const removeBookmark = (id) => {
        setBookmarks((prev) => {
            return prev.filter((item) => {
                return item._id !== id;
            });
        });
    };
    const deleteAllBookmarks = async () => {
        setBookmarks([]);
        await axios.delete(`http://localhost:4000/api/v1/deleteAllBookmarks/${state.user._id}`, { withCredentials: true });
    };

    return (
        <div className="h-[100%] min-h-[100vh] border-l border-r">
            <div className="sticky inset-0 z-10 flex h-fit   justify-between    bg-white/60  backdrop-blur-md ">
                <div className="mx-2 flex flex-col ">
                    <span className="   text-2xl font-bold">Bookmarks</span>
                    <span className="  text-sm text-gray-600">@{state.user.handle}</span>
                </div>
                <div
                    className="m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:border-2 hover:bg-gray-200 active:bg-gray-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        setVisibility(true);
                        document.body.style.overflow = "hidden";
                        const buttonRect = e.target.getBoundingClientRect();
                        const top = buttonRect.top + buttonRect.height;
                        const left = buttonRect.left;
                        setButtonPosition({ top, left });
                    }}>
                    <ThreeDots />
                </div>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <div>
                    {bookmarks.length > 0 ? (
                        bookmarks.map((post) => {
                            const ownerImage = post.owner.profile && post.owner.profile.image.url ? post.owner.profile.image.url : null;
                            const imageInPost = post.images ? post.images : null;

                            return (
                                <Post
                                    key={post._id}
                                    postId={post._id}
                                    POSTID={post.comment ? post.post : null}
                                    tweet={post.tweet || post.comment}
                                    likes={post.likes}
                                    postImage={imageInPost}
                                    retweets={post.retweets}
                                    comments={post.comments}
                                    ownerName={post.owner.name}
                                    ownerImage={ownerImage}
                                    ownerId={post.owner._id}
                                    handle={post.owner.handle}
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
                                    fromBookmarks={true}
                                    removeBookmark={(id) => removeBookmark(id)}
                                    isCommentBookmark={post.comment ? true : false}
                                />
                            );
                        })
                    ) : (
                        <div className="mt-[4.3rem] flex flex-col items-center justify-center">
                            <img className="h-[10.6rem]" src="../../../Public/bookmarksNone.png" alt="no bookmark image" />
                            <div className="text-[2.1rem] font-bold">Save Tweets for later </div>

                            <div className="text-gray-600">
                                Don't let the good ones fly away! Bookmark <br /> Tweets to easily find them again in the future.
                            </div>
                        </div>
                    )}
                </div>
            )}
            <Suspense fallback={<Loader />}>
                <MoreOptionMenuModal
                    visibility={visibility}
                    handleOutsideClick={handleOutsideClickMoreOption}
                    buttonPosition={buttonPosition}
                    onCloseMoreOptionModal={onCloseMoreOptionModal}
                    fromBookmarks={true}
                    deleteAllBookmarks={deleteAllBookmarks}
                    setVisibilityBookmark={setVisibility}
                />
            </Suspense>
        </div>
    );
};

export default BookMarkPage;
