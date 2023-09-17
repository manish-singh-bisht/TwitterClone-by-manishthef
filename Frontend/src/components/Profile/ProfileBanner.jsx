import React, { Suspense, useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { ChangeProfileImage, Cross } from "../SVGs/SVGs";
const ExpandedImage = React.lazy(() => import("./ExpandedImage"));

export const ProfileImage = ({ profile, changeImage, handleChangeImage }) => {
    const [visibility, setVisibility] = useState(false);
    const [modalData, setModalData] = useState({ imageUrl: null, type: null });
    const [imageLoaded, setImageLoaded] = useState(false);
    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setImageLoaded(true);
        };
        img.src = [profile];
    }, [profile]);

    const openModal = ({ imageUrl, type }) => {
        setModalData({ imageUrl, type });
        setVisibility(true);
        document.body.style.overflow = "hidden";
    };
    const oncloseHandler = () => {
        setVisibility(false);
        document.body.style.overflow = "unset";
    };

    const handleChange = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();
        Reader.readAsDataURL(file);
        Reader.onload = () => {
            if (Reader.readyState === 2) {
                handleChangeImage(Reader.result, "image");
            }
        };
    };
    return (
        <>
            <div
                className="absolute left-2 bottom-0 h-[9.5rem] w-[9.5rem] rounded-full   bg-white"
                onClick={() => {
                    if (profile && !changeImage) {
                        openModal({ imageUrl: profile, type: "profile" });
                    }
                }}>
                {changeImage && (
                    <>
                        <label htmlFor="changeImage">
                            <div className="absolute top-1/2 left-1/2 z-10 w-fit -translate-y-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-black p-2">
                                <ChangeProfileImage />
                            </div>
                        </label>
                        <input
                            id="changeImage"
                            type="file"
                            accept="image/png , image/jpeg"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                handleChange(e);
                            }}
                        />
                    </>
                )}
                {profile ? (
                    imageLoaded ? (
                        <img src={profile} alt="profile" loading="lazy" className={`relative mx-auto mt-[0.25rem]  h-[8.8rem] w-[8.8rem] object-cover ${!changeImage ? "cursor-pointer" : null} rounded-full`} />
                    ) : (
                        <>
                            <div className="relative mx-auto mt-[0.25rem] h-[8.8rem] w-[8.8rem]  overflow-hidden rounded-full object-cover">
                                <div className={` h-[8.8rem] w-[8.8rem] bg-[#f8f8f8]`}></div>
                                <div className="blurhash-shimmer"></div>
                            </div>
                        </>
                    )
                ) : (
                    <div className="relative mx-auto mt-[0.25rem]   flex h-[8.8rem] w-[8.8rem] items-center justify-center  rounded-full bg-gray-200">
                        <svg className="  h-28 w-28 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                )}
            </div>
            <Suspense fallback={<Loader />}>
                <ExpandedImage visibility={visibility} onclose={oncloseHandler} modalData={modalData} />
            </Suspense>
        </>
    );
};

export const BannerImage = ({ banner, changeBanner, handleChangeImage }) => {
    const [visibility, setVisibility] = useState(false);
    const [modalData, setModalData] = useState({ imageUrl: null, type: null });
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setImageLoaded(true);
        };
        img.src = [banner];
    }, [banner]);

    const openModal = ({ imageUrl, type }) => {
        setModalData({ imageUrl, type });
        setVisibility(true);
        document.body.style.overflow = "hidden";
    };
    const oncloseHandler = () => {
        setVisibility(false);
        document.body.style.overflow = "unset";
    };

    const handleChange = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();
        Reader.readAsDataURL(file);
        Reader.onload = () => {
            if (Reader.readyState === 2) {
                handleChangeImage(Reader.result, "banner");
            }
        };
    };
    return (
        <>
            <div
                className="relative h-[13rem] max-h-[13rem] "
                onClick={() => {
                    if (banner && !changeBanner) {
                        openModal({ imageUrl: banner, type: "banner" });
                    }
                }}>
                {changeBanner && (
                    <>
                        <label htmlFor="changeBanner">
                            <div className="absolute top-1/2 left-[45%] z-10 w-fit -translate-y-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-black p-2">
                                <ChangeProfileImage />
                            </div>
                        </label>
                        <input
                            id="changeBanner"
                            type="file"
                            accept="image/png , image/jpeg"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                handleChange(e);
                            }}
                        />
                        <div
                            className="absolute top-[50%] left-[60%] z-10 w-fit -translate-y-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-black p-2 text-white md:left-[55%]"
                            onClick={() => {
                                handleChangeImage(null, "banner");
                            }}>
                            <Cross />
                        </div>
                    </>
                )}
                {banner ? (
                    imageLoaded ? (
                        <img src={banner} alt="banner" loading="lazy" className={`max-h-[100%] min-w-full ${!changeBanner ? "cursor-pointer" : null} object-cover`} />
                    ) : (
                        <>
                            <div className="relative h-full overflow-hidden ">
                                <div className={`  bg-[#f8f8f8]`}></div>
                                <div className="blurhash-shimmer"></div>
                            </div>
                        </>
                    )
                ) : (
                    <div className="min-h-[13rem]  min-w-[100%] bg-gray-200"></div>
                )}
            </div>
            <Suspense fallback={<Loader />}>
                <ExpandedImage visibility={visibility} onclose={oncloseHandler} modalData={modalData} />
            </Suspense>
        </>
    );
};
