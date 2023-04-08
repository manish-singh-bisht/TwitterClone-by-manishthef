import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadUserWhenToken from "./components/context/actions/LoadUserWhenToken";
import { useGlobalContext } from "./components/context/Context";
import Home from "./components/pages/Home";
import LoginSignUpMainPage from "./components/Login_Register/LoginSignUpMainPage";
import SignUpOption from "./components/Login_Register/SignUpOption";
import Sidebar from "./components/Sidebar/Sidebar";
import TweetDetail from "./components/pages/TweetDetail";
import Test from "./components/pages/Test";

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
                    <Routes>
                        <Route exact path="/" element={isAuthenticated ? <Home /> : <LoginSignUpMainPage />} />
                        <Route exact path={`${!isAuthenticated ? `/login` : ``}`} element={<LoginSignUpMainPage />} />
                        <Route exact path={`${!isAuthenticated ? `/signUp` : ``}`} element={<SignUpOption />} />
                        <Route exact path="/:ownerName/:postId" element={<TweetDetail />} />
                        <Route exact path="/user/:ownerId" element={<Test />} />
                        <Route exact path="/Explore" element={<Test />} />
                        <Route exact path="/test" element={<Test />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
