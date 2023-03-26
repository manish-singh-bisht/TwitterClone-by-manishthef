import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import { Avatar } from "@mui/material";

const Tweet = ({ visibility, onClose }) => {
    if (!visibility) return;

    const [tweets, setTweets] = useState([""]);
    const [isThreadStarter, setIsThreadStarter] = useState(true);

    const handleChange = (e, index) => {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;

        const { value } = e.target;
        const updatedTweets = [...tweets];
        updatedTweets[index] = value;

        setTweets(updatedTweets);
    };

    const addTweet = () => {
        const updatedTweets = [...tweets];
        const newTweet = "";

        updatedTweets.push(newTweet);
        setTweets(updatedTweets);
        setIsThreadStarter(false);
    };

    const deletetTweet = (index) => {
        const updatedTweets = [...tweets];
        const removeTweet = updatedTweets.filter((_, i) => i !== index);

        if (removeTweet.length === 1) {
            setIsThreadStarter(true);
        }
        setTweets(removeTweet);
    };

    const handleTweet = () => {
        console.log(tweets);
    };

    const [active, setActive] = useState(null);

    const toggleBox = (index) => {
        if (active === index) {
            return ` `;
        } else {
            return ` `;
        }
    };

    const toggleActive = (index) => {
        setActive(index);
    };
    return (
        <div className="fixed inset-0  h-[100vh] w-[100vw] ">
            <div className=" fixed h-full w-full bg-black opacity-70"></div>

            <div className="relative left-[28rem] top-[4rem] flex h-auto max-h-[40rem]  min-h-[18rem] w-[35rem] flex-col overflow-y-auto rounded-lg bg-white">
                <div className=" h-fit w-full ">
                    <div className="  m-2 flex h-10 w-10 items-center justify-center rounded-full  p-2 hover:border-2 hover:bg-blue-100" onClick={onClose}>
                        <ImCross className="  " />
                    </div>
                </div>

                {tweets.map((tweet, index) => {
                    return (
                        <div key={index}>
                            <div className=" relative h-full  ">
                                <div className={`flex h-full w-full flex-col    `}>
                                    <div className="ml-3 flex  gap-2">
                                        <div className="h-full w-fit ">
                                            <Avatar />
                                        </div>

                                        <div className={`mb-3  text-right  ${toggleBox(index)}`}>
                                            {!isThreadStarter ? (
                                                <div className="">
                                                    <button
                                                        onClick={() => {
                                                            deletetTweet(index);
                                                        }}
                                                        className="w-fit  pr-2 text-right text-gray-200 hover:text-blue-300">
                                                        X
                                                    </button>
                                                </div>
                                            ) : null}
                                            <textarea
                                                onClick={() => toggleActive(index)}
                                                value={tweet}
                                                onChange={(e) => handleChange(e, index)}
                                                className=" min-h-[14.5rem] w-[29.5rem] resize-none overflow-hidden border-2 text-2xl outline-none"
                                                placeholder={isThreadStarter ? "What's Happening" : "Add Another Tweet"}></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="ml-[3.9rem] mt-3 w-[85%] border-[0.01rem] bg-gray-300"></div>
                <div className=" my-3 flex justify-end gap-5 ">
                    {tweets.every((tweet) => {
                        return tweet.length > 0;
                    }) && (
                        <button className=" w-fit rounded-full border-2 border-gray-200 px-3 py-1 font-bold text-blue-500 hover:bg-blue-100" onClick={addTweet}>
                            +
                        </button>
                    )}
                    {tweets.every((tweet) => {
                        return tweet.length > 0;
                    }) ? (
                        <button className="mr-2 w-fit rounded-3xl bg-blue-500  px-3 py-[0.2rem] font-bold text-white" onClick={handleTweet}>
                            {isThreadStarter ? "Tweet" : "Tweet all"}
                        </button>
                    ) : (
                        <button className="mr-2 w-fit rounded-3xl bg-gray-500  px-3 py-[0.2rem] font-bold text-white">{isThreadStarter ? "Tweet" : "Tweet all"}</button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Tweet;
