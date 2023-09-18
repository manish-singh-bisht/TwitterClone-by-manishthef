import { NavLink } from "react-router-dom";
import Loader from "../Loader/Loader";
import MoreOptionMenuModal from "../Modal/MoreOptionMenuModal";
import TweetModal from "../Modal/TweetModal";
import { BellFilled, BellOutline, BookmarkFilled, BookmarkOutline, HashtagOutline, HomeFilled, HomeOutLine, MessageFilled, MessageOutline, MoreFilled, MoreOutline, Plus, ProfileFilled, ProfileOutline, TwitterIcon } from "../SVGs/SVGs";
import { Suspense, useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import useModal from "../../CustomHooks/useModal";
import LogoutUser from "../../context/Actions/LogoutUser";
import Avatar from "../Avatar/Avatar";

const SideBarIconsOnly = ({ isOnline }) => {
    const [tab, setTab] = useState(window.location.pathname);
    const { ACTIONS, dispatch, state } = useGlobalContext();
    const logoutBox = useRef(null);

    useEffect(() => {
        setTab(window.location.pathname);
    }, [window.location.pathname]);

    const [isTweetBoxOpen, setIsTweetBoxOpen, handleOutsideClick, hideTwitterBox] = useModal();
    const [visibilityMoreOptionModal, setVisibilityMoreOptionModal, handleOutsideClickMoreOptionModal, onCloseMoreOptionModal] = useModal();

    const logOutUser = async () => {
        await LogoutUser({ dispatch, ACTIONS });
    };
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
    return (
        <main className="sticky top-0 z-20 flex h-[100vh] w-[100%] flex-col items-end justify-between   overflow-y-auto ">
            <div className=" flex w-3/4 select-none flex-col items-end gap-6   ">
                <NavLink to="/" className={({ isActive }) => (isActive ? "w-fit " : " w-fit ")} onClick={() => setTab("/")}>
                    <TwitterIcon className="" />
                </NavLink>

                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : " w-fit  font-normal")} to="/" onClick={() => setTab("/")}>
                    {tab === "/" ? <HomeFilled /> : <HomeOutLine />}
                </NavLink>
                <div className={"w-fit font-normal hover:cursor-not-allowed"}>{tab === "/Explore" ? <HashtagFilled /> : <HashtagOutline />}</div>
                <div className={"w-fit font-normal hover:cursor-not-allowed"}>{tab === "/Notifications" ? <BellFilled /> : <BellOutline />}</div>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to="/Messages" onClick={() => setTab("/Messages")}>
                    {tab === "/Messages" ? <MessageFilled /> : <MessageOutline />}
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to="/Bookmark" onClick={() => setTab("/Bookmark")}>
                    {tab === "/Bookmark" ? <BookmarkFilled /> : <BookmarkOutline />}
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? "w-fit font-bold" : "w-fit font-normal")} to={`/Profile/${state.user.handle}`} onClick={() => setTab("/Profile")}>
                    {tab === "/Profile" ? <ProfileFilled /> : <ProfileOutline />}
                </NavLink>
                <div className={"w-fit font-normal hover:cursor-not-allowed"}>{tab === "/More" ? <MoreFilled /> : <MoreOutline />}</div>
                <div
                    className="mr-2 flex items-center justify-center rounded-3xl bg-blue-500 text-[1.2rem] font-bold text-white hover:bg-blue-600 active:bg-blue-800 "
                    onClick={() => {
                        if (isOnline) {
                            setIsTweetBoxOpen(true);
                            document.body.style.overflow = "hidden";
                        }
                    }}>
                    <Plus />
                </div>
            </div>
            <div
                ref={logoutBox}
                className=" ml-[0.3rem] mb-14   flex   cursor-pointer  items-center gap-1 rounded-full hover:bg-gray-100"
                onClick={() => {
                    if (isOnline) {
                        setVisibilityMoreOptionModal(true);
                        document.body.style.overflow = "hidden";
                        const buttonRect = logoutBox.current.getBoundingClientRect();
                        const top = buttonRect.top;
                        const left = buttonRect.left;
                        setButtonPosition({ top, left });
                    }
                }}>
                <div className="w-fit">
                    <Avatar profile={state.user.profile && state.user.profile.image && state.user.profile.image.url ? state.user.profile.image.url : null} />
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

export default SideBarIconsOnly;
