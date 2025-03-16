import React, { useState } from "react";
import { Emoji, Gif, Location, Photo, Poll, Schedule } from "../SVGs/SVGs";

export const MediaUploadPanelLong = ({ setSelectedImages, selectedImages, fromTweetModal }) => {
    const handleChange = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();
        Reader.readAsDataURL(file);
        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setSelectedImages((previousImages) => previousImages.concat(Reader.result));
            }
        };
    };
    return (
        <>
            <div className=" flex w-fit gap-0 md:ml-0 ">
                {fromTweetModal ? (
                    <button className="cursor-not-allowed rounded-full hover:bg-blue-100 active:bg-blue-300 disabled:opacity-50 md:p-2" disabled>
                        <Photo />
                    </button>
                ) : (
                    <>
                        <label htmlFor="file-input" className={` rounded-full p-2 hover:bg-blue-100 active:bg-blue-300 ${selectedImages.length >= 4 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`} disabled={selectedImages.length >= 4}>
                            <Photo />
                        </label>
                        {selectedImages.length < 4 && (
                            <input
                                id="file-input"
                                type="file"
                                accept="image/png , image/jpeg"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    handleChange(e);
                                }}
                            />
                        )}
                    </>
                )}

                <button className=" cursor-not-allowed rounded-full hover:bg-blue-100 active:bg-blue-300 disabled:opacity-50 md:p-2 " disabled>
                    <Gif />
                </button>
                <button className=" cursor-not-allowed rounded-full hover:bg-blue-100 active:bg-blue-300 disabled:opacity-50 md:p-2 " disabled>
                    <Poll />
                </button>
                <button className=" cursor-not-allowed rounded-full hover:bg-blue-100 active:bg-blue-300 disabled:opacity-50 md:p-2 " disabled>
                    <Emoji />
                </button>
                <button className=" cursor-not-allowed rounded-full hover:bg-blue-100 active:bg-blue-300 disabled:opacity-50 md:p-2 " disabled>
                    <Schedule />
                </button>
                <button className=" cursor-not-allowed rounded-full hover:bg-blue-100 active:bg-blue-300 disabled:opacity-50 md:p-2 " disabled>
                    <Location />
                </button>
            </div>
        </>
    );
};
