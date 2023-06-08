import React from "react";
import { Cross } from "../SVGs/SVGs";

const ExpandedImage = ({ modalData, onclose, visibility }) => {
    if (!visibility) return;
    return (
        <>
            <div className="fixed inset-0 z-30 h-[100vh] w-[100vw]">
                <div className="fixed  h-full w-full bg-black"></div>
                <div className="relative z-40 flex h-screen flex-col ">
                    <div className="absolute  h-fit  w-full ">
                        <div className=" m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full  p-2 text-white hover:text-blue-500" onClick={onclose}>
                            <Cross />
                        </div>
                    </div>
                    {modalData.type === "banner" && (
                        <div className="my-auto  flex items-center justify-center ">
                            <img src={modalData.imageUrl} alt="expanded image" className="max-h-[68vh] w-full object-cover" />
                        </div>
                    )}
                    {modalData.type === "profile" && (
                        <div className="my-auto  flex items-center justify-center ">
                            <img src={modalData.imageUrl} alt="expanded image" className="h-[46.2vh] w-[24vw] rounded-full object-cover" />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ExpandedImage;
