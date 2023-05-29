import React from "react";

const DeleteLogoutModal = ({ visibility, handleOutsideClick, fromDelete, deleteHandler, onClose, onCloseMoreOptionModal }) => {
    if (!visibility) return;
    return (
        <div className="fixed inset-0 z-30 flex h-[100vh] w-[100vw] items-center justify-center">
            <div className="fixed  h-full w-full bg-black opacity-20" onClick={handleOutsideClick}></div>
            {fromDelete && (
                <div className="z-10 flex h-[20rem] w-[20rem] flex-col gap-2 rounded-2xl bg-white p-8">
                    <div className=" text-[1.4rem] font-semibold">Delete Tweet? </div>
                    <div className="text-[0.97rem] text-gray-600">This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from Twitter search results.</div>
                    <div className="flex flex-col gap-3 pt-3">
                        <button
                            className="flex h-10 w-64 items-center justify-center rounded-3xl bg-red-500  text-[1rem] font-semibold text-white hover:bg-red-600 active:bg-red-700 "
                            onClick={() => {
                                deleteHandler();
                                onClose();
                                onCloseMoreOptionModal();
                            }}>
                            Delete
                        </button>
                        <button
                            className="flex h-10 w-64 items-center justify-center rounded-3xl border-2  text-[1rem] font-semibold hover:bg-gray-200 active:bg-gray-300 "
                            onClick={() => {
                                onClose();
                            }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteLogoutModal;
