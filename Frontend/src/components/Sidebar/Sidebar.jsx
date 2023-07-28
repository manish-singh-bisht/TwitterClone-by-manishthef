import React, { useState, Suspense, memo, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import SidebarList from "./SidebarList";
import {
    BellFilled,
    BellOutline,
    BookmarkFilled,
    BookmarkOutline,
    HashtagFilled,
    HashtagOutline,
    HomeFilled,
    HomeOutLine,
    MessageFilled,
    MessageOutline,
    MoreFilled,
    MoreOutline,
    ProfileFilled,
    ProfileOutline,
    ThreeDots,
    TwitterIcon,
} from "../SVGs/SVGs";
import Loader from "../Loader/Loader";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import LogoutUser from "../../context/Actions/LogoutUser";
import Avatar from "../Avatar/Avatar";

const TweetModal = React.lazy(() => import("../Modal/TweetModal"));
const MoreOptionMenuModal = React.lazy(() => import("../Modal/MoreOptionMenuModal"));

const Sidebar = () => {
    const [tab, setTab] = useState(window.location.pathname);
    const [isTweetBoxOpen, setIsTweetBoxOpen] = useState(false);
    const { ACTIONS, dispatch, state } = useGlobalContext();
    const logoutBox = useRef(null);

    useEffect(() => {
        setTab(window.location.pathname);
    }, [window.location.pathname]);

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
    const logOutUser = async () => {
        await LogoutUser({ dispatch, ACTIONS });
    };
    const [visibilityMoreOptionModal, setVisibilityMoreOptionModal] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
    const handleOutsideClickMoreOptionModal = (event) => {
        if (event.target === event.currentTarget) {
            setVisibilityMoreOptionModal(false);
            document.body.style.overflow = "unset";
        }
    };
    const onCloseMoreOptionModal = () => {
        setVisibilityMoreOptionModal(false);
        document.body.style.overflow = "unset";
    };

    return (
        <main className="fixed z-20 flex h-[100vh] w-[21rem] flex-col items-end justify-between    ">
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
            <div
                ref={logoutBox}
                className=" mx-[0.4rem] mb-14   flex  min-h-[4.5rem] w-[15.5rem] cursor-pointer  items-center gap-1 rounded-[24rem]  hover:bg-gray-100"
                onClick={() => {
                    setVisibilityMoreOptionModal(true);
                    document.body.style.overflow = "hidden";
                    const buttonRect = logoutBox.current.getBoundingClientRect();
                    const top = buttonRect.top;
                    const left = buttonRect.left;
                    setButtonPosition({ top, left });
                }}>
                <div className="w-fit">
                    <Avatar profile={state.user.profile && state.user.profile.image.url ? state.user.profile.image.url : null} />
                </div>

                <div className="w-full  ">
                    <div className=" text-[1.05rem] font-semibold">{state.user.name.length > 15 ? `${state.user.name.slice(0, 15)}...` : state.user.name}</div>

                    <div className="max-w-[100%] break-words  text-gray-500">{state.user.handle.length > 15 ? `@${state.user.handle.slice(0, 15)}...` : `@${state.user.handle}`}</div>
                </div>
                <div className="relative left-auto pr-1">
                    <ThreeDots />
                </div>
            </div>
            <Suspense fallback={<Loader />}>
                <TweetModal visibility={isTweetBoxOpen} onClose={hideTwitterBox} handleOutsideClick={handleOutsideClick} initialTweetFromOtherPartsOfApp={null} />
                <MoreOptionMenuModal
                    visibility={visibilityMoreOptionModal}
                    handleOutsideClick={handleOutsideClickMoreOptionModal}
                    fromSideBar={true}
                    buttonPosition={buttonPosition}
                    logOutUser={logOutUser}
                    onCloseMoreOptionModal={onCloseMoreOptionModal}
                />
            </Suspense>
        </main>
    );
};

export default memo(Sidebar);
