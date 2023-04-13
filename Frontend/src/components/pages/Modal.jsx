import React from "react";
import { Cross } from "./SVGs";

const Modal = ({ visibility, onClose, type }) => {
    if (!visibility) return;
    return (
        <>
            <div className="fixed inset-0 z-30 flex  h-[100vh] w-[100vw] items-center justify-center">
                <div className="fixed  h-full w-full  bg-black opacity-40"></div>
                <div className="relative  flex h-auto max-h-[40rem]  min-h-[83vh] w-[40vw] flex-col overflow-y-auto rounded-xl bg-white">
                    <div className=" flex h-fit w-full items-center gap-4 border-2">
                        <div className="  m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full  p-2 hover:bg-gray-200" onClick={onClose}>
                            <Cross className="  " />
                        </div>
                        <div className="text-xl font-bold">{type} by</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
