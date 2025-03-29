import React, { useEffect, useState } from "react";

const Avatar = ({ profile }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setImageLoaded(true);
        };
        img.src = [profile];
    }, [profile]);

    return (
        <>
            {profile ? (
                imageLoaded ? (
                    <div className="relative z-[5] m-1 h-[2.8rem] w-[2.8rem] items-center justify-center rounded-full bg-gray-400 md:h-[3.2rem]   md:w-[3.2rem]">
                        <img src={profile} alt="profile image" loading="lazy" className="h-full w-full rounded-full object-cover" />
                    </div>
                ) : (
                    <>
                        <div className="relative z-[5] h-[2.8rem] w-[2.8rem] overflow-hidden rounded-full  md:h-[3.2rem] md:w-[3.2rem]">
                            <div className={` h-[3.2rem] w-[3.2rem] rounded-full  bg-[#f8f8f8]`}></div>
                            <div className="blurhash-shimmer"></div>
                        </div>
                    </>
                )
            ) : (
                <div className="relative z-[5] m-1 flex h-[2.8rem] w-[2.8rem] items-center justify-center rounded-full bg-gray-200  md:h-[3.2rem] md:w-[3.2rem]">
                    <svg className="  h-9 w-9 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                </div>
            )}
        </>
    );
};

export default Avatar;
