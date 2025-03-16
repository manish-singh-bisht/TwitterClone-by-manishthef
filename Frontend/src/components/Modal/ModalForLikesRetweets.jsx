import React from "react";
import { Cross } from "../SVGs/SVGs";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import FollowUser from "../../context/Actions/FollowUser";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

const ModalForLikesRetweets = ({
  visibility,
  onClose,
  type,
  list,
  handleOutsideClick,
}) => {
  if (!visibility) return;

  const { state, ACTIONS, dispatch, dispatchFollowUser } = useGlobalContext();

  const navigate = useNavigate();

  const navigateHandlerToProfile = (handle) => {
    navigate(`/Profile/${handle}`);
  };
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
      <div className="fixed inset-0 z-40 flex  h-[100%] w-[100%] items-center justify-center">
        <div
          className="fixed h-[100vh] w-[100vw]  bg-black opacity-40"
          onClick={handleOutsideClick}
        ></div>
        <div className="relative  flex h-[100%] w-[100%] flex-col overflow-y-auto  rounded-xl bg-white lg:h-auto  lg:max-h-[40rem]  lg:min-h-[83vh] lg:w-[41vw] ">
          <div className=" sticky inset-0 z-40 mb-3 flex h-fit w-full items-center gap-4 bg-white/60  backdrop-blur-md  ">
            <div
              className="  m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full  p-2 hover:bg-gray-200"
              onClick={onClose}
            >
              <Cross className="  " />
            </div>
            <div className="text-xl font-bold">{type} by</div>
          </div>

          {list.length > 0 &&
            list.map((item) => {
              return (
                <div
                  onClick={() => navigateHandlerToProfile(item.handle)}
                  key={item._id}
                  className=" hover:bg-gray-100"
                >
                  <div className="mx-1 mt-1 flex flex-col gap-1 md:mx-4 md:mt-2 ">
                    <div className="flex gap-2 md:gap-3 ">
                      {item.profile &&
                      item.profile.image &&
                      item.profile.image.url ? (
                        <div className=" h-[2.8rem] min-w-[2.8rem]   rounded-full bg-gray-400 md:h-[3.2rem] md:w-full   md:max-w-[3.2rem]">
                          <img
                            src={item.profile.image.url}
                            alt="profile image"
                            className="h-full w-full rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="relative flex h-[2.8rem] min-w-[2.8rem] items-center justify-center rounded-full bg-gray-200  md:h-[3.2rem] md:min-w-[3.2rem]">
                          <svg
                            className="  h-9 w-9 text-gray-400"
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
                      <div className="flex w-full items-start justify-between ">
                        <div className=" flex flex-col align-top">
                          <div className=" hidden text-[1.1rem] font-bold hover:underline md:block">
                            {item.name}
                          </div>
                          <div className="hidden md:block">{`@${item.handle}`}</div>

                          <div className="  text-[1.1rem] font-bold hover:underline  md:hidden">
                            {item.name.length > 8
                              ? item.name.slice(0, 8).trim() + "..."
                              : item.name}
                          </div>
                          <div className="md:hidden ">
                            @
                            {item.handle.length > 8
                              ? item.handle.slice(0, 8).trim() + "..."
                              : item.handle}
                          </div>
                        </div>
                        {item._id !== state.user._id && (
                          <button
                            className={`group w-fit rounded-full   ${
                              state.user.following.includes(item._id)
                                ? "border-2 bg-white text-black hover:border-red-200 hover:bg-red-100"
                                : "bg-black text-white hover:text-gray-300 active:text-gray-400"
                            } px-4 py-2 font-bold `}
                            onClick={(e) => {
                              e.stopPropagation();
                              followHandler(item._id);
                            }}
                          >
                            {state.user.following.includes(item._id) ? (
                              <>
                                <span className="group-hover:hidden">
                                  Following
                                </span>
                                <span className="hidden group-hover:block">
                                  Unfollow
                                </span>
                              </>
                            ) : (
                              <span>Follow</span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="pb-5   md:ml-[4rem]">
                      {item.description}
                    </div>
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
