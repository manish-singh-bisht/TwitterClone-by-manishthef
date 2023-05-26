import React, { useCallback, useEffect, useState } from "react";
import { CircularRadialProgressForTweetTextLimit, Cross, Globe } from "../SVGs/SVGs";
import EditorForTweetModal from "../Editors/EditorForTweetModal";
import { v4 as uuidv4 } from "uuid";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import Avatar from "../pages/Avatar";

const TweetModal = ({ visibility, onClose, initialTweetFromOtherPartsOfApp, handleIsTweetPressInTweetModalTrue, handleOutsideClick }) => {
    if (!visibility) return;

    const { state } = useGlobalContext();
    const profile = state.user && state.user.profile && state.user.profile.image.url ? state.user.profile.image.url : null;

    const [tweets, setTweets] = useState([{ id: uuidv4(), text: "" }]);
    const [singleTweet, setSingleTweet] = useState(""); //For the circular progress bar
    const [isThreadStarter, setIsThreadStarter] = useState(true);

    //creates a new tweet if initialTweetFromOtherPartsOfApp!==null and initialTweetFromOtherPartsOfApp value is passed in editor, so that editor can display it.
    useEffect(() => {
        if (initialTweetFromOtherPartsOfApp !== null) {
            const newTweet = { id: uuidv4(), text: initialTweetFromOtherPartsOfApp };
            const updatedTweets = [...tweets, newTweet];
            setTweets(updatedTweets);
            initialTweetFromOtherPartsOfApp = null;
        }
    }, []);

    //will be passed in editor
    const height = "min-h-[10rem] ";
    const width = " w-[33rem]";
    const placeholder = initialTweetFromOtherPartsOfApp !== null ? "Add Another Tweet" : isThreadStarter ? "What's Happening" : "Add Another Tweet";

    const handleChange = (value, id) => {
        const updatedTweets = tweets.map((tweet) => (tweet.id === id ? { ...tweet, text: value } : tweet));
        setTweets(updatedTweets);
    };

    const deleteTweet = (id) => {
        const updatedTweets = tweets.filter((tweet) => tweet.id !== id);

        if (updatedTweets.length === 1) {
            setIsThreadStarter(true);
        }
        setTweets(updatedTweets);
    };
    const addTweet = () => {
        const newTweet = { id: uuidv4(), text: "" };
        const updatedTweets = [...tweets, newTweet];
        setTweets(updatedTweets);
        setIsThreadStarter(false);
    };

    const handleTweet = () => {
        console.log(tweets);
        if (initialTweetFromOtherPartsOfApp) {
            handleIsTweetPressInTweetModalTrue();
        }
        onClose();
    };

    const [active, setActive] = useState(null);

    const toggleActive = (id) => {
        setActive(id);
    };
    const toggleBox = (id) => {
        if (active === id) {
            return `  `;
        } else {
            return ``;
        }
    };

    const whenEditorInFocus = (id) => {
        toggleActive(id);
        setSingleTweet("");
    };

    return (
        <div className=" fixed inset-0  z-30 h-[100vh] w-[100vw] ">
            <div className="fixed  h-full w-full  bg-black opacity-70" onClick={handleOutsideClick}></div>

            <div className="relative left-[28rem] top-[4rem]  flex h-auto max-h-[40rem]  min-h-[18rem] w-[39.3rem] flex-col overflow-y-auto rounded-xl bg-white">
                <div className=" h-fit w-full ">
                    <div className="  m-2 flex h-10 w-10 cursor-pointer items-center justify-center  rounded-full p-2 hover:bg-blue-100" onClick={onClose}>
                        <Cross className="  " />
                    </div>
                </div>

                {tweets.map((tweet, index) => {
                    return (
                        <div key={tweet.id}>
                            <div className="    h-full ">
                                <div className={`flex h-full w-full flex-col    `}>
                                    <div className=" ml-3  flex gap-2">
                                        <Avatar profile={profile} />

                                        <div className={`${toggleBox(tweet.id)}  `}>
                                            {!isThreadStarter ? (
                                                <div className="text-right">
                                                    <button
                                                        onClick={() => {
                                                            deleteTweet(tweet.id);
                                                        }}
                                                        className="w-fit  pr-2 text-right text-gray-200 hover:text-blue-300">
                                                        X
                                                    </button>
                                                </div>
                                            ) : null}

                                            <EditorForTweetModal
                                                initialTweetFromOtherPartsOfApp={index === 0 && initialTweetFromOtherPartsOfApp} //so that only first instance of editor  displays the  initialTweetFromOtherPartsOfApp value and not all instances of editor.
                                                height={height}
                                                width={width}
                                                placeholder={placeholder}
                                                whenEditorInFocus={() => whenEditorInFocus(tweet.id)}
                                                onClick={(tweet) => {
                                                    toggleActive(tweet.id);
                                                    setSingleTweet(tweet);
                                                }}
                                                onChange={(value) => {
                                                    handleChange(value, tweet.id);
                                                    setSingleTweet(value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="mt-4 ml-[3.6rem] flex  w-[15rem]   ">
                    <div className="flex h-6  w-fit select-none items-center  gap-1 rounded-[1.8rem] px-3 text-[0.94rem] font-bold  text-blue-500 hover:bg-blue-100">
                        <Globe />
                        <p className="">Everyone can reply</p>
                    </div>
                </div>
                <div className=" ml-[4.6rem] mt-3 w-[85%] border-[0.01rem] bg-gray-300"></div>
                <div className={` my-3 mx-5 flex justify-end gap-2 `}>
                    {tweets.every((tweet) => {
                        return tweet.text.length > 0;
                    }) && (
                        <div className="flex gap-1">
                            <div className={`  h-[2.3rem] w-fit `}>{<CircularRadialProgressForTweetTextLimit tweetCount={singleTweet.length} maxCount={280} />}</div>
                            <div className="min-h-full border-l-2"></div>
                            <button className=" h-9 w-9  rounded-full border-2 border-gray-200 font-bold text-blue-500 hover:bg-blue-100" onClick={addTweet}>
                                +
                            </button>
                        </div>
                    )}
                    {tweets.every((tweet) => {
                        return tweet.text.length > 0 && tweet.text.length <= 280;
                    }) ? (
                        <button className=" w-fit rounded-3xl bg-blue-500  px-3 py-[0.2rem] font-bold text-white" onClick={handleTweet}>
                            {initialTweetFromOtherPartsOfApp !== null ? "Tweet all" : isThreadStarter ? "Tweet" : "Tweet all"}
                        </button>
                    ) : (
                        <button className="w-fit rounded-3xl bg-gray-500  px-3 py-[0.2rem] font-bold text-white">{initialTweetFromOtherPartsOfApp !== null ? "Tweet all" : isThreadStarter ? "Tweet" : "Tweet all"}</button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default TweetModal;
