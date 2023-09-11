import React from "react";

const ShowValues = ({ retweetValue, likedValue, bookmarkedValue, animationBookmarked, animationLikes, animationRetweet, setIsModalOpen, setType, setList, retweetBy, likedBy }) => {
    const actionButtons = [
        {
            value: retweetValue,
            action: "Retweeted",
            label: "Retweets",
            animation: animationRetweet,
        },
        {
            value: likedValue,
            action: "Liked",
            label: "Likes",
            animation: animationLikes,
        },
        {
            value: bookmarkedValue,
            action: "Bookmarked",
            label: "Bookmarks",
            animation: animationBookmarked,
        },
    ];
    return (
        <>
            {actionButtons.some((button) => button.value > 0) ? (
                <>
                    <div className="mx-4 flex gap-8 font-bold">
                        {actionButtons.map((button) => {
                            if (button.value <= 0) return;
                            return (
                                <div
                                    key={button.action}
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setIsModalOpen(true);
                                        document.body.style.overflow = "hidden";
                                        setType(button.action);
                                        setList(button.action === "Retweeted" ? retweetBy : button.action === "Liked" ? likedBy : []);
                                    }}>
                                    {button.value > 0 ? <span className={`${button.animation} mr-1`}>{button.value}</span> : null}
                                    <span className="text-[0.9rem] font-normal hover:underline">{button.value === 1 ? button.label.slice(0, -1) : button.label}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="m-4 border-t-[0.01rem] opacity-80"></div>
                </>
            ) : null}
        </>
    );
};

export default ShowValues;
