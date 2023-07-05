import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Cross } from "../SVGs/SVGs";

const PhotoGallery = ({ photos, photo, index, deleteImages, mark }) => {
    const [imageHeight, setImageHeight] = useState(0);
    const crossHandler = (e, photo) => {
        e.stopPropagation();
        deleteImages(photo);
    };

    const imageHeightChecker = (e) => {
        const height = e.target.naturalHeight;
        setImageHeight(height);
    };

    if (photos.length > 1) {
        if (index === 0) {
            return (
                <div className={`relative ${photos.length === 3 ? `row-span-2` : `row-span-1 `} col-span-1`}>
                    {mark && (
                        <>
                            <button className="absolute m-1 rounded-full bg-black text-white" onClick={(e) => crossHandler(e, photo)}>
                                <Cross />
                            </button>
                            <img
                                src={photo}
                                alt="first image"
                                loading="lazy"
                                className={`${photos.length === 3 || photos.length === 2 ? `h-full w-full rounded-l-xl object-cover` : `${photos.length === 4 ? `h-full w-full rounded-tl-xl object-cover` : `h-full w-full object-cover`}`}`}
                            />
                        </>
                    )}
                    {!mark && (
                        <Link
                            to={"/test"}
                            className=" "
                            onClick={(e) => {
                                e.stopPropagation();
                            }}>
                            <img
                                src={photo}
                                alt="first image"
                                loading="lazy"
                                className={`${photos.length === 3 || photos.length === 2 ? `h-full w-full rounded-l-xl object-cover` : `${photos.length === 4 ? `h-full w-full rounded-tl-xl object-cover` : `h-full w-full object-cover`}`}`}
                            />
                        </Link>
                    )}
                </div>
            );
        } else if (index === 1) {
            return (
                <div className="relative">
                    {mark && (
                        <>
                            <button className="absolute m-1 rounded-full bg-black text-white" onClick={(e) => crossHandler(e, photo)}>
                                <Cross />
                            </button>
                            <img
                                src={photo}
                                alt="second image"
                                loading="lazy"
                                className={`${photos.length >= 3 ? `h-full w-full rounded-tr-xl object-cover` : `${photos.length === 2 ? `h-full w-full rounded-r-xl object-cover` : `h-full w-full object-cover`}`}`}
                            />
                        </>
                    )}
                    {!mark && (
                        <Link
                            to={"/test"}
                            className=" "
                            onClick={(e) => {
                                e.stopPropagation();
                            }}>
                            <img
                                src={photo}
                                alt="second image"
                                loading="lazy"
                                className={`${photos.length >= 3 ? `h-full w-full rounded-tr-xl object-cover` : `${photos.length === 2 ? `h-full w-full rounded-r-xl object-cover` : `h-full w-full object-cover`}`}`}
                            />
                        </Link>
                    )}
                </div>
            );
        } else if (index === 2) {
            return (
                <div className="relative">
                    {mark && (
                        <>
                            <button className="absolute m-1 rounded-full bg-black text-white" onClick={(e) => crossHandler(e, photo)}>
                                <Cross />
                            </button>
                            <img
                                src={photo}
                                alt="third image"
                                loading="lazy"
                                className={`${photos.length === 3 ? `h-full w-full rounded-br-xl object-cover` : `${photos.length === 4 ? `h-full w-full rounded-bl-xl object-cover` : `h-full w-full object-cover`}`}`}
                            />
                        </>
                    )}
                    {!mark && (
                        <Link
                            to={"/test"}
                            className=" "
                            onClick={(e) => {
                                e.stopPropagation();
                            }}>
                            <img
                                src={photo}
                                alt="third image"
                                loading="lazy"
                                className={`${photos.length === 3 ? `h-full w-full rounded-br-xl object-cover` : `${photos.length === 4 ? `h-full w-full rounded-bl-xl object-cover` : `h-full w-full object-cover`}`}`}
                            />
                        </Link>
                    )}
                </div>
            );
        } else {
            return (
                <div className="relative">
                    {mark && (
                        <>
                            <button className="absolute m-1 rounded-full bg-black text-white" onClick={(e) => crossHandler(e, photo)}>
                                <Cross />
                            </button>

                            <img src={photo} loading="lazy" alt="fourth image" className={`${photos.length === 4 ? `h-full w-full rounded-br-xl object-cover` : `h-full w-full object-cover`}`} />
                        </>
                    )}
                    {!mark && (
                        <Link
                            to={"/test"}
                            className=" "
                            onClick={(e) => {
                                e.stopPropagation();
                            }}>
                            <img src={photo} loading="lazy" alt="fourth image" className={`${photos.length === 4 ? `h-full w-full rounded-br-xl object-cover` : `h-full w-full object-cover`}`} />
                        </Link>
                    )}
                </div>
            );
        }
    } else {
        return (
            <div className={`relative ${imageHeight > 30 * 16 ? "h-[30rem]" : "h-fit"}`}>
                {mark && (
                    <>
                        <button className="absolute m-1 rounded-full bg-black text-white" onClick={(e) => crossHandler(e, photo)}>
                            <Cross />
                        </button>
                        <img src={photo} loading="lazy" alt="first image ,if only one photo" className={`h-full  w-full rounded-xl ${imageHeight > 30 * 16 ? "object-cover object-center" : "object-fill"}`} onLoad={(e) => imageHeightChecker(e)} />
                    </>
                )}
                {!mark && (
                    <Link
                        to={"/test"}
                        className=" "
                        onClick={(e) => {
                            e.stopPropagation();
                        }}>
                        <img src={photo} loading="lazy" alt="first image ,if only one photo" className={`h-full  w-full rounded-xl ${imageHeight > 30 * 16 ? "object-cover object-center" : "object-fill"}`} onLoad={(e) => imageHeightChecker(e)} />
                    </Link>
                )}
            </div>
        );
    }
};

export default PhotoGallery;
