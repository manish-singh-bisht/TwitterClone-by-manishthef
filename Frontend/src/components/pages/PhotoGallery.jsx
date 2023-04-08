import React from "react";
import { Link } from "react-router-dom";

const PhotoGallery = ({ photos, photo, index }) => {
    if (photos.length > 1) {
        if (index === 0) {
            return (
                <div className={`${photos.length === 3 ? `row-span-2` : `row-span-1 `} col-span-1`}>
                    <Link
                        to={"/test"}
                        className=" "
                        onClick={(e) => {
                            e.stopPropagation();
                        }}>
                        <img
                            src={photo}
                            alt=""
                            className={`${photos.length === 3 || photos.length === 2 ? `h-full w-full rounded-l-xl object-cover` : `${photos.length === 4 ? `h-full w-full rounded-tl-xl object-cover` : `h-full w-full object-cover`}`}`}
                        />
                    </Link>
                </div>
            );
        } else if (index === 1) {
            return (
                <div className="col-span-1 row-span-1 ">
                    <Link
                        to={"/test"}
                        className=" "
                        onClick={(e) => {
                            e.stopPropagation();
                        }}>
                        <img src={photo} alt="" className={`${photos.length >= 3 ? `h-full w-full rounded-tr-xl object-cover` : `${photos.length === 2 ? `h-full w-full rounded-r-xl object-cover` : `h-full w-full object-cover`}`}`} />
                    </Link>
                </div>
            );
        } else if (index === 2) {
            return (
                <div className="col-span-1 row-span-1">
                    <Link
                        to={"/test"}
                        className=" "
                        onClick={(e) => {
                            e.stopPropagation();
                        }}>
                        <img src={photo} alt="" className={`${photos.length === 3 ? `h-full w-full rounded-br-xl object-cover` : `${photos.length === 4 ? `h-full w-full rounded-bl-xl object-cover` : `h-full w-full object-cover`}`}`} />
                    </Link>
                </div>
            );
        } else {
            return (
                <div className="col-span-1 row-span-1">
                    <Link
                        to={"/test"}
                        className=" "
                        onClick={(e) => {
                            e.stopPropagation();
                        }}>
                        <img src={photo} alt="" className={`${photos.length === 4 ? `h-full w-full rounded-br-xl object-cover` : `h-full w-full object-cover`}`} />
                    </Link>
                </div>
            );
        }
    } else {
        return (
            <div className="h-[30rem] ">
                <Link
                    to={"/test"}
                    className=" "
                    onClick={(e) => {
                        e.stopPropagation();
                    }}>
                    <img src={photo} alt="" className="h-full  w-full rounded-xl object-fill " />
                </Link>
            </div>
        );
    }
};

export default PhotoGallery;
