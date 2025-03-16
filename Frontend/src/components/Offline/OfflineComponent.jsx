import React from "react";
import { NoInternet } from "../SVGs/SVGs";

const OfflineComponent = () => {
    return (
        <div className="flex flex-col items-center gap-4 pt-10 ">
            <div>
                <NoInternet />
            </div>
            <div className="text-center text-[1.5rem] font-bold text-gray-400">Looks like you lost your connection. Please check it and try again.</div>
            <button className="h-fit w-fit rounded-full bg-blue-500 px-6  py-3 font-bold text-white hover:bg-blue-600 active:bg-blue-700">Try Again</button>
        </div>
    );
};

export default OfflineComponent;
