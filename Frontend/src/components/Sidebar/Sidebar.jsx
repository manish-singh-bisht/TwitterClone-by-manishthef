import React, { useState } from "react";
import { FaBookmark, FaRegBookmark, FaTwitter } from "react-icons/fa";
import { AiFillHome, AiOutlineHome, AiFillBell, AiOutlineBell } from "react-icons/ai";
import { HiMail, HiOutlineMail, HiOutlineDotsCircleHorizontal, HiDotsCircleHorizontal, HiOutlineHashtag, HiHashtag } from "react-icons/hi";
import { RiAccountCircleLine, RiAccountCircleFill } from "react-icons/ri";
import { NavLink, Link } from "react-router-dom";
import SidebarList from "./SidebarList";
import Tweet from "../pages/Tweet";

const Sidebar = () => {
    const [tab, setTab] = useState(window.location.pathname);
    const [isTweetBoxOpen, setIsTweetBoxOpen] = useState(false);
    const hideTwitterBox = () => {
        setIsTweetBoxOpen(false);
    };

    return (
        <main className="fixed z-20 flex h-[100vh] w-[24rem] flex-col items-end justify-between    ">
            <div className=" flex w-3/4 select-none flex-col  gap-1 ">
                <NavLink to="/" onClick={() => setTab("/")}>
                    <FaTwitter className="m-1 h-[3.2rem] w-[3.2rem]  rounded-full p-2 text-5xl text-blue-500 hover:bg-blue-100" />
                </NavLink>

                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : " w-fit  font-normal")} to="/" onClick={() => setTab("/")}>
                    {tab === "/" ? <SidebarList Icon={AiFillHome} Option="Home" /> : <SidebarList Icon={AiOutlineHome} Option="Home" />}
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to="/Explore" onClick={() => setTab("/Explore")}>
                    {tab === "/Explore" ? <SidebarList Icon={HiHashtag} Option="Explore" /> : <SidebarList Icon={HiOutlineHashtag} Option="Explore" />}
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to="/Notifications" onClick={() => setTab("/Notifications")}>
                    {tab === "/Notifications" ? <SidebarList Icon={AiFillBell} Option="Notifications" /> : <SidebarList Icon={AiOutlineBell} Option="Notifications" />}
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to="/Messages" onClick={() => setTab("/Messages")}>
                    {tab === "/Messages" ? <SidebarList Icon={HiMail} Option="Messages" /> : <SidebarList Icon={HiOutlineMail} Option="Messages" />}
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to="/Bookmark" onClick={() => setTab("/Bookmark")}>
                    {tab === "/Bookmark" ? <SidebarList Icon={FaBookmark} Option="Bookmark" /> : <SidebarList Icon={FaRegBookmark} Option="Bookmark" />}
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to="/Profile" onClick={() => setTab("/Profile")}>
                    {tab === "/Profile" ? <SidebarList Icon={RiAccountCircleFill} Option="Profile" /> : <SidebarList Icon={RiAccountCircleLine} Option="Profile" />}
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to="/More" onClick={() => setTab("/More")}>
                    {tab === "/More" ? <SidebarList Icon={HiDotsCircleHorizontal} Option="More" /> : <SidebarList Icon={HiOutlineDotsCircleHorizontal} Option="More" />}
                </NavLink>
                <div
                    className="flex h-12 w-64 items-center justify-center rounded-3xl bg-blue-500 text-[1.2rem] font-bold text-white hover:bg-blue-600 active:bg-blue-800 "
                    onClick={() => {
                        setIsTweetBoxOpen(true);
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
            <Tweet visibility={isTweetBoxOpen} onClose={hideTwitterBox} />
        </main>
    );
};

export default Sidebar;
