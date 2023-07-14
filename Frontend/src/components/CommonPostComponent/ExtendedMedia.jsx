import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Cross, LeftArrow, RightArrow } from "../SVGs/SVGs";

const ExtendedMedia = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { photos, postId, url, photo } = location.state;

    const navigateHandler = () => {
        if (url === "/") {
            navigate("/", { state: { sectionId: postId } });
        } else {
            navigate(-1);
        }
    };

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        photos.map((item, index) => {
            if (photo === item.url) {
                setCurrentImageIndex(index);
            }
        });
    }, []);
    const nextImage = () => {
        setCurrentImageIndex((prev) => prev + 1);
    };
    const prevImage = () => {
        setCurrentImageIndex((prev) => prev - 1);
    };

    return (
        <div className="fixed inset-0  z-50 h-[100vh] w-[100vw] ">
            <div className="absolute h-screen w-screen bg-black "></div>
            <div className="relative m-6 flex gap-8">
                <div className="flex flex-col">
                    <div className="h-fit cursor-pointer  text-white hover:text-red-500" onClick={navigateHandler}>
                        <Cross />
                    </div>

                    <div className={`flex h-screen w-fit flex-col items-center justify-center`}>
                        <div
                            className=" mt-[-250%] cursor-pointer  rounded-full p-2 text-white hover:bg-white hover:text-black "
                            onClick={prevImage}
                            style={{ visibility: photos.length > 1 && photos[currentImageIndex].url !== photos[0].url ? "visible" : "hidden" }}>
                            <LeftArrow />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="h-[96vh] w-[86.5vw] ">
                        <img src={photos[currentImageIndex] && photos[currentImageIndex].url ? photos[currentImageIndex].url : photos[currentImageIndex]} alt="Extended Photo" className="h-full w-full select-none object-contain" />
                    </div>
                </div>

                <div className="  flex h-screen w-fit flex-col items-center justify-center ">
                    <div
                        style={{ visibility: photos.length > 1 && photos[currentImageIndex].url !== photos[photos.length - 1].url ? "visible" : "hidden" }}
                        className=" mt-[-100%] cursor-pointer  rounded-full p-2 text-white hover:bg-white hover:text-black "
                        onClick={nextImage}>
                        <RightArrow />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExtendedMedia;
