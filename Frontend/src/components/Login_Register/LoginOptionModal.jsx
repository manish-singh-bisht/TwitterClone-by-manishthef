import React, { useState } from "react";
import UserLogin from "../../context/actions/UserLogin";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import { CrossInLogin, TwitterIconInLogin } from "../SVGs/SVGs";

const InputField = ({ type, id, placeholder, value, onChange }) => (
    <div className="relative">
        <input
            type={type}
            id={id}
            required
            className="peer block h-16 w-[23.5rem] rounded-md border-2 border-gray-700 bg-black p-2 pt-8 text-white placeholder-transparent focus:border-blue-500 focus:outline-none"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
        <label
            htmlFor={id}
            className="absolute top-1 left-[.60rem] text-sm text-blue-400 transition-all
      peer-placeholder-shown:top-[1.2rem]
      peer-placeholder-shown:text-base
      peer-placeholder-shown:text-white peer-focus:top-1
      peer-focus:text-sm
      peer-focus:text-blue-400">
            {placeholder}
        </label>
    </div>
);

const LoginOptionModal = ({ onClose, isLoginVisible, handleOutsideClick }) => {
    if (!isLoginVisible) return null;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { dispatch, ACTIONS } = useGlobalContext();

    const handleLogin = async (e) => {
        e.preventDefault();
        await UserLogin({ email, password, dispatch, ACTIONS });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="fixed h-full w-full bg-black opacity-70" onClick={handleOutsideClick}></div>
            <div className="z-10 flex h-[85vh] w-[45vw] rounded-xl bg-black">
                <div className="m-[0.39rem] h-fit " onClick={onClose}>
                    <CrossInLogin className=" " />
                </div>

                <div className="flex w-full flex-col items-center">
                    <div className="flex h-[30vh] flex-col items-center justify-around">
                        <TwitterIconInLogin className="" />
                        <p className="m-4 text-[3rem] font-bold text-gray-100">Log in to Twitter</p>
                    </div>

                    <form className="relative mt-12 flex flex-col gap-4" onSubmit={handleLogin}>
                        <InputField type="email" id="Email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <InputField type="password" id="Password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button className="h-9 rounded-[24rem] bg-gray-100 font-bold hover:bg-gray-200 active:bg-gray-300">Next</button>
                    </form>

                    <div className="mt-16 flex gap-2 text-gray-400">
                        <div>Don't have an account?</div>
                        <button onClick={onClose} className="cursor-pointer text-blue-500">
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginOptionModal;
