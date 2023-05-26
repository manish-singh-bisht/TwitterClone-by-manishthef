import React, { useEffect, useRef } from "react";
import { Delete, PushPin, UserPlus } from "../SVGs/SVGs";

const MoreOptionMenuModal = ({ visibility, handleOutsideClick, modalPosition }) => {
    if (!visibility) return;
    const modalRef = useRef(null);

    useEffect(() => {
        const positionModal = () => {
            const modalRect = modalRef.current.getBoundingClientRect();

            // Calculate the desired position
            const top = modalPosition.top - modalRect.height + 130;
            const left = modalPosition.left - modalRect.width + 25;

            // Apply the position to the modal
            modalRef.current.style.top = `${top}px`;
            modalRef.current.style.left = `${left}px`;
        };

        if (visibility && modalPosition) {
            positionModal();
        }
    }, [visibility, modalPosition]);

    return (
        <div className="fixed inset-0 z-30 h-[100vh] w-[100vw] ">
            <div className="fixed z-10  h-full w-full" onClick={handleOutsideClick}></div>
            <div className=" relative z-30  w-[20rem] rounded-xl border-2 bg-white shadow-md" ref={modalRef}>
                <button className="flex w-full items-center gap-3 rounded-xl p-3 text-red-400  hover:bg-gray-50">
                    <Delete />
                    <div className="font-bold ">Delete</div>
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl p-3  hover:bg-gray-50">
                    <PushPin />
                    <div className="font-bold ">Pin to your Profile</div>
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl p-3  hover:bg-gray-50">
                    <UserPlus />
                    <div className="font-bold ">Follow</div>
                </button>
            </div>
        </div>
    );
};

export default MoreOptionMenuModal;
