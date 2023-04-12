import React, { useEffect, useState } from "react";

export default function useAnimation(isType, setIsType, type, setType) {
    const [animationLikes, setAnimationLikes] = useState("initial");
    const handleLikesAnimation = () => {
        setIsType(!isType);
        {
            isType ? setTimeout(() => setAnimationLikes("goDown"), 0) : setTimeout(() => setAnimationLikes("goUp"), 0);
        }

        setTimeout(() => setType(isType ? type - 1 : type + 1), 200);
        {
            isType ? setTimeout(() => setAnimationLikes("waitUp"), 100) : setTimeout(() => setAnimationLikes("waitDown"), 100);
        }
        setTimeout(() => setAnimationLikes("initial"), 200);
    };

    return [animationLikes, type, handleLikesAnimation];
}
