import React, { Suspense, memo } from "react";
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
            <main className=" flex gap-3 overflow-auto xl:gap-8">
                <div className="hidden h-[100vh] w-[60vw] lg:block">
                    <img src="/twitter.jpg" alt="twitter logo" className="h-full" />
                </div>
                <div className="flex w-full flex-col justify-center  lg:w-[38vw]">
                    <div className="h-[70vh]flex flex-col  p-3 align-middle lg:p-0 lg:max-xl:mt-[-4rem]">
                        <div className="">
                            <TwitterIconInLoginSignupMainPage className="" />
                        </div>
                        <div className="relative mt-14 flex h-fit flex-col justify-between gap-5  py-16 lg:mt-10 lg:h-fit lg:py-0">
                            <div className="text-[3.5rem] font-bold leading-[4rem] lg:text-[4.5rem] lg:leading-none">Happening now</div>
                            <div className="text-3xl font-bold lg:text-4xl ">Join Twitter today.</div>
                            <div className="mt-[-1rem] italic text-gray-500  underline"> Generate dummy data in SignUp!!!</div>
                        </div>
                        <div className="mt-12 flex w-full flex-col gap-3 lg:mt-16 ">
                            <div
                                onClick={() => setIsSignUpVisible(true)}
                                className="flex h-16  w-full  cursor-pointer items-center justify-center rounded-[4rem] border-2 border-blue-200 bg-blue-400 font-bold  text-white hover:bg-blue-500 hover:text-black active:bg-blue-600 xl:w-[28.5rem]">
                                Sign up
                            </div>
                            <div
                                className="flex h-16 w-full cursor-pointer select-none items-center justify-center rounded-[4rem] border-2 border-blue-200 bg-white font-bold text-blue-400 hover:bg-gray-50 hover:text-black active:bg-gray-100 xl:w-[28.5rem] "
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

export default memo(LoginSignUpMainPage);
