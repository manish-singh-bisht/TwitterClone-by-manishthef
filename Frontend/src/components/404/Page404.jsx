import React from "react";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
    const navigate = useNavigate();

    const goHomeHanlder = () => {
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center text-xl font-bold">
            <div>Hmm...this page doesn't exist. Try searching for something else.</div>
            <button className="mt-5 rounded-full bg-blue-300 py-2 px-4 hover:bg-blue-400 hover:text-black active:bg-sky-500" onClick={() => goHomeHanlder()}>
                Home
            </button>
        </div>
    );
};

export default Page404;
