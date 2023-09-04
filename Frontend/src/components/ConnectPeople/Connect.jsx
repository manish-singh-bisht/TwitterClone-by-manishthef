import React, { useEffect, useState } from "react";
import { LeftArrow } from "../SVGs/SVGs";
import axios from "axios";
import Avatar from "../Avatar/Avatar";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import FollowUser from "../../context/Actions/FollowUser";
import InfiniteScrollWrapper from "../CommonPostComponent/InfiniteScrollWrapper";

const Connect = () => {
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();

    const { state, ACTIONS, dispatch, dispatchFollowUser } = useGlobalContext();

    useEffect(() => {
        window.scrollTo(0, 0);
        const getAllusers = async () => {
            const { data } = await axios.get(`http://localhost:4000/api/v1/users`, { withCredentials: true });
            setAllUsers(data.users);
        };
        if (window.location.pathname !== "/connect") {
            getAllusers();
        }
    }, []);

    const leftArrowHandler = () => {
        navigate("/");
    };

    const followHandler = async (id) => {
        await FollowUser({ dispatchFollowUser, ACTIONS, id });
        const { data } = await axios.get("http://localhost:4000/api/v1/me", { withCredentials: true });
        dispatch({ type: ACTIONS.LOAD_SUCCESS, payload: { myProfile: data.myProfile, total: data.total } });
    };

    const url = `http://localhost:4000/api/v1/users?page=`;

    return (
        <div className=" max-h-[full] min-h-[1400px]  border-l border-r">
            <div className=" sticky inset-0 z-10 flex h-[3.5rem] items-center gap-5 bg-white/60 backdrop-blur-md ">
                <div>
                    <div className="m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:border-2 hover:bg-gray-200 active:bg-gray-300" onClick={leftArrowHandler}>
                        <LeftArrow className="h-[65%] w-[65%] " />
                    </div>
                </div>
                <div className="text-[1.6rem] font-bold">Connect</div>
            </div>
            <div className="mx-5 my-2 text-[1.6rem] font-bold">Suggested for you</div>
            <InfiniteScrollWrapper dataLength={allUsers.length} url={url} setArray={setAllUsers}>
                {allUsers &&
                    allUsers.length > 0 &&
                    allUsers.map((user) => {
                        return (
                            <button className="flex w-full items-center justify-between  py-2 px-3 hover:bg-gray-50" key={user._id}>
                                <div className="flex w-full items-start gap-2">
                                    <div className="w-fit">
                                        <Avatar profile={user.profile && user.profile.image && user.profile.image.url ? user.profile.image.url : null} />
                                    </div>
                                    <div className="w-full ">
                                        <Link to={`/Profile/${user.handle}`} className="flex w-full flex-col  items-start ">
                                            <div className="text-[1.03rem] font-semibold hover:underline">{user.name}</div>
                                            <div className=" mt-[-0.2rem] text-gray-500">@{user.handle}</div>
                                            <div className="mt-[0.5rem] text-left ">{user.description}</div>
                                        </Link>
                                    </div>
                                </div>

                                {user._id !== state.user._id && (
                                    <button
                                        className={`group w-fit rounded-full   ${
                                            state.user.following.includes(user._id) ? "border-2 bg-white text-black hover:border-red-200 hover:bg-red-100" : "bg-black text-white hover:text-gray-300 active:text-gray-400"
                                        } px-4 py-2 font-bold `}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            followHandler(user._id);
                                        }}>
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
                            </button>
                        );
                    })}
            </InfiniteScrollWrapper>
        </div>
    );
};

export default Connect;
