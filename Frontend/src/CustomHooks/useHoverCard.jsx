import { useState, useEffect } from "react";

const useHoverCard = (delay = 900) => {
    const [isHovered, setIsHovered] = useState(false);
    let hoverTimer;

    const handleMouseEnter = () => {
        hoverTimer = setTimeout(() => {
            setIsHovered(true);
        }, delay);
    };

    const handleMouseLeave = () => {
        clearTimeout(hoverTimer);
        setIsHovered(false);
    };

    useEffect(() => {
        return () => {
            clearTimeout(hoverTimer);
        };
    }, []);

    return {
        isHovered,
        handleMouseEnter,
        handleMouseLeave,
    };
};

export default useHoverCard;
