import React from "react";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import FollowUser from "../../context/Actions/FollowUser";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

const HoverProfileCard = ({ description, name, handle, ownerId, profile }) => {
  const { state, dispatchFollowUser, ACTIONS, dispatch } = useGlobalContext();

  const followHandler = async (id) => {
    await FollowUser({ dispatchFollowUser, ACTIONS, id });
    const { data } = await axios.get(`${API_BASE_URL}/me`, {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    dispatch({
      type: ACTIONS.LOAD_SUCCESS,
      payload: { myProfile: data.myProfile, total: data.total },
    });
  };
  return (
    <>
      <div className="absolute z-30 ml-0 hidden w-[19.5rem] rounded-2xl border-2 bg-white p-2 drop-shadow-md md:block">
        <div className="flex justify-between">
          <div className="">
            {profile ? (
              <div className=" h-[4.2rem] w-[4.2rem] items-center justify-center rounded-full   bg-gray-400">
                <img
                  src={profile}
                  alt="profile image"
                  loading="lazy"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="relative m-1   flex h-[3.8rem] w-[3.8rem] items-center justify-center  rounded-full bg-gray-200">
                <svg
                  className="  h-12 w-12 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            )}
          </div>
          {ownerId !== state.user._id && (
            <button
              className={`group w-fit rounded-full   ${
                state.user.following.includes(ownerId)
                  ? "border-2 bg-white text-black hover:border-red-200 hover:bg-red-100"
                  : "bg-black text-white hover:text-gray-300 active:text-gray-400"
              } h-fit px-4 py-2 font-bold `}
              onClick={(e) => {
                e.stopPropagation();
                followHandler(ownerId);
              }}
            >
              {state.user.following.includes(ownerId) ? (
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
        <div className="flex flex-col px-2">
          <span className="text-xl font-bold">{name}</span>
          <span className="text-[0.9rem] text-gray-500">@{handle}</span>
        </div>
        <div className="mt-2 break-words px-2 text-base font-normal">
          {description}
        </div>
      </div>
    </>
  );
};

export default HoverProfileCard;
