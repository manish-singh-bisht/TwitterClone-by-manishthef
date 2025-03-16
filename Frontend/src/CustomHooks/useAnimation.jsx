import React, { useEffect, useState } from "react";

export default function useAnimation(isType, setIsType, type, setType) {
    const [animation, setAnimation] = useState("initial");
    const handleAnimation = () => {
        setIsType(!isType);
        {
            isType ? setTimeout(() => setAnimation("goDown"), 0) : setTimeout(() => setAnimation("goUp"), 0);
        }

        setTimeout(() => setType(isType ? type - 1 : type + 1), 200);
        {
            isType ? setTimeout(() => setAnimation("waitUp"), 100) : setTimeout(() => setAnimation("waitDown"), 100);
        }
        setTimeout(() => setAnimation("initial"), 200);
    };

    return [animation, type, handleAnimation];
}
//For example: isType=isLiked, setIsType=setIsLiked , type=liked, setType=setLiked
//Returning 1. animation =which set classes which are set in the AnimationUsedInPostAndTweetDetail.css file
//          2. type =it is the value of the number be it number of likes , number of retweets etc
//          3. handleAnimation=it is the function itself which runs on click.
