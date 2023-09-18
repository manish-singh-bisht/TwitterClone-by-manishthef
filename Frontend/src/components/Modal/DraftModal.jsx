import React, { Suspense, useEffect, useState } from "react";
import { Cross } from "../SVGs/SVGs";
import axios from "axios";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import Loader from "../Loader/Loader";
import TweetModal from "./TweetModal";
import { toast } from "react-toastify";
import useModal from "../../CustomHooks/useModal";

const DraftModal = ({ visibilityDraft, handleOutsideClickDraft, closeAll }) => {
    if (!visibilityDraft) return;

    const { state } = useGlobalContext();

    const [isTweetBoxOpen, setIsTweetBoxOpen, handleOutsideClick, hideTwitterBox] = useModal();

    const [drafts, setDrafts] = useState([{ id: null, label: null, isChecked: null }]);
    const [isEdit, setIsEdit] = useState(false);
    const [anyChecked, setAnyChecked] = useState({ bool: false, number: 0 });
    const [activeDraft, setActiveDraft] = useState({ id: null, text: null });

    useEffect(() => {
        const getDraftHandler = async () => {
            const { data } = await axios.get(`http://localhost:4000/api/v1/draft/get`, {
                withCredentials: true,
            });
            const dataNew = data.drafts.map((item) => {
                return { id: item._id, label: item.text, isChecked: false };
            });

            setDrafts(dataNew);
        };

        getDraftHandler();
    }, []);

    const editHandler = () => {
        setIsEdit(!isEdit);
    };
    const checkboxHandler = (itemId) => {
        setDrafts((prev) => prev.map((item) => (item.id === itemId ? { ...item, isChecked: !item.isChecked } : item)));
    };
    useEffect(() => {
        const isAnyCheckboxChecked = drafts.some((item) => item.isChecked === true);
        if (isAnyCheckboxChecked) {
            setAnyChecked((prev) => ({ ...prev, bool: true }));
        } else {
            setAnyChecked((prev) => ({ ...prev, bool: false }));
            if (anyChecked.number === 0 && drafts.length === 0) setIsEdit(false);
        }
    }, [drafts]);

    const handleSelectAll = () => {
        const updated = drafts.map((item) => ({
            ...item,
            isChecked: true,
        }));
        setDrafts(updated);
        setAnyChecked((prev) => ({ ...prev, number: drafts.length }));
    };
    const handleDeSelectAll = () => {
        const updated = drafts.map((item) => ({
            ...item,
            isChecked: false,
        }));
        setDrafts(updated);
        setAnyChecked((prev) => ({ ...prev, number: drafts.length }));
    };
    const handleDeleteAll = async () => {
        await axios.delete(`http://localhost:4000/api/v1/draft/deleteAll`, {
            data: {},
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });
        setDrafts([]);
        setAnyChecked((prev) => ({ bool: false, number: 0 }));
        state.user.drafts = 0;
    };
    const handleDelete = async (array) => {
        await axios.delete(`http://localhost:4000/api/v1/draft/delete`, {
            data: { draftIds: array },
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });

        setDrafts((prev) => {
            const newPrev = prev.filter((item) => {
                return !array.includes(item.id);
            });
            if (newPrev.length === 0) {
                setAnyChecked((prev) => ({ bool: false, number: 0 }));

                state.user.drafts = 0;
            } else {
                state.user.drafts = newPrev;
            }
            return newPrev;
        });
    };
    const handleUpdate = async (text) => {
        const toastConfig = {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            closeButton: false,
            style: {
                backgroundColor: "#1DA1F2",
                border: "none",
                boxShadow: "none",
                width: "fit-content",
                zIndex: 9999,
                color: "white",
                padding: "0px 16px",
                minHeight: "3rem",
            },
        };
        if (activeDraft.text === text) {
            toast("Make some changes to the tweet to update the draft.", toastConfig);
        } else {
            const { data } = await axios.put(
                `http://localhost:4000/api/v1//draft/edit`,
                { draftId: activeDraft.id, text: text },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setDrafts(data.draft);
            state.user.drafts = data.draft;
            toast("Draft was updated.", toastConfig);
        }
        closeAll();
    };
    return (
        <>
            <div className="fixed inset-0 z-30 flex  h-[100vh] w-[100vw] items-center justify-center">
                <div className="fixed  h-[100vh] w-[100vw]  bg-black opacity-40" onClick={handleOutsideClickDraft}></div>
                <div className="relative  flex h-full max-h-[40rem] min-h-[83vh] w-full  flex-col overflow-y-auto rounded-xl  bg-white   lg:w-[41vw] ">
                    <div className="  sticky inset-0 mb-3 flex h-fit w-full  items-center  justify-between bg-white/60  px-2 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="  m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full  p-2 hover:bg-gray-200" onClick={closeAll}>
                                <Cross className="  " />
                            </div>
                            <div className="text-xl font-bold">Drafts</div>
                        </div>
                        <button
                            onClick={(e) => {
                                editHandler();
                                if (isEdit) {
                                    setAnyChecked((prev) => ({ ...prev, bool: false }));

                                    handleDeSelectAll();
                                }
                            }}
                            disabled={drafts.length === 0}
                            className="h-fit w-fit rounded-full  bg-black px-4 py-1 font-semibold text-white">
                            {isEdit ? "Done" : "Edit"}
                        </button>
                    </div>
                    <div>
                        {drafts.length > 0 ? (
                            drafts.map((item) => {
                                return (
                                    <div className="flex h-fit gap-2 border-2 px-2 hover:bg-gray-100" key={item.id}>
                                        <input
                                            type="checkbox"
                                            name=""
                                            id=""
                                            checked={item.isChecked}
                                            className={`${isEdit ? "block" : "hidden"} `}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                checkboxHandler(item.id);
                                            }}
                                        />
                                        <div
                                            className="w-full   py-3  text-[1.1rem] "
                                            onClick={(e) => {
                                                setActiveDraft((prev) => ({ ...prev, id: item.id, text: item.label }));
                                                setIsTweetBoxOpen(true);
                                            }}>
                                            {item.label}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="mt-4 flex flex-col items-center justify-center  text-[1.1rem] leading-4 text-gray-700">
                                <span className="text-[1.6rem] font-bold text-black">Hold that thought</span> <br /> Not ready to post just yet? Save it to your drafts.
                            </div>
                        )}
                    </div>
                    <div className="sticky  bottom-0 bg-gray-200">
                        {isEdit && (
                            <div className=" bottom-0 flex w-full justify-between   px-3 py-3">
                                <button
                                    className="rounded-full p-2 hover:bg-gray-100"
                                    onClick={() => {
                                        if (anyChecked.bool) {
                                            handleDeSelectAll();
                                        } else {
                                            handleSelectAll();
                                        }
                                    }}>
                                    {anyChecked.bool ? "Deselect all" : "Select all"}
                                </button>
                                <button
                                    disabled={!anyChecked.bool}
                                    className={`${anyChecked.bool ? "bg-red-200 hover:bg-red-300 active:bg-red-500" : "hover:bg-gray-100"}} rounded-full p-2 `}
                                    onClick={() => {
                                        if (anyChecked.number === drafts.length) {
                                            handleDeleteAll();
                                        } else {
                                            let arrayId = [];
                                            drafts.map((item) => {
                                                if (item.isChecked) {
                                                    arrayId.push(item.id);
                                                }
                                            });
                                            handleDelete(arrayId);
                                        }
                                    }}>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Suspense fallback={<Loader />}>
                <TweetModal
                    visibility={isTweetBoxOpen}
                    onClose={hideTwitterBox}
                    handleOutsideClick={handleOutsideClick}
                    initialTweetFromOtherPartsOfApp={activeDraft}
                    fromDraft={true}
                    handleDeleteDraft={(array) => handleDelete(array)}
                    handleUpdateDraft={(text) => handleUpdate(text)}
                />
            </Suspense>
        </>
    );
};

export default DraftModal;
