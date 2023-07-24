import React from "react";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import { ThreeDots } from "../SVGs/SVGs";

const BookMarkPage = () => {
    // this is just for showing the posts that were bookmarked by the logged in user, to see how the number of the bookmark is being changed or from where the api call is being made, refer to Frontend\src\components\CommonPostComponent\BookMark.jsx.
    const { state } = useGlobalContext();
    return (
        <div className="h-[100%] min-h-[100vh] border-l border-r">
            <div className="sticky inset-0 z-10 flex h-fit   justify-between    bg-white/60  backdrop-blur-md ">
                <div className="mx-2 flex flex-col ">
                    <span className="   text-2xl font-bold">Bookmarks</span>
                    <span className="  text-sm text-gray-600">@{state.user.handle}</span>
                </div>
                <div className="m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:border-2 hover:bg-gray-200 active:bg-gray-300">
                    <ThreeDots />
                </div>
            </div>
        </div>
    );
};

export default BookMarkPage;
