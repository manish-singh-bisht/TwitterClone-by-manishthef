import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import { FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/Context";
import UserLogin from "../context/actions/UserLogin";

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
                <div className="m-4 h-6 w-6 ">
                    <ImCross className="  cursor-pointer  text-white hover:text-lg" onClick={onClose} />
                </div>

                <div className="flex w-full flex-col items-center  ">
                    <div className="flex h-[30vh] flex-col items-center justify-around ">
                        <FaTwitter className="m-2 h-10 w-10 text-gray-200" />
                        <p
                            className="m-4
                            text-[3rem] font-bold text-gray-100">
                            Sign in to Twitter
                        </p>
                    </div>

                    <form className="mt-12 flex flex-col gap-4 " onSubmit={handleLogin}>
                        <input
                            type="Email"
                            required
                            className="h relative block h-16 w-[23.5rem] border-2 border-gray-700 bg-black p-2  text-white focus:border-blue-500 focus:outline-none"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />

                        <input
                            type="Password"
                            required
                            className="block h-16 w-[23.5rem] border-2 border-gray-700 bg-black p-2 text-white focus:border-blue-500 focus:outline-none"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />

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
