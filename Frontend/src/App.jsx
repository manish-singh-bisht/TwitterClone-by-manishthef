import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadUserWhenToken from "./components/context/actions/LoadUserWhenToken";

import Sidebar from "./components/Sidebar/Sidebar";
import Loader from "./components/pages/Loader";
import { useGlobalContext } from "./components/CustomHooks/useGlobalContext";

const Home = React.lazy(() => import("./components/pages/Home"));
const LoginSignUpMainPage = React.lazy(() => import("./components/Login_Register/LoginSignUpMainPage"));
const SignUpOption = React.lazy(() => import("./components/Login_Register/SignUpOption"));
const TweetDetail = React.lazy(() => import("./components/pages/TweetDetail"));
const Test = React.lazy(() => import("./components/pages/Test"));

const App = () => {
    const {
        dispatch,
        ACTIONS,
        state: { isAuthenticated },
    } = useGlobalContext();

    async function loadUser() {
        await LoadUserWhenToken({ dispatch, ACTIONS });
    }
    useEffect(() => {
        loadUser();
    }, []);

    return (
        <BrowserRouter>
            <div className={`${isAuthenticated ? "grid grid-cols-[24rem_auto] " : ""}`}>
                <div>{isAuthenticated && <Sidebar />}</div>
                <div>
                    <Suspense fallback={<Loader />}>
                        <Routes>
                            <Route exact path="/" element={isAuthenticated ? <Home /> : <LoginSignUpMainPage />} />
                            <Route exact path={`${!isAuthenticated ? `/login` : ``}`} element={<LoginSignUpMainPage />} />
                            <Route exact path={`${!isAuthenticated ? `/signUp` : ``}`} element={<SignUpOption />} />
                            <Route exact path="/:ownerName/:postId" element={<TweetDetail />} />
                            <Route exact path="/user/:ownerId" element={<Test />} />
                            <Route exact path="/Explore" element={<Test />} />
                            <Route exact path="/test" element={<Test />} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
