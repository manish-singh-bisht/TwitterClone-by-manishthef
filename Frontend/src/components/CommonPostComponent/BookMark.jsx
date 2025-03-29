import React, { useEffect, useState } from "react";
import useAnimation from "../../CustomHooks/useAnimation";
import { Bookmark, UndoBookmark } from "../SVGs/SVGs";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";

const BookMark = ({ bookmarks, ACTIONS, dispatchBookmark, handlerBookmark, postId, fromBookmarks = false, removeBookmark = null }) => {
    const { state, setComment } = useGlobalContext();
    //For bookmarking of post
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarked, setBookmarked] = useState(bookmarks.length);

    const [animationBookmarked, bookmarkedValue, handleBookmarkedAnimation] = useAnimation(isBookmarked, setIsBookmarked, bookmarked, setBookmarked);

    const bookmarkedHandler = async () => {
        handleBookmarkedAnimation();
        if (fromBookmarks) {
            removeBookmark(postId);
        }
        await handlerBookmark({ dispatchBookmark, ACTIONS, postId, state, setComment });
    };

    useEffect(() => {
        bookmarks.forEach((item) => {
            if (item._id === state.user._id) {
                setIsBookmarked(true);
            }
        });
    }, []);
    return (
        <>
            <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-blue-100 group-hover:text-blue-500" onClick={bookmarkedHandler}>
                {isBookmarked ? <Bookmark /> : <UndoBookmark />}
            </button>
            <span className={` ${isBookmarked && "text-blue-500"} group-hover:text-blue-500 ${animationBookmarked}`}>{bookmarkedValue > 0 ? bookmarkedValue : null}</span>
        </>
    );
};

export default BookMark;
