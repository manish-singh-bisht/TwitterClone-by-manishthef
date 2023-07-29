import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadUserWhenToken from "./context/actions/LoadUserWhenToken";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/Sidebar/Sidebar";
import Loader from "./components/Loader/Loader";
import { useGlobalContext } from "./CustomHooks/useGlobalContext";
import ExtendedMedia from "./components/CommonPostComponent/ExtendedMedia";
import SidebarRight from "./components/Sidebar/SidebarRight";

const Home = React.lazy(() => import("./components/Home/Home"));
const LoginSignUpMainPage = React.lazy(() => import("./components/Login_Register/LoginSignUpMainPage"));
const SignUpOption = React.lazy(() => import("./components/Login_Register/SignUpOption"));
const TweetDetail = React.lazy(() => import("./components/TweetDetail/TweetDetail"));
const CommentDetail = React.lazy(() => import("./components/comment/CommentDetail"));
const Test = React.lazy(() => import("./components/pages/Test"));
const ProfilePage = React.lazy(() => import("./components/Profile/ProfilePage"));
const BookMarkPage = React.lazy(() => import("./components/BookMarkPage/BookMarkPage"));
const Connect = React.lazy(() => import("./components/ConnectPeople/Connect"));

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
            <div className={`${isAuthenticated ? "grid grid-cols-[21rem_44vw_auto] gap-9 " : ""}`}>
                <div className="">{isAuthenticated && <Sidebar />}</div>
                <div>
                    <Suspense fallback={<Loader />}>
                        <Routes>
                            <Route exact path="/" element={isAuthenticated ? <Home /> : <LoginSignUpMainPage />} />
                            <Route exact path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginSignUpMainPage />} />
                            <Route exact path="/signUp" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginSignUpMainPage />} />
                            <Route exact path="/:ownerName/:postId" element={isAuthenticated ? <TweetDetail /> : <Navigate to="/login" replace />} />
                            <Route exact path="/:ownerName/comment/:commentId" element={isAuthenticated ? <CommentDetail /> : <Navigate to="/login" replace />} />
                            <Route exact path="/user/:ownerId" element={<Test />} />
                            <Route exact path="/Explore" element={<Test />} />
                            <Route exact path="/test" element={<Test />} />
                            <Route exact path="/ExtendedMedia" element={<ExtendedMedia />} />
                            <Route exact path="/Profile" element={<ProfilePage />} />
                            <Route exact path="/Connect" element={isAuthenticated ? <Connect /> : <Navigate to="/login" replace />} />
                            <Route exact path="/Bookmark" element={isAuthenticated ? <BookMarkPage /> : <Navigate to="/login" replace />} />
                        </Routes>
                    </Suspense>
                </div>
                <div className="">{isAuthenticated && <SidebarRight />}</div>
            </div>
            <ToastContainer />
        </BrowserRouter>
    );
};

export default App;
