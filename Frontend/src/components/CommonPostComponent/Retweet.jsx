import React, { useEffect, useState } from "react";
import useAnimation from "../../CustomHooks/useAnimation";
import { Retweets, RetweetsGreen } from "../SVGs/SVGs";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";

const Retweet = ({ retweets, ACTIONS, dispatchRetweet, handlerRetweet, postId }) => {
    const { state, setComment } = useGlobalContext();
    //For retweet of post
    const [isRetweet, setIsRetweet] = useState(false);
    const [retweet, setRetweet] = useState(retweets.length);

    //ANIMATION FOR THE NUMBER NEXT TO RETWEET USING CUSTOM HOOK
    const [animationRetweet, retweetValue, handleRetweetAnimation] = useAnimation(isRetweet, setIsRetweet, retweet, setRetweet);

    const retweetHandler = async () => {
        handleRetweetAnimation();
        await handlerRetweet({ dispatchRetweet, ACTIONS, postId, user: state.user._id, state, setComment });
    };

    useEffect(() => {
        retweets.forEach((item) => {
            if (item._id === state.user._id) {
                setIsRetweet(true);
            }
        });
    }, []);
    return (
        <>
            <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-green-100 group-hover:text-green-500" onClick={retweetHandler}>
                {isRetweet ? <RetweetsGreen /> : <Retweets />}
            </button>
            <span className={`${isRetweet && "text-green-500"} group-hover:text-green-500 ${animationRetweet}`}>{retweetValue > 0 ? retweetValue : null}</span>
        </>
    );
};

export default Retweet;
