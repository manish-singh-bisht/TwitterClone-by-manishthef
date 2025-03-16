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
        document.body.style.overflow = "hidden";
        photos.map((item, index) => {
            if (photo === item.url || photo === item) {
                setCurrentImageIndex(index);
            }
        });

        return () => {
            document.body.style.overflow = "unset";
        };
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
            <div className="relative m-6 flex flex-col md:flex-row xl:gap-8">
                <div className="flex flex-col">
                    <div className="h-fit cursor-pointer  text-white hover:text-red-500" onClick={navigateHandler}>
                        <Cross />
                    </div>

                    <div className={` hidden h-screen w-fit flex-col items-center justify-center md:flex`}>
                        <div
                            className=" mt-[-250%] cursor-pointer  rounded-full p-2 text-white hover:bg-white hover:text-black "
                            onClick={prevImage}
                            style={{ visibility: photos.length > 1 && (photos[currentImageIndex].url !== photos[0].url || photos[currentImageIndex] !== photos[0]) ? "visible" : "hidden" }}>
                            <LeftArrow />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="relative  h-[96vh]  w-[86.5vw] ">
                        <img src={photos[currentImageIndex] && photos[currentImageIndex].url ? photos[currentImageIndex].url : photos[currentImageIndex]} alt="Extended Photo" className="h-full w-full select-none object-contain" />

                        <div className="absolute  bottom-10 flex w-full items-center justify-center md:hidden ">
                            <div className={` `}>
                                <div
                                    className=" cursor-pointer rounded-full  p-2 text-red-500 hover:bg-white hover:text-black md:mt-[-250%] "
                                    onClick={prevImage}
                                    style={{ visibility: photos.length > 1 && (photos[currentImageIndex].url !== photos[0].url || photos[currentImageIndex] !== photos[0]) ? "visible" : "hidden" }}>
                                    <LeftArrow />
                                </div>
                            </div>
                            <div className="  ">
                                <div
                                    style={{ visibility: photos.length > 1 && (photos[currentImageIndex].url !== photos[photos.length - 1].url || photos[currentImageIndex] !== photos[photos.length - 1]) ? "visible" : "hidden" }}
                                    className=" cursor-pointer rounded-full  p-2 text-red-500 hover:bg-white hover:text-black md:mt-[-100%] "
                                    onClick={nextImage}>
                                    <RightArrow />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden  h-screen w-fit flex-col items-center justify-center md:flex ">
                    <div
                        style={{ visibility: photos.length > 1 && (photos[currentImageIndex].url !== photos[photos.length - 1].url || photos[currentImageIndex] !== photos[photos.length - 1]) ? "visible" : "hidden" }}
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
