import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";

const TweetDetail = () => {
    //For navigating to a particular section that is to the tweet that openend this component.
    const navigate = useNavigate();
    const { postID } = useParams();
    function handleClick() {
        navigate("/", { state: { sectionId: postID }, replace: true });
    }

    return (
        <main className="grid grid-cols-[46vw_auto]  ">
            <div className="flex h-[100%] flex-col border-l border-r">
                <div className=" sticky inset-0 z-10 flex h-[3.5rem] items-center gap-10 bg-white/60 backdrop-blur-md ">
                    <div onClick={handleClick}>
                        <div className="m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:border-2 hover:bg-gray-200 active:bg-gray-300">
                            <AiOutlineArrowLeft className="h-[65%] w-[65%] " />
                        </div>
                    </div>
                    <div className="text-[1.6rem] font-bold">Tweet</div>
                </div>
                <div>
                    <div>Lorem iplat iure, blanditiis accusantium deleniti iste!</div>
                    <div></div>
                </div>
            </div>
        </main>
    );
};

export default TweetDetail;
