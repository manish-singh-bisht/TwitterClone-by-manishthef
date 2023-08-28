import React, { memo, useState } from "react";
import Avatar from "../Avatar/Avatar";
import { SearchIcon, ThreeDots } from "../SVGs/SVGs";
import StickyBox from "react-sticky-box";
import axios from "axios";
import Loader from "../Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import FollowUser from "../../context/Actions/FollowUser";

const SidebarRight = () => {
    // let sidebar = document.getElementsByClassName("sidebar")[0];
    // let sidebarContent = document.getElementsByClassName("contentWrapper")[0];

    // window.onscroll = () => {
    //     let scrollTop = window.scrollY; // current scroll position
    //     let viewportHeight = window.innerHeight; //viewport height
    //     let contentHeight = sidebarContent.getBoundingClientRect().height; // current content height
    //     let sidebarTop = sidebar.getBoundingClientRect().top + window.scrollY; //distance from top to sidebar

    //     if (scrollTop >= contentHeight - viewportHeight + sidebarTop + 15) {
    //         sidebarContent.style.transform = `translateY(-${contentHeight - viewportHeight + sidebarTop}px)`;
    //         sidebarContent.style.position = "fixed";
    //     } else {
    //         sidebarContent.style.transform = ``;
    //         sidebarContent.style.position = "";
    //     }
    // };
    const navigate = useNavigate();
    const [userSearched, setUserSearched] = useState([]);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(false);

    const { usersForRightSidebar, state, ACTIONS, dispatch, dispatchFollowUser } = useGlobalContext();

    const debounceFunction = (cb, delay = 700) => {
        let timeout;
        return (...args) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                cb(...args);
            }, delay);
        };
    };
    const searchHandler = debounceFunction(async (e) => {
        const valueTyped = e.target.value;
        if (!valueTyped.trim()) {
            setUserSearched([]);
            setLoading(false);
            return;
        }

        const { data } = await axios.get(`http://localhost:4000/api/v1/search/${valueTyped}`, { withCredentials: true });
        if (data.users) {
            setUserSearched(data.users);
        } else {
            setUserSearched({ message: data.message });
        }
        setLoading(false);
    }, 700);

    return (
        <StickyBox>
            <div className={``}>
                <div className={``}>
                    <div className="sticky top-0  z-[8]   flex min-h-[3.5rem] w-full  flex-col bg-white  pt-1   ">
                        <div className=" flex min-h-[2.75rem]  w-[350px] items-center gap-3 rounded-full bg-[#e7eaeb] pl-4">
                            <SearchIcon className="  h-[20px] w-[20px]" />
                            <input
                                type="text"
                                placeholder="Search Twitter"
                                className="h-full w-full bg-transparent text-black outline-none placeholder:text-black"
                                onFocus={() => setActive(true)}
                                onBlur={(e) => {
                                    setTimeout(() => {
                                        setActive(false);
                                        setUserSearched([]);
                                        e.target.value = "";
                                    }, 100); // Delay the onBlur action by 100 milliseconds for the user to get some time to get to the profile of user that was clicked while searching below.
                                }}
                                onChange={(e) => {
                                    setLoading(true);
                                    searchHandler(e);
                                }}
                            />
                        </div>
                        {loading ? (
                            <Loader />
                        ) : active && !loading ? (
                            <div className="min-h-24  max-h-[20rem] w-[350px]  overflow-y-auto rounded-xl border-2  bg-white text-center drop-shadow-lg">
                                {userSearched.length === 0 ? (
                                    <div className="mt-4  h-24 text-gray-600">Try searching for people</div>
                                ) : (
                                    <>
                                        {userSearched.message ? (
                                            <div className="mt-4  h-24 text-gray-600 underline">{userSearched.message}</div>
                                        ) : (
                                            <div className="flex flex-col ">
                                                {userSearched.map((item) => {
                                                    return (
                                                        <Link to={`/Profile/${item.handle}`} className="flex items-start gap-1 p-3 hover:bg-gray-50" key={item._id}>
                                                            <Avatar profile={item.profile && item.profile.image && item.profile.image.url ? item.profile.image.url : null} />
                                                            <div className="flex flex-col items-start">
                                                                <span className="font-bold hover:underline">{item.name.length > 30 ? item.name.slice(0, 30).trim() + "..." : item.name}</span>
                                                                <span className="mt-[-0.2rem] text-gray-600">@{item.handle.length > 26 ? item.handle.slice(0, 26).trim() + "..." : item.handle}</span>

                                                                {state.user.following.includes(item._id) && (
                                                                    <span className="flex items-center text-gray-600">
                                                                        <svg className="  h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                                                        </svg>
                                                                        Following
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : null}
                    </div>
                    {usersForRightSidebar && (
                        <div className="my-2    w-[21.88rem] flex-col items-center  overflow-hidden rounded-xl border-[0.1px] border-gray-200 ">
                            <div className=" w-full rounded-xl  ">
                                <div className="  px-3 pt-2 pb-[0.4rem] text-[1.5rem] font-bold">Relevant People</div>
                                {usersForRightSidebar.post?.owner && (
                                    <TrendingFollow
                                        name={usersForRightSidebar.post.owner.name}
                                        username={usersForRightSidebar.post.owner.handle}
                                        profilePicture={
                                            usersForRightSidebar.post.owner && usersForRightSidebar.post.owner.profile && usersForRightSidebar.post.owner.profile.image && usersForRightSidebar.post.owner.profile.image.url
                                                ? usersForRightSidebar.post.owner.profile.image.url
                                                : null
                                        }
                                        description={usersForRightSidebar.post.owner.description}
                                        handle={usersForRightSidebar.post.owner.handle}
                                        dispatchFollowUser={dispatchFollowUser}
                                        state={state}
                                        ACTIONS={ACTIONS}
                                        dispatch={dispatch}
                                        userId={usersForRightSidebar.post.owner._id}
                                    />
                                )}
                                {usersForRightSidebar.parent?.owner && usersForRightSidebar.parent?.owner._id !== usersForRightSidebar.post?.owner._id && (
                                    <TrendingFollow
                                        name={usersForRightSidebar.parent.owner.name}
                                        userId={usersForRightSidebar.parent.owner._id}
                                        username={usersForRightSidebar.parent.owner.handle}
                                        profilePicture={
                                            usersForRightSidebar.parent.owner && usersForRightSidebar.parent.owner.profile && usersForRightSidebar.parent.owner.profile.image && usersForRightSidebar.parent.owner.profile.image.url
                                                ? usersForRightSidebar.parent.owner.profile.image.url
                                                : null
                                        }
                                        description={usersForRightSidebar.parent.owner.description}
                                        handle={usersForRightSidebar.parent.owner.handle}
                                        dispatchFollowUser={dispatchFollowUser}
                                        state={state}
                                        ACTIONS={ACTIONS}
                                        dispatch={dispatch}
                                    />
                                )}
                                {usersForRightSidebar.owner && usersForRightSidebar.owner._id !== usersForRightSidebar.post?.owner._id && usersForRightSidebar.parent?.owner._id !== usersForRightSidebar.owner._id && (
                                    <TrendingFollow
                                        name={usersForRightSidebar.owner.name}
                                        userId={usersForRightSidebar.owner._id}
                                        username={usersForRightSidebar.owner.handle}
                                        profilePicture={
                                            usersForRightSidebar.owner && usersForRightSidebar.owner.profile && usersForRightSidebar.owner.profile.image && usersForRightSidebar.owner.profile.image.url
                                                ? usersForRightSidebar.owner.profile.image.url
                                                : null
                                        }
                                        description={usersForRightSidebar.owner.description}
                                        handle={usersForRightSidebar.owner.handle}
                                        dispatchFollowUser={dispatchFollowUser}
                                        state={state}
                                        ACTIONS={ACTIONS}
                                        dispatch={dispatch}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    <div className="    w-[350px] flex-col items-center  overflow-hidden">
                        <div className="mt-3 w-full rounded-xl bg-[#F7F9F9] p-3 pb-3">
                            <p className="mb-2 text-[1.5rem] font-bold">What's happening</p>
                            <TrendingTopic topic={"Mera Pyara Bharat"} number={"500K"} />
                            <TrendingTopic topic={"Just Keep Grinding."} number={"490K"} />
                            <TrendingTopic topic={"All Physical Mental Capabilities are False."} number={"480K"} />
                            <TrendingTopic topic={"Run,Run Fast To Get Out Of the mess you're in right now,don't stop in this mess."} number={"470K"} />
                            <TrendingTopic topic={"Keep pushing,push push push and push."} number={"460K"} />
                            <TrendingTopic topic={"When I reach my limits, I push and I grow."} number={"450K"} />
                            <TrendingTopic topic={"It's my Choice,Every Second That I Pass In this Uncomfortable Thing It's My Choice."} number={"440K"} />
                            <TrendingTopic topic={"Nobody Wants To Do it Because It's Hard. I Can and I will.Maybe not Today,not Tomorrow But I will for Sure."} number={"430K"} />
                            <TrendingTopic topic={"𝕏"} number={"54K"} />
                        </div>
                        {!usersForRightSidebar && (
                            <div className="mt-5 mb-5   rounded-xl bg-[#F7F9F9] ">
                                <p className="px-3  pt-3 text-[1.31rem] font-bold">Who to follow</p>
                                {/* <div className="flex flex-col py-2">
                                    <TrendingFollow name={"Iman Musa"} username={"imanmcodes"} profilePicture={"https://source.unsplash.com/random/1200x600"} description={null} handle={1} />
                                    <TrendingFollow name={"Elon Musk"} username={"elonmusk"} profilePicture={"https://source.unsplash.com/random/1200x600"} description={null} handle={"6452294bcf01c48b11c2f282"} />
                                    <TrendingFollow name={"Kim Kardashian"} username={"kimkardashian"} profilePicture={"https://source.unsplash.com/random/1200x600"} description={null} handle={3} />
                                </div> */}
                                <button
                                    onClick={() => {
                                        navigate("/Connect");
                                    }}
                                    className="w-full rounded-bl-xl rounded-br-xl p-3 text-left text-blue-500 hover:bg-gray-200">
                                    Show more
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StickyBox>
    );
};

const TrendingTopic = memo(({ topic, number }) => {
    return (
        <div className="flex cursor-pointer flex-col py-3 text-sm">
            <div className=" flex justify-between text-[13px] text-gray-700">
                <span>Trending in India</span>
                <ThreeDots />
            </div>
            <span className="mb-0.5 text-[1rem] font-bold">{topic}</span>
            <span className="text-[0.83rem] text-gray-700">{number} Tweets</span>
        </div>
    );
});

const TrendingFollow = memo(({ name, userId, username, profilePicture, description, handle, dispatchFollowUser, state, ACTIONS, dispatch }) => {
    const navigate = useNavigate();

    const navigateHandlerToProfile = (handle) => {
        navigate(`/Profile/${handle}`);
    };
    const followHandler = async (id) => {
        await FollowUser({ dispatchFollowUser, ACTIONS, id });
        const { data } = await axios.get("http://localhost:4000/api/v1/me", { withCredentials: true });
        dispatch({ type: ACTIONS.LOAD_SUCCESS, payload: { myProfile: data.myProfile, total: data.total } });
    };
    return (
        <div onClick={() => navigateHandlerToProfile(username)}>
            <div className="flex w-[21.88rem] items-start pt-3 hover:cursor-pointer hover:bg-gray-100 ">
                <div className="w-fit">
                    <Avatar profile={profilePicture} />
                </div>
                <div className="flex w-[85%]  flex-col   ">
                    <div className=" flex w-full items-start justify-between  pl-2 pr-3 ">
                        <div className="w-full ">
                            <div className="text-[1.03rem] font-semibold hover:underline">{name.length > 15 ? name.slice(0, 15).trim() + "..." : name}</div>
                            <div className=" mt-[-0.2rem] text-gray-500">@{username.length > 15 ? username.slice(0, 15).trim() + "..." : username}</div>
                        </div>
                        {userId !== state.user._id && (
                            <button
                                className={`group w-fit rounded-full   ${
                                    state.user.following.includes(userId) ? "border-2 bg-white text-black hover:border-red-200 hover:bg-red-100" : "bg-black text-white hover:text-gray-300 active:text-gray-400"
                                } px-4 py-2 font-bold `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    followHandler(userId);
                                }}>
                                {state.user.following.includes(userId) ? (
                                    <>
                                        <span className="group-hover:hidden">Following</span>
                                        <span className="hidden group-hover:block">Unfollow</span>
                                    </>
                                ) : (
                                    <span>Follow</span>
                                )}
                            </button>
                        )}
                    </div>
                    <div className=" mt-2 w-full break-words pr-3 pl-2 pb-3 text-[0.9rem]">{description}</div>
                </div>
            </div>
        </div>
    );
});
export default memo(SidebarRight);
