import React, { Suspense, useState } from "react";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import { useNavigate } from "react-router-dom";
import { Calendar, LeftArrow, LinkInProfile, LocationInProfile } from "../SVGs/SVGs";
import { BannerImage, ProfileImage } from "./ProfileBanner";

const ProfilePage = () => {
    const { state } = useGlobalContext();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/");
    };

    return (
        <>
            <main className="grid grid-cols-[44vw_auto]   ">
                <div className="flex h-[100%] min-h-screen flex-col  border-l  border-r">
                    <div className=" sticky inset-0 z-10 flex h-[3.5rem] items-center gap-7 bg-white/60 backdrop-blur-md ">
                        <div onClick={handleClick}>
                            <div className="m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:border-2 hover:bg-gray-200 active:bg-gray-300">
                                <LeftArrow className="h-[65%] w-[65%] " />
                            </div>
                        </div>
                        <div
                            className="flex flex-col
                        ">
                            <div className="text-[1.6rem] font-bold">{state.user.name}</div>
                            <div className="text-[0.9rem] text-gray-500">
                                {state.user.posts?.length + state.user.comments?.length > 1 ? `${state.user.posts?.length + state.user.comments?.length}Tweets` : `${state.user.posts?.length + state.user.comments?.length}Tweet`}
                            </div>
                        </div>
                    </div>
                    <BannerImage banner={"https://source.unsplash.com/random/1200x600"} />
                    <div className="relative flex   h-[6.5rem] w-full justify-end   ">
                        <ProfileImage profile={"https://source.unsplash.com/random/1200x600"} />
                        <button className="mr-[0.5rem] mt-[0.6rem] h-fit w-fit rounded-3xl border-2 py-1 px-4 font-semibold hover:bg-gray-200 active:bg-gray-300">Edit profile</button>
                    </div>
                    <div className="ml-4 flex flex-col gap-2 ">
                        <div className=" mb-2 flex flex-col">
                            <div className="text-2xl font-bold">{state.user.name}</div>
                            <div className="text-gray-500">@{state.user.handle}</div>
                        </div>
                        <div className="flex max-w-[100%] flex-wrap">Full Stack Web Developer(MERN), Hacktoberfest 2022,blog:manishsinghbisht.hashnode.devml-4ml-4ml-4ml-4ml-4ml-4ml-4ml-4ml-4ml-4ml-4ml-4ml-4ml-4ml-4ml-4ml-4ml-4ml-</div>
                        <div className="flex flex-wrap gap-3">
                            <span className="flex items-center gap-1">
                                <LocationInProfile />
                                sdj
                            </span>
                            <span className="flex cursor-pointer items-center gap-1 text-blue-500 hover:underline">
                                <LinkInProfile />
                                jsdksd
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar />
                                joined date
                            </span>
                        </div>
                        <div className="mt-2 flex gap-6">
                            <span className="cursor-pointer text-gray-600 hover:underline">Following</span>
                            <span className="cursor-pointer text-gray-600 hover:underline">Followers</span>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ProfilePage;
