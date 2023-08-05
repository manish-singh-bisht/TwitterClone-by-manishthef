import React, { Suspense, useEffect, useId, useState } from "react";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, LeftArrow, LinkInProfile, LocationInProfile } from "../SVGs/SVGs";
import { BannerImage, ProfileImage } from "./ProfileBanner";
import Loader from "../Loader/Loader";
import axios from "axios";

const UpdateModal = React.lazy(() => import("../Modal/UpdateModal"));

const ProfilePage = () => {
    const { state, setUsersForRightSidebar } = useGlobalContext();
    const [visibility, setVisibility] = useState(false);
    const [activeButton, setActiveButton] = useState("Tweets");
    const [user, setUser] = useState(null);
    const [total, setTotal] = useState(null);

    const navigate = useNavigate();
    const params = useParams();
    const userId = params.id;

    const handleClick = () => {
        navigate(-1);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setUsersForRightSidebar(null);

        const getProfileUser = async (id) => {
            const { data } = await axios.get(`http://localhost:4000/api/v1/user/${id}`, { withCredentials: true });
            setUser(data.userProfile);
            setTotal(data.total);
        };
        if (state.user._id === userId) {
            setUser(state.user);
            setTotal(state.total);
        } else {
            getProfileUser(userId);
        }
    }, [window.location.pathname]);

    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
            setVisibility(false);
            document.body.style.overflow = "unset";
        }
    };
    const onClose = () => {
        setVisibility(false);
        document.body.style.overflow = "unset";
    };

    return (
        <>
            {!user ? (
                <Loader />
            ) : (
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
                                    <div className="text-[1.6rem] font-bold">{user.name}</div>
                                    <div className="text-[0.9rem] text-gray-500">{total > 1 ? `${total} Tweets` : `${total}Tweet`}</div>
                                </div>
                            </div>
                            <div className="mt-2 h-[13rem]">
                                <BannerImage banner={user.profile && user.profile.banner && user.profile.banner.url ? user.profile.banner.url : null} />
                            </div>
                            <div className="relative flex   h-[6.5rem] w-full justify-end   ">
                                <ProfileImage profile={user.profile && user.profile.image && user.profile.image.url ? user.profile.image.url : null} />
                                {state.user._id === userId ? (
                                    <button
                                        className="mr-[0.5rem] mt-[0.6rem] h-fit w-fit rounded-3xl border-2 py-1 px-4 font-semibold hover:bg-gray-200 active:bg-gray-300"
                                        onClick={() => {
                                            document.body.style.overflow = "hidden";
                                            setVisibility(true);
                                        }}>
                                        Edit profile
                                    </button>
                                ) : null}
                            </div>
                            <div className="ml-4 flex flex-col gap-2 ">
                                <div className=" mb-2 flex flex-col">
                                    <div className="text-2xl font-bold">{user.name}</div>
                                    <div className="text-gray-500">@{user.handle}</div>
                                </div>
                                <div className="flex max-w-[100%] flex-wrap">{user.description}</div>
                                <div className="flex flex-wrap gap-2">
                                    {user.location && (
                                        <span className="flex items-center gap-1">
                                            <LocationInProfile />
                                            {user.location}
                                        </span>
                                    )}
                                    {user.website && (
                                        <span className="flex cursor-pointer items-center gap-1 break-all leading-5 text-blue-500 hover:underline">
                                            <LinkInProfile />
                                            <a href={user.website} target="_blank">
                                                {user.website}
                                            </a>
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Calendar />
                                        {(() => {
                                            const dateTimeString = user.createdAt;
                                            const date = new Date(dateTimeString);
                                            const month = date.toLocaleString("default", { month: "long" });
                                            const year = date.getFullYear();
                                            const formattedDate = `${month} ${year}`;
                                            return `Joined ${formattedDate}`;
                                        })()}
                                    </span>
                                </div>
                                <div className=" flex gap-6">
                                    <span className="cursor-pointer text-gray-600 hover:underline">
                                        <span className="font-bold text-black">{user.following.length}</span> Following
                                    </span>
                                    <span className="cursor-pointer text-gray-600 hover:underline">
                                        <span className="font-bold text-black">{user.followers.length}</span> Followers
                                    </span>
                                </div>
                            </div>
                            <div className="mt-5 flex h-fit w-full items-center ">
                                <button
                                    className={`w-fit px-12 py-4 text-[1.05rem] font-semibold hover:bg-gray-200 ${activeButton !== "Tweets" ? "text-gray-600" : "text-black"}`}
                                    onClick={() => {
                                        setActiveButton("Tweets");
                                    }}>
                                    Tweets
                                    {activeButton === "Tweets" && <div className="  mt-[0.5rem] w-[3.4rem] rounded-3xl border-[0.15rem] border-blue-500  "></div>}
                                </button>
                                <button
                                    className={`w-fit px-12 py-4 text-[1.05rem] font-semibold hover:bg-gray-200 ${activeButton !== "Replies" ? "text-gray-600" : "text-black"}`}
                                    onClick={() => {
                                        setActiveButton("Replies");
                                    }}>
                                    Replies{activeButton === "Replies" && <div className="  mt-[0.5rem] w-[3.4rem] rounded-3xl border-[0.15rem] border-blue-500  "></div>}
                                </button>
                                <button
                                    className={`w-fit px-12 py-4 text-[1.05rem] font-semibold hover:bg-gray-200 ${activeButton !== "Media" ? "text-gray-600" : "text-black"}`}
                                    onClick={() => {
                                        setActiveButton("Media");
                                    }}>
                                    Media{activeButton === "Media" && <div className="  mt-[0.5rem] w-[3.4rem] rounded-3xl border-[0.15rem] border-blue-500  "></div>}
                                </button>
                                <button
                                    className={`w-fit px-12 py-4 text-[1.05rem] font-semibold hover:bg-gray-200 ${activeButton !== "Likes" ? "text-gray-600" : "text-black"}`}
                                    onClick={() => {
                                        setActiveButton("Likes");
                                    }}>
                                    Likes{activeButton === "Likes" && <div className="  mt-[0.5rem] w-[3.4rem] rounded-3xl border-[0.15rem] border-blue-500  "></div>}
                                </button>
                            </div>
                        </div>
                    </main>
                    <Suspense fallback={<Loader />}>
                        <UpdateModal
                            visibility={visibility}
                            onClose={onClose}
                            handleOutsideClick={handleOutsideClick}
                            profile={user.profile && user.profile.image && user.profile.image.url ? user.profile.image.url : null}
                            banner={user.profile && user.profile.banner && user.profile.banner.url ? user.profile.banner.url : null}
                            name={user.name}
                            bio={user.description !== undefined ? user.description : null}
                            website={user.website !== undefined ? user.website : null}
                            location={user.location !== undefined ? user.location : null}
                            setUser={setUser}
                        />
                    </Suspense>
                </>
            )}
        </>
    );
};

export default ProfilePage;
