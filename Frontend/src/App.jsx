import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import Sidebar from "./components/Sidebar/Sidebar";
import Loader from "./components/Loader/Loader";
import { useGlobalContext } from "./CustomHooks/useGlobalContext";
import ExtendedMedia from "./components/CommonPostComponent/ExtendedMedia";
import SidebarRight from "./components/Sidebar/SidebarRight";
import LoadUserWhenToken from "./context/Actions/LoadUserWhenToken";
const Home = React.lazy(() => import("./components/Home/Home"));
const LoginSignUpMainPage = React.lazy(() => import("./components/Login_Register/LoginSignUpMainPage"));
const TweetDetail = React.lazy(() => import("./components/TweetDetail/TweetDetail"));
const CommentDetail = React.lazy(() => import("./components/comment/CommentDetail"));
const ProfilePage = React.lazy(() => import("./components/Profile/ProfilePage"));
const BookMarkPage = React.lazy(() => import("./components/BookMarkPage/BookMarkPage"));
const Connect = React.lazy(() => import("./components/ConnectPeople/Connect"));
const FollowersFollowingPage = React.lazy(() => import("./components/Profile/FollowersFollowingPage"));
const MessageHomePage = React.lazy(() => import("./components/Messages/MessageHomePage"));
import OfflineComponent from "./components/Offline/OfflineComponent";
import SideBarIconsOnly from "./components/Sidebar/SideBarIconsOnly";
import Page404 from "./components/404/Page404";

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

    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return (
        <BrowserRouter>
            <div className={`${isAuthenticated ? " gap-2  md:grid md:grid-cols-[8vw_92vw] lg:grid-cols-[6vw_63vw_auto]  xl:grid-cols-[21rem_44vw_auto] xl:gap-9 2xl:justify-center" : ""} `}>
                <div className="hidden xl:block">{isAuthenticated && <Sidebar isOnline={isOnline} />}</div>
                <div className="hidden md:block xl:hidden">{isAuthenticated && <SideBarIconsOnly isOnline={isOnline} />}</div>
                {isOnline ? (
                    <div>
                        <Suspense fallback={<Loader />}>
                            <Routes>
                                <Route exact path="/" element={isAuthenticated ? <Home /> : <LoginSignUpMainPage />} />
                                <Route exact path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginSignUpMainPage />} />
                                <Route exact path="/signUp" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginSignUpMainPage />} />
                                <Route exact path="/:ownerName/:postId" element={isAuthenticated ? <TweetDetail /> : <Navigate to="/login" replace />} />
                                <Route exact path="/:ownerName/comment/:commentId" element={isAuthenticated ? <CommentDetail /> : <Navigate to="/login" replace />} />
                                <Route exact path="/ExtendedMedia" element={<ExtendedMedia />} />
                                <Route exact path="/Profile/:userName" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
                                <Route exact path="/Connect" element={isAuthenticated ? <Connect /> : <Navigate to="/login" replace />} />
                                <Route exact path="/Bookmark" element={isAuthenticated ? <BookMarkPage /> : <Navigate to="/login" replace />} />
                                <Route exact path="/FollowersFollowingPage/:handle" element={isAuthenticated ? <FollowersFollowingPage /> : <Navigate to="/login" replace />} />
                                <Route exact path="/Messages" element={isAuthenticated ? <MessageHomePage /> : <Navigate to="/login" replace />} />
                                <Route path="*" element={isAuthenticated ? <Page404 /> : <Navigate to="/login" replace />} />
                            </Routes>
                        </Suspense>
                    </div>
                ) : (
                    <OfflineComponent />
                )}
                <div className="hidden lg:block">{isAuthenticated && <SidebarRight />}</div>
            </div>
            <ToastContainer />
        </BrowserRouter>
    );
};

export default App;
