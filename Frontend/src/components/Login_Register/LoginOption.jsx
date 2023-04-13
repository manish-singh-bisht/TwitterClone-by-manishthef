import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserLogin from "../context/actions/UserLogin";
import { useGlobalContext } from "../CustomHooks/useGlobalContext";
import { CrossInLogin, TwitterIconInLogin } from "../pages/SVGs";

const LoginOption = ({ onClose, isLoginVisible }) => {
    if (!isLoginVisible) return null;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { dispatch, ACTIONS } = useGlobalContext();

    const handleLogin = async (e) => {
        e.preventDefault();
        await UserLogin({ email, password, dispatch, ACTIONS });
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
            <div className="flex h-[85vh] w-[45vw] rounded-xl bg-black ">
                <div className="m-[0.39rem] h-fit " onClick={onClose}>
                    <CrossInLogin className=" " />
                </div>

                <div className="flex w-full flex-col items-center  ">
                    <div className="flex h-[30vh] flex-col items-center justify-around ">
                        <TwitterIconInLogin className="" />
                        <p
                            className="m-4
                            text-[3rem] font-bold text-gray-100">
                            Sign in to Twitter
                        </p>
                    </div>

                    <form className="relative mt-12 flex flex-col gap-4 " onSubmit={handleLogin}>
                        <div>
                            <input
                                type="Email"
                                required
                                id="Email"
                                className="peer block  h-16 w-[23.5rem] rounded-md border-2 border-gray-700 bg-black p-2 pt-8  text-white  placeholder-transparent focus:border-blue-500 focus:outline-none"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                            <label
                                htmlFor="Email"
                                className="absolute top-1 left-[.60rem] text-sm text-blue-400 transition-all
                            peer-placeholder-shown:top-[1.2rem]
                            peer-placeholder-shown:text-base
                        peer-placeholder-shown:text-white peer-focus:top-1
                        peer-focus:text-sm
                        peer-focus:text-blue-400">
                                Email
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type="Password"
                                id="Password"
                                required
                                className="peer block h-16 w-[23.5rem] rounded-md border-2 border-gray-700 bg-black p-2 pt-8 text-white placeholder-transparent focus:border-blue-500 focus:outline-none"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            <label
                                htmlFor="Password"
                                className="absolute top-1
                                left-[.60rem] text-sm text-blue-400 transition-all peer-placeholder-shown:top-[1.26rem] peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400">
                                Password
                            </label>
                        </div>
                        <button className="h-9 rounded-[24rem] bg-gray-100 font-bold hover:bg-gray-200 active:bg-gray-300 ">Next</button>
                    </form>

                    <div className="mt-16 text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/signUp" className="text-blue-500">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginOption;
