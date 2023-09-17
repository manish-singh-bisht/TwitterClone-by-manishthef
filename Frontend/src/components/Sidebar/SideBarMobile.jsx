// Sidebar.js
import React, { Suspense, useRef, useState } from "react";
import Avatar from "../Avatar/Avatar";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import { Link } from "react-router-dom";
import { BookmarkOutline, Connect, MessageOutline, ProfileOutline, ThreeDots } from "../SVGs/SVGs";
import useModal from "../../CustomHooks/useModal";
import LogoutUser from "../../context/Actions/LogoutUser";
import Loader from "../Loader/Loader";
import MoreOptionMenuModal from "../Modal/MoreOptionMenuModal";

const SideBarMobile = ({ isOpen, handleOutsideClick, profile }) => {
    if (!isOpen) return;

    const { state, dispatch, ACTIONS } = useGlobalContext();
    const logoutBox = useRef(null);

    const logOutUser = async () => {
        await LogoutUser({ dispatch, ACTIONS });
    };

    const [visibilityMoreOptionModal, setVisibilityMoreOptionModal, handleOutsideClickMoreOptionModal, onCloseMoreOptionModal] = useModal();

    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
    return (
        <div className="fixed inset-0 z-30 flex  h-[100%] w-[100%] items-center justify-center">
            <div className="fixed h-[100vh] w-[100vw]  bg-black opacity-40" onClick={handleOutsideClick}></div>
            <div className={`fixed inset-y-0 left-0 w-[85%] transform bg-white transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex flex-col">
                    <div className=" border-b p-4">
                        <Avatar profile={profile} />

                        <div>
                            <span className="text-[1.3rem] font-bold">{state.user.name}</span> <br />
                            <span className="text-[1rem] text-gray-600">@{state.user.handle}</span>
                        </div>
                        <div className="font-bold">
                            {state.user.following.length} <span className="font-normal text-gray-600 ">Following</span>&nbsp;&nbsp;&nbsp; {state.user.followers.length}
                            <span className="font-normal text-gray-600"> Followers</span>
                        </div>
                    </div>

                    <div className="flex flex-col  ">
                        <Link to={`/Profile/${state.user.handle}`} className="flex gap-3 p-3 text-[1.2rem] font-bold active:bg-gray-100">
                            <ProfileOutline />
                            <div>Profile</div>
                        </Link>
                        <Link to="/Bookmark" className="flex gap-3 p-3 text-[1.2rem] font-bold active:bg-gray-100">
                            <BookmarkOutline />
                            <div>BookMarks</div>
                        </Link>
                        <Link to="/Messages" className="flex gap-3 p-3 text-[1.2rem] font-bold active:bg-gray-100">
                            <MessageOutline />
                            <div>Chat</div>
                        </Link>
                        <Link to="/Connect" className="flex gap-3 p-3 text-[1.2rem] font-bold active:bg-gray-100">
                            <Connect />
                            <div>Connect</div>
                        </Link>
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
                                <Avatar profile={profile} />
                            </div>

                            <div className="w-full  ">
                                <div className=" text-[1.05rem] font-semibold">{state.user.name.length > 15 ? `${state.user.name.slice(0, 15)}...` : state.user.name}</div>

                                <div className="max-w-[100%] break-words  text-gray-500">{state.user.handle.length > 15 ? `@${state.user.handle.slice(0, 15)}...` : `@${state.user.handle}`}</div>
                            </div>
                            <div className="relative left-auto pr-1">
                                <ThreeDots />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Suspense fallback={<Loader />}>
                <MoreOptionMenuModal
                    visibility={visibilityMoreOptionModal}
                    handleOutsideClick={handleOutsideClickMoreOptionModal}
                    fromSideBar={true}
                    fromMobileSidebar={true}
                    buttonPosition={buttonPosition}
                    logOutUser={logOutUser}
                    onCloseMoreOptionModal={onCloseMoreOptionModal}
                />
            </Suspense>
        </div>
    );
};

export default SideBarMobile;
