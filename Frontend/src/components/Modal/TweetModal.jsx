import React, { useState } from "react";
import { CircularRadialProgressForTweetTextLimit, Cross } from "../pages/SVGs/SVGs";
import EditorForTweetModal from "../Editors/EditorForTweetModal";
import { v4 as uuidv4 } from "uuid";

const TweetModal = ({ visibility, onClose }) => {
    if (!visibility) return;

    const [tweets, setTweets] = useState([{ id: uuidv4(), text: "" }]);
    const [singleTweet, setSingleTweet] = useState(""); //For the circular progress bar
    const [isThreadStarter, setIsThreadStarter] = useState(true);

    //will be passed in editor
    const height = "min-h-[13rem] ";
    const width = " w-[33rem]";
    const placeholder = isThreadStarter ? "What's Happening" : "Add Another Tweet";

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

    const profile = "";
    return (
        <div className=" fixed  inset-0 h-[100vh] w-[100vw] ">
            <div className="fixed  h-full w-full  bg-black opacity-70"></div>

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
                                        {profile ? (
                                            <div className=" h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full   bg-gray-400">
                                                <img src={profile} alt="profile image" className="h-full w-full rounded-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="relative  flex h-[3.2rem] w-[3.2rem] items-center justify-center  rounded-full bg-gray-200">
                                                <svg className="  h-9 w-9 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        )}

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
                <div className=" ml-[4.6rem] mt-4  w-[85%] border-[0.01rem] bg-gray-300"></div>
                <div className={` my-3 mx-5 flex justify-end gap-2 border-2`}>
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
                        return tweet.text.length > 0 && tweet.text.length < 280;
                    }) ? (
                        <button className=" w-fit rounded-3xl bg-blue-500  px-3 py-[0.2rem] font-bold text-white" onClick={handleTweet}>
                            {isThreadStarter ? "Tweet" : "Tweet all"}
                        </button>
                    ) : (
                        <button className="w-fit rounded-3xl bg-gray-500  px-3 py-[0.2rem] font-bold text-white">{isThreadStarter ? "Tweet" : "Tweet all"}</button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default TweetModal;