import React, { Suspense, useState } from "react";
import { TwitterIconInLoginSignupMainPage } from "../SVGs/SVGs";
import Loader from "../Loader/Loader";
import useModal from "../../CustomHooks/useModal";

const SignUpOption = React.lazy(() => import("./SignUpOption"));
const LoginOptionModal = React.lazy(() => import("./LoginOptionModal"));

const LoginSignUpMainPage = () => {
    const [isLoginVisible, setIsLoginVisible, handleOutsideClick, hideLogin] = useModal();
    const [isSignUpVisible, setIsSignUpVisible, handleOutsideClickSignup, hideSignUp] = useModal();

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
                            <div
                                onClick={() => setIsSignUpVisible(true)}
                                className="flex  h-16  w-[25.5rem] cursor-pointer items-center justify-center rounded-[4rem] border-2 border-blue-200 bg-blue-400  font-bold text-white hover:bg-blue-500 hover:text-black active:bg-blue-600">
                                Sign up
                            </div>
                            <div
                                className="flex h-16 w-[25.5rem] cursor-pointer select-none items-center justify-center rounded-[4rem] border-2 border-blue-200 bg-white font-bold text-blue-400 hover:bg-gray-50 hover:text-black active:bg-gray-100 "
                                onClick={() => setIsLoginVisible(true)}>
                                Log in
                            </div>

                            <Suspense loader={<Loader />}>
                                <LoginOptionModal onClose={hideLogin} isLoginVisible={isLoginVisible} handleOutsideClick={handleOutsideClick} />
                                <SignUpOption onClose={hideSignUp} isSignUpVisible={isSignUpVisible} handleOutsideClickSignup={handleOutsideClickSignup} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default LoginSignUpMainPage;
