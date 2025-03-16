import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { LeftArrow } from "../SVGs/SVGs";
import axios from "axios";
import Loader from "../Loader/Loader";
import Avatar from "../Avatar/Avatar";
import FollowUser from "../../context/Actions/FollowUser";
import InfiniteScrollWrapper from "../CommonPostComponent/InfiniteScrollWrapper";
import { API_BASE_URL } from "../../../config";

const FollowersFollowingPage = () => {
  const {
    setUsersForRightSidebar,
    state,
    dispatchFollowUser,
    ACTIONS,
    dispatch,
  } = useGlobalContext();
  const [followers, setfollowers] = useState([]);
  const [following, setfollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const { choice } = location.state;
  const [type, setType] = useState(choice);

  const params = useParams();
  const handle = params.handle;

  const navigate = useNavigate();
  const navigateHandler = () => {
    navigate(-1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "unset";
    setUsersForRightSidebar(null);

    const getFollowingFollowers = async (handle) => {
      if (type === "followers") {
        setLoading(true);
        const { data } = await axios.get(
          `${API_BASE_URL}/followers/${handle}`,
          {
            withCredentials: true,
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(data.userProfile);
        setfollowers(data.followers);
        setLoading(false);
      } else {
        setLoading(true);
        const { data } = await axios.get(
          `${API_BASE_URL}/following/${handle}`,
          {
            withCredentials: true,
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(data.userProfile);
        setfollowing(data.following);
        setLoading(false);
      }
    };

    getFollowingFollowers(handle);
  }, [type]);

  const url =
    type === "following"
      ? `${API_BASE_URL}/following/${handle}?page=`
      : `${API_BASE_URL}/followers/${handle}?page=`;
  return (
    <div className="h-[100%] min-h-[100vh] border-l border-r">
      <div className="sticky inset-0 z-10 flex h-fit   justify-between    bg-white/60  backdrop-blur-md ">
        <div className="flex w-full flex-col ">
          <div className="mx-2 flex items-center gap-10">
            <div
              className="w-fit rounded-full p-1 hover:cursor-pointer hover:bg-gray-300"
              onClick={navigateHandler}
            >
              <LeftArrow />
            </div>
            <div className="flex flex-col ">
              <span className="   text-2xl font-bold">{user?.name}</span>
              <span className="  text-sm text-gray-600">@{user?.handle}</span>
            </div>
          </div>
          <div className="flex h-16  w-full pt-2">
            <button
              className={`flex w-1/2 flex-col items-center justify-center text-center text-[1.1rem] font-bold  hover:bg-gray-300 ${type === "followers" ? "text-black" : "text-gray-500"}`}
              disabled={type === "followers"}
              onClick={() => {
                setType("followers");
              }}
            >
              Followers
              {type === "followers" && (
                <div className="  mt-[0.8rem] w-[3.4rem] rounded-3xl border-[0.15rem] border-blue-500  "></div>
              )}
            </button>
            <button
              className={`flex w-1/2 flex-col items-center justify-center text-center text-[1.1rem] font-bold  hover:bg-gray-300 ${type === "following" ? "text-black" : "text-gray-500"}`}
              disabled={type === "following"}
              onClick={() => {
                setType("following");
              }}
            >
              Following
              {type === "following" && (
                <div className="  mt-[0.8rem] w-[3.4rem] rounded-3xl border-[0.15rem] border-blue-500  "></div>
              )}
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : type === "followers" ? (
        <InfiniteScrollWrapper
          dataLength={followers.length}
          url={url}
          setArray={setfollowers}
        >
          {followers &&
            followers.length > 0 &&
            followers.map((item) => (
              <FollowersFollowingStructure
                key={item._id}
                dispatchFollowUser={dispatchFollowUser}
                user={item}
                state={state}
                ACTIONS={ACTIONS}
                dispatch={dispatch}
              />
            ))}{" "}
          {followers.length === 0 && type === "followers" && (
            <div className="mt-6 flex flex-col items-center justify-center ">
              <div className="flex w-[25rem] flex-col items-start">
                <span className="text-[1.9rem] font-bold">
                  <span className="break-all">
                    Looking for followers?
                    <br />
                  </span>
                </span>
                <span className="text-gray-600">
                  When someone follows this account, they'll show up here.
                  Tweeting and interacting with others helps boost followers.
                </span>
              </div>
            </div>
          )}
        </InfiniteScrollWrapper>
      ) : (
        <InfiniteScrollWrapper
          dataLength={following.length}
          url={url}
          setArray={setfollowing}
        >
          {following &&
            following.length > 0 &&
            following.map((item) => (
              <FollowersFollowingStructure
                key={item._id}
                dispatchFollowUser={dispatchFollowUser}
                state={state}
                user={item}
                ACTIONS={ACTIONS}
                dispatch={dispatch}
              />
            ))}
          {following.length === 0 && type === "following" && (
            <div className="mt-6 flex flex-col items-center justify-center ">
              <div className="flex w-[25rem] flex-col items-start">
                <span className="text-[1.9rem] font-bold">
                  @<span className="break-all">{user?.handle}</span> isn't
                  following anyone
                  <br />
                </span>
                <span className="text-gray-600">
                  Once they follow accounts, they'll show up here.
                </span>
              </div>
            </div>
          )}
        </InfiniteScrollWrapper>
      )}
    </div>
  );
};

export default FollowersFollowingPage;

export const FollowersFollowingStructure = ({
  user,
  state,
  dispatchFollowUser,
  ACTIONS,
  dispatch,
}) => {
  const navigate = useNavigate();

  const navigateHandlerToProfile = (handle) => {
    navigate(`/Profile/${handle}`);
  };

  const followHandler = async (id) => {
    await FollowUser({ dispatchFollowUser, ACTIONS, id });
    const { data } = await axios.get("${API_BASE_URL}/me", {
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
      <div
        onClick={() => navigateHandlerToProfile(user.handle)}
        className="flex cursor-pointer items-start gap-3 p-3 hover:bg-gray-100"
      >
        <div className="h-full w-fit">
          <Avatar
            profile={
              user.profile && user.profile.image && user.profile.image.url
                ? user.profile.image.url
                : null
            }
          />
        </div>
        <div className="flex w-full flex-col items-start gap-2 ">
          <span className="text-[1.1rem] font-bold hover:underline">
            {user.name.length > 8
              ? user.name.slice(0, 8).trim() + "..."
              : user.name}
          </span>
          <span className="-mt-[0.6rem] text-[0.92rem] text-gray-600">
            @
            {user.handle.length > 8
              ? user.handle.slice(0, 8).trim() + "..."
              : user.handle}
          </span>
          <div className="">{user.description}</div>
        </div>

        {user._id !== state.user._id && (
          <button
            className={`group w-fit rounded-full  ${
              state.user.following.includes(user._id)
                ? "border-2 bg-white text-black hover:border-red-200 hover:bg-red-100"
                : "bg-black text-white hover:text-gray-300 active:text-gray-400"
            } px-4 py-2 font-bold `}
            onClick={(e) => {
              e.stopPropagation();
              followHandler(user._id);
            }}
          >
            {state.user.following.includes(user._id) ? (
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
    </>
  );
};
