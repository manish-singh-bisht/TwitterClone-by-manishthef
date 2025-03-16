import React from "react";
import { Bookmark, Comments, HeartLike, HeartUnlike, Retweets, RetweetsGreen, UndoBookmark } from "../SVGs/SVGs";

const ActionButtonPanelLong = ({ retweetHandler, likeHandler, bookmarkedHandler, isRetweet, isLiked, isBookmarked, activeRef = null }) => {
    const actionButtons = [
        {
            action: null,
            component: <Comments bigIcon={true} />,
            undoComponent: <Comments bigIcon={true} />,
            color: "blue",
            is: null,
        },
        {
            action: retweetHandler,
            component: <RetweetsGreen bigIcon={true} />,
            undoComponent: <Retweets bigIcon={true} />,
            color: "green",
            is: isRetweet,
        },
        {
            action: likeHandler,
            component: <HeartLike bigIcon={true} />,
            undoComponent: <HeartUnlike bigIcon={true} />,
            color: "red",
            is: isLiked,
        },
        {
            action: bookmarkedHandler,
            component: <Bookmark bigIcon={true} />,
            undoComponent: <UndoBookmark bigIcon={true} />,
            color: "blue",
            is: isBookmarked,
        },
    ];
    return (
        <div className={`mx-2 -mt-2 flex gap-10 pl-6 md:gap-20 md:pl-10 ${activeRef && "scroll-mt-32"}`} ref={activeRef}>
            {actionButtons.map((button, index) => (
                <div key={index} className={`group flex items-center justify-center gap-2 `}>
                    <button className={`flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-${button.color}-100 group-hover:text-${button.color}-500`} onClick={() => button.action()}>
                        {button.is ? button.component : button.undoComponent}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ActionButtonPanelLong;
