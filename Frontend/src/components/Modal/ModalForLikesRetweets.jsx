import React from "react";
import { Cross } from "../SVGs/SVGs";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import FollowUser from "../../context/Actions/FollowUser";
import axios from "axios";

const ModalForLikesRetweets = ({ visibility, onClose, type, list, handleOutsideClick }) => {
    if (!visibility) return;

    const { state, ACTIONS, dispatch, dispatchFollowUser } = useGlobalContext();

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
        <>
            <div className="fixed inset-0 z-30 flex  h-[100vh] w-[100vw] items-center justify-center">
                <div className="fixed  h-[100vh] w-[100vw]  bg-black opacity-40" onClick={handleOutsideClick}></div>
                <div className="relative  flex h-auto max-h-[40rem]  min-h-[83vh] w-[41vw] flex-col  overflow-y-auto  rounded-xl bg-white ">
                    <div className=" sticky inset-0 mb-3 flex h-fit w-full items-center gap-4 bg-white/60  backdrop-blur-md  ">
                        <div className="  m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full  p-2 hover:bg-gray-200" onClick={onClose}>
                            <Cross className="  " />
                        </div>
                        <div className="text-xl font-bold">{type} by</div>
                    </div>

                    {list.length > 0 &&
                        list.map((item) => {
                            return (
                                <div onClick={() => navigateHandlerToProfile(item.handle)} key={item._id} className=" hover:bg-gray-100">
                                    <div className="mx-4 mt-2 flex flex-col gap-1 ">
                                        <div className="flex gap-3 ">
                                            {item.profile && item.profile.image && item.profile.image.url ? (
                                                <div className=" h-[3.2rem] w-full max-w-[3.2rem] items-center justify-center rounded-full   bg-gray-400">
                                                    <img src={item.profile.image.url} alt="profile image" className="h-full w-full rounded-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="relative  flex h-[3.2rem] min-w-[3.2rem] items-center justify-center  rounded-full bg-gray-200">
                                                    <svg className="  h-9 w-9 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="flex w-full items-start justify-between ">
                                                <div className=" flex flex-col align-top">
                                                    <div className="  text-[1.1rem] font-bold hover:underline">{item.name}</div>
                                                    <div className="">{`@${item.handle}`}</div>
                                                </div>
                                                {item._id !== state.user._id && (
                                                    <button
                                                        className={`group w-fit rounded-full   ${
                                                            state.user.following.includes(item._id) ? "border-2 bg-white text-black hover:border-red-200 hover:bg-red-100" : "bg-black text-white hover:text-gray-300 active:text-gray-400"
                                                        } px-4 py-2 font-bold `}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            followHandler(item._id);
                                                        }}>
                                                        {state.user.following.includes(item._id) ? (
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
                                        </div>
                                        <div className="ml-[4rem]   pb-5">{item.description}</div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default ModalForLikesRetweets;
