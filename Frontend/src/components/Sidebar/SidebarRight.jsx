import { useState } from "react";
import Avatar from "../Avatar/Avatar";
import { SearchIcon, ThreeDots } from "../SVGs/SVGs";
import StickyBox from "react-sticky-box";
import axios from "axios";
import Loader from "../Loader/Loader";

export default function SidebarRight() {
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

    const [userSearched, setUserSearched] = useState([]);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(false);

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
                    <div className="sticky top-0  flex   min-h-[3.5rem] w-full flex-col  bg-white   pt-1   ">
                        <div className=" flex min-h-[2.75rem]  w-[350px] items-center gap-3 rounded-full bg-[#e7eaeb] pl-4">
                            <SearchIcon className="  h-[20px] w-[20px]" />
                            <input
                                type="text"
                                placeholder="Search Twitter"
                                className="h-full w-full bg-transparent text-black outline-none placeholder:text-black"
                                onFocus={() => setActive(true)}
                                onBlur={(e) => {
                                    setActive(false);
                                    setUserSearched([]);
                                    e.target.value = "";
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
                                                        <button className="flex items-start gap-1 p-3 hover:bg-gray-50" key={item._id}>
                                                            <Avatar profile={item.profile && item.profile.image && item.profile.image.url ? item.profile.image.url : null} />
                                                            <div className="flex flex-col items-start">
                                                                <span className="font-bold hover:underline">{item.name.length > 30 ? item.name.slice(0, 30).trim() + "..." : item.name}</span>
                                                                <span className="mt-[-0.2rem] text-gray-600">@{item.handle}</span>
                                                                {/* //one for following */}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : null}
                    </div>

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
                        <div className="mt-5 mb-5   rounded-xl bg-[#F7F9F9] ">
                            <p className="px-3  pt-3 text-[1.31rem] font-bold">Who to follow</p>
                            <div className="flex flex-col py-2">
                                <TrendingFollow name={"Iman Musa"} username={"imanmcodes"} profilePicture={"https://source.unsplash.com/random/1200x600"} />
                                <TrendingFollow name={"Elon Musk"} username={"elonmusk"} profilePicture={"https://source.unsplash.com/random/1200x600"} />
                                <TrendingFollow name={"Kim Kardashian"} username={"kimkardashian"} profilePicture={"https://source.unsplash.com/random/1200x600"} />
                            </div>
                            <button className="w-full rounded-bl-xl rounded-br-xl p-3 text-left text-blue-500 hover:bg-gray-200">Show more</button>
                        </div>
                    </div>
                </div>
            </div>
        </StickyBox>
    );
}

function TrendingTopic({ topic, number }) {
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
}

function TrendingFollow({ name, username, profilePicture }) {
    return (
        <div className="flex w-full items-center justify-between  py-2 px-3 hover:bg-gray-200">
            <div className="flex items-center gap-2">
                <Avatar profile={profilePicture} />
                <div className="flex flex-col items-start ">
                    <div className="text-[1.03rem] font-semibold">{name}</div>
                    <div className=" mt-[-0.2rem] text-gray-500">@{username}</div>
                </div>
            </div>
            <button className="rounded-full bg-black px-4 py-1 font-semibold text-white hover:text-gray-300 active:text-gray-400 ">Follow</button>
        </div>
    );
}
