import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginOptionModal from "./LoginOptionModal";
import { TwitterIconInLoginSignupMainPage } from "../SVGs/SVGs";

const LoginSignUpMainPage = () => {
    const [isLoginVisible, setIsLoginVisible] = useState(false);
    const hideLogin = () => {
        setIsLoginVisible(false);
    };

    return (
        <>
            <main className=" flex gap-8">
                <div className=" w-[60vw]">
                    <img src="./Public/logo/twitter.jpg" alt="twitter logo" className="h-[46.5rem] " />
                </div>
                <div className="flex w-[38vw] flex-col justify-center ">
                    <div className="h-[70vh] ">
                        <div className="">
                            <TwitterIconInLoginSignupMainPage className="" />
                        </div>
                        <div className="mt-14 flex h-[35%] flex-col justify-between ">
                            <div className="text-[4.5rem] font-bold">Happening now</div>
                            <div className="text-4xl font-bold ">Join Twitter today.</div>
                        </div>
                        <div className="mt-12 flex flex-col gap-3">
                            <Link to="/signUp" className="  flex  h-16 w-[25.5rem] items-center justify-center rounded-[4rem] border-2 border-blue-200 bg-blue-400  font-bold text-white hover:bg-blue-500 hover:text-black active:bg-blue-600">
                                Sign up
                            </Link>
                            <div
                                className="flex h-16 w-[25.5rem] cursor-pointer select-none items-center justify-center rounded-[4rem] border-2 border-blue-200 bg-white font-bold text-blue-400 hover:bg-gray-50 hover:text-black active:bg-gray-100 "
                                onClick={() => setIsLoginVisible(true)}>
                                Log in
                            </div>

                            <LoginOptionModal onClose={hideLogin} isLoginVisible={isLoginVisible} />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default LoginSignUpMainPage;
