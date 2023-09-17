import React, { useState } from "react";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import { CrossInLogin, TwitterIconInLogin } from "../SVGs/SVGs";
import { toast } from "react-toastify";
import UserSignUp from "../../context/Actions/UserSignUp";

const InputField = ({ name, type, placeholder, value, onChange, max = 26 }) => (
    <div className="relative">
        <input
            type={type}
            id={name}
            name={name}
            required
            className="peer block h-16 w-[110%] rounded-md border-2 border-gray-700 bg-black p-2 pt-8 text-white placeholder-transparent focus:border-blue-500 focus:outline-none md:w-[23.5rem]"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            maxLength={max}
        />
        <label
            htmlFor={name}
            className="absolute top-1 left-[.60rem] text-sm text-blue-400 transition-all peer-placeholder-shown:top-[1.26rem] peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400">
            {placeholder}
        </label>
    </div>
);

const SignUpOption = ({ onClose, isSignUpVisible, handleOutsideClickSignup }) => {
    if (!isSignUpVisible) return null;

    const [data, setData] = useState({
        name: null,
        email: null,
        handle: null,
        password: null,
        confirmPassword: null,
    });

    const { dispatch, ACTIONS } = useGlobalContext();

    const handleSignUp = async (e) => {
        e.preventDefault();
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
        if (data.password !== data.confirmPassword) {
            toast("Passwords do not match", toastConfig);
            return;
        }

        if (data.password !== data.confirmPassword) {
            toast("Passwords do not match", toastConfig);
            return;
        }
        if (data.handle.includes("@")) {
            toast("Handle cannot contain @", toastConfig);
            return;
        }

        await UserSignUp({ name: data.name, email: data.email, password: data.password, handle: data.handle, dispatch, ACTIONS });
    };

    const dataHandler = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="fixed h-full w-full bg-black opacity-70" onClick={handleOutsideClickSignup}></div>
            <div className="relative z-10 flex  h-full w-full rounded-xl bg-black lg:w-[45vw] 2xl:h-[60%] 2xl:w-[40%]">
                <div className="z-20 m-[0.39rem] h-fit" onClick={onClose}>
                    <CrossInLogin className=" " />
                </div>

                <div className="absolute flex h-full w-full  flex-col items-center">
                    <div className="flex h-fit flex-col items-center justify-around ">
                        <TwitterIconInLogin className="" />
                        <p className="mx-4 text-[2rem] font-bold text-gray-100 md:mt-4  xl:text-[3rem]">Sign up to Twitter</p>
                    </div>

                    <form className="relative mt-6 flex flex-col gap-4 xl:mt-12 " onSubmit={handleSignUp}>
                        <InputField name="email" type="email" placeholder="Email" value={data.email} onChange={dataHandler} />
                        <InputField name="password" type="password" placeholder="Password" value={data.password} onChange={dataHandler} />
                        <InputField name="confirmPassword" type="password" placeholder="Confirm Password" value={data.confirmPassword} onChange={dataHandler} />
                        <InputField name="name" type="text" placeholder="Name" value={data.name} onChange={dataHandler} />
                        <InputField name="handle" type="text" placeholder="@Handle" value={data.handle} onChange={dataHandler} />
                        <button className="h-9 w-[110%] rounded-[24rem] bg-gray-100 font-bold hover:bg-gray-200 active:bg-gray-300 md:w-full">Next</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpOption;
