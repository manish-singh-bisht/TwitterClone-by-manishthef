import React, { Suspense, useState } from "react";
import Avatar from "../Avatar/Avatar";
import EditorInHome from "../Editors/EditorInHome";
import { CircularRadialProgressForTweetTextLimit, Globe } from "../SVGs/SVGs";
import { v4 as uuidv4 } from "uuid";
import Loader from "../Loader/Loader";

const TweetModal = React.lazy(() => import("../Modal/TweetModal"));

const TweetBoxInHome = ({ profile }) => {
    const [showGlobe, setShowGlobe] = useState(false);
    const [singleTweet, setSingleTweet] = useState({ id: uuidv4(), text: "" });
    const [isTweetBoxOpen, setIsTweetBoxOpen] = useState(false);
    const [isTweetPress, setIsTweetPress] = useState(false); //for clearing the tweet box in home after the tweet button is pressed in home itself
    const [isTweetPressInTweetModal, setIsTweetPressInTweetModal] = useState(false); //for clearing the tweet box in home after the tweet button is pressed in tweetmodal

    const hideTwitterBox = () => {
        setIsTweetBoxOpen(false);
        document.body.style.overflow = "unset"; //makes the back of modal move again i.e set overflow to normal
    };
    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
            setIsTweetBoxOpen(false);
            document.body.style.overflow = "unset";
        }
    };

    //for keeping the globe and other related to show when editor is in focus for the first time
    const showGlobeHandler = () => {
        setShowGlobe(true);
    };

    const handleChange = (value) => {
        setSingleTweet({ ...singleTweet, text: value });
    };
    const handleTweet = () => {
        const newTweet = { id: uuidv4(), text: "" };
        setSingleTweet(newTweet);
        setIsTweetPress(true);
    };

    const handleIsTweetPressFalse = () => {
        setIsTweetPress(false);
    };
    const handleIsTweetPressInTweetModalFalse = () => {
        setIsTweetPressInTweetModal(false);
    };
    const handleIsTweetPressInTweetModalTrue = () => {
        setIsTweetPressInTweetModal(true);
    };
    return (
        <>
            <div className="  min-h-[7.5rem] border-b">
                <div className="m-2 flex  gap-2">
                    <div className="">
                        <Avatar profile={profile} />
                    </div>
                    <EditorInHome
                        showGlobeHandler={showGlobeHandler}
                        onChange={(value) => {
                            handleChange(value);
                        }}
                        isTweetPress={isTweetPress}
                        handleIsTweetPressFalse={handleIsTweetPressFalse}
                        isTweetPressInTweetModal={isTweetPressInTweetModal}
                        handleIsTweetPressInTweetModalFalse={handleIsTweetPressInTweetModalFalse}
                    />
                </div>
                {showGlobe && (
                    <>
                        <div className="mt-2 ml-[3.6rem] flex  w-[15rem]   ">
                            <div className="flex h-6  w-fit select-none items-center  gap-1 rounded-[1.8rem] px-3 text-[0.94rem] font-bold  text-blue-500 hover:bg-blue-100">
                                <Globe />
                                <p className="">Everyone can reply</p>
                            </div>
                        </div>
                        <div className=" ml-[4.6rem] mt-3 w-[85%] border-[0.01rem] bg-gray-300"></div>
                    </>
                )}

                <div className={` mx-5 mt-3 mb-2 flex justify-end gap-2 `}>
                    {singleTweet.text.length > 0 && (
                        <div className="flex gap-1">
                            <div className={`  h-[2.3rem] w-fit `}>{<CircularRadialProgressForTweetTextLimit tweetCount={singleTweet.text.length} maxCount={280} />}</div>
                            <div className="min-h-full border-l-2"></div>
                            <button
                                className=" h-9 w-9  rounded-full border-2 border-gray-200 font-bold text-blue-500 hover:bg-blue-100"
                                onClick={() => {
                                    setIsTweetBoxOpen(true);
                                    document.body.style.overflow = "hidden"; //makes the back of modal not move  i.e set overflow to hidden
                                }}>
                                +
                            </button>
                        </div>
                    )}
                    {singleTweet.text.length > 0 && singleTweet.text.length <= 280 ? (
                        <button className=" w-fit rounded-3xl bg-blue-500  px-3 py-[0.2rem] font-bold text-white" onClick={handleTweet}>
                            Tweet
                        </button>
                    ) : (
                        <button className="w-fit rounded-3xl bg-gray-500  px-3 py-[0.2rem] font-bold text-white">Tweet </button>
                    )}
                </div>
            </div>
            <Suspense fallback={<Loader />}>
                <TweetModal visibility={isTweetBoxOpen} onClose={hideTwitterBox} initialTweetFromOtherPartsOfApp={singleTweet.text} handleIsTweetPressInTweetModalTrue={handleIsTweetPressInTweetModalTrue} handleOutsideClick={handleOutsideClick} />
            </Suspense>
        </>
    );
};

export default TweetBoxInHome;
