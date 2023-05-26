import React, { useState, Suspense, memo } from "react";
import { NavLink, Link } from "react-router-dom";
import SidebarList from "./SidebarList";
import Loader from "../pages/Loader";
import { BellFilled, BellOutline, BookmarkFilled, BookmarkOutline, HashtagFilled, HashtagOutline, HomeFilled, HomeOutLine, MessageFilled, MessageOutline, MoreFilled, MoreOutline, ProfileFilled, ProfileOutline, TwitterIcon } from "../SVGs/SVGs";

const TweetModal = React.lazy(() => import("../Modal/TweetModal"));

const Sidebar = () => {
    const [tab, setTab] = useState(window.location.pathname);
    const [isTweetBoxOpen, setIsTweetBoxOpen] = useState(false);
    const hideTwitterBox = () => {
        setIsTweetBoxOpen(false);
        document.body.style.overflow = "unset"; //makes the back of modal move again i.e set overflow to normal
    };
    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
            setIsTweetBoxOpen(false);
            document.body.style.overflow = "unset";
        }
    };

    return (
        <main className="fixed z-20 flex h-[100vh] w-[24rem] flex-col items-end justify-between    ">
            <div className=" flex w-3/4 select-none flex-col  gap-1 ">
                <NavLink to="/" className={({ isActive }) => (isActive ? "w-fit " : " w-fit ")} onClick={() => setTab("/")}>
                    <TwitterIcon className="" />
                </NavLink>

                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : " w-fit  font-normal")} to="/" onClick={() => setTab("/")}>
                    {tab === "/" ? <SidebarList Icon={HomeFilled} Option="Home" /> : <SidebarList Icon={HomeOutLine} Option="Home" />}
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to="/Explore" onClick={() => setTab("/Explore")}>
                    {tab === "/Explore" ? <SidebarList Icon={HashtagFilled} Option="Explore" /> : <SidebarList Icon={HashtagOutline} Option="Explore" />}
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to="/Notifications" onClick={() => setTab("/Notifications")}>
                    {tab === "/Notifications" ? <SidebarList Icon={BellFilled} Option="Notifications" /> : <SidebarList Icon={BellOutline} Option="Notifications" />}
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to="/Messages" onClick={() => setTab("/Messages")}>
                    {tab === "/Messages" ? <SidebarList Icon={MessageFilled} Option="Messages" /> : <SidebarList Icon={MessageOutline} Option="Messages" />}
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to="/Bookmark" onClick={() => setTab("/Bookmark")}>
                    {tab === "/Bookmark" ? <SidebarList Icon={BookmarkFilled} Option="Bookmark" /> : <SidebarList Icon={BookmarkOutline} Option="Bookmark" />}
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to="/Profile" onClick={() => setTab("/Profile")}>
                    {tab === "/Profile" ? <SidebarList Icon={ProfileFilled} Option="Profile" /> : <SidebarList Icon={ProfileOutline} Option="Profile" />}
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to="/More" onClick={() => setTab("/More")}>
                    {tab === "/More" ? <SidebarList Icon={MoreFilled} Option="More" /> : <SidebarList Icon={MoreOutline} Option="More" />}
                </NavLink>
                <div
                    className="flex h-12 w-64 items-center justify-center rounded-3xl bg-blue-500 text-[1.2rem] font-bold text-white hover:bg-blue-600 active:bg-blue-800 "
                    onClick={() => {
                        setIsTweetBoxOpen(true);
                        document.body.style.overflow = "hidden"; //makes the back of modal not move  i.e set overflow to hidden
                    }}>
                    Tweet
                </div>
            </div>
            <div className=" my-8 mx-10 flex   h-12 w-60 items-center rounded-[24rem]  hover:bg-gray-200">
                <span>image</span>
                <div className="">
                    <div>fd</div>
                    <div>fd</div>
                </div>
            </div>
            <Suspense fallback={<Loader />}>
                <TweetModal visibility={isTweetBoxOpen} onClose={hideTwitterBox} handleOutsideClick={handleOutsideClick} initialTweetFromOtherPartsOfApp={null} />
            </Suspense>
        </main>
    );
};

export default memo(Sidebar);
