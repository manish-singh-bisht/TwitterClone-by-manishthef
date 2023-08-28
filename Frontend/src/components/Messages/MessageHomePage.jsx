import React, { useEffect, useRef } from "react";
import { SearchIcon, ThreeDots } from "../SVGs/SVGs";

const MessageHomePage = () => {
    const searchInputRef = useRef(null);

    const handleNewMessageClick = () => {
        searchInputRef.current.focus();
    };
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);
    return (
        <div className="fixed z-10 grid h-[100vh] w-[calc(100vw-24rem)] grid-cols-[24.5rem_auto] bg-white">
            <div className="border-l">
                <div className="mx-2 flex flex-col ">
                    <span className="   text-2xl font-bold">Messages</span>
                </div>
                <div className="mx-4 mt-6  mb-4 flex  min-h-[2.75rem] items-center  gap-3 rounded-full border-2 bg-white pl-4 focus-within:border-blue-500">
                    <SearchIcon className="  h-[20px] w-[20px]" />
                    <input
                        type="text"
                        placeholder="Search People"
                        ref={searchInputRef}
                        className="h-full w-full bg-transparent  text-black outline-none placeholder:text-black "
                        // onFocus={() => setActive(true)}
                        // onBlur={(e) => {
                        //     setTimeout(() => {
                        //         setActive(false);
                        //         setUserSearched([]);
                        //         e.target.value = "";
                        //     }, 100); // Delay the onBlur action by 100 milliseconds for the user to get some time to get to the profile of user that was clicked while searching below.
                        // }}
                        // onChange={(e) => {
                        //     setLoading(true);
                        //     searchHandler(e);
                        // }}
                    />
                </div>
                <div className="flex cursor-pointer justify-between  p-2 hover:bg-gray-100">
                    <div className="flex gap-2">
                        <div>iamge</div>
                        <div>
                            <div className="flex">
                                <span>name</span>
                                <span>handle</span>
                                <span>datae</span>
                            </div>
                            <div>latest message</div>
                        </div>
                    </div>
                    <div className=" h-fit rounded-full  hover:bg-blue-100 hover:text-blue-500 ">
                        <ThreeDots />
                    </div>
                </div>
            </div>
            <div className=" flex w-[86%] flex-col items-center justify-center border-l border-r ">
                <div className="w-[22rem]  text-center text-[2rem] font-extrabold">Select a message</div>
                <div className="w-[22rem] text-center text-gray-500 ">
                    Choose from your existing conversations, start a<br /> new one, or just keep swimming.
                </div>
                <button className="mt-5 flex h-12 w-[11rem] items-center justify-center rounded-3xl bg-blue-500 text-[1.2rem] font-bold text-white hover:bg-blue-600 active:bg-blue-800 " onClick={handleNewMessageClick}>
                    New message
                </button>
            </div>
        </div>
    );
};

export default MessageHomePage;
