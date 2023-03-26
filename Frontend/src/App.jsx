import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadUserWhenToken from "./components/context/actions/LoadUserWhenToken";
import { useGlobalContext } from "./components/context/Context";
import Home from "./components/pages/Home";
import Login from "./components/Login_Register/Login";
import SignUpOption from "./components/Login_Register/SignUpOption";
import Sidebar from "./components/Sidebar/Sidebar";

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
                        <Route exact path="/" element={isAuthenticated ? <Home /> : <Login />} />
                        <Route exact path="/login" element={<Login />} />
                        <Route exact path="/signUp" element={<SignUpOption />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
