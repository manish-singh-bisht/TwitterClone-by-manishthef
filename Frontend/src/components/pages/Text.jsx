import React, { useState, useRef, useEffect } from "react";
import { ImCross } from "react-icons/im";
import { Avatar } from "@mui/material";

const Text = ({ visibility, onClose }) => {
    const [tweets, setTweets] = useState([""]);
    const [isThreadStarter, setIsThreadStarter] = useState(true);
    const tweetContainerRef = useRef(null);

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

    const deleteTweet = (index) => {
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
            return `h-56 z-10`;
        } else {
            return `opacity-50 absolute`;
        }
    };

    const toggleActive = (index) => {
        setActive(index);
    };

    return (
        <div className={`fixed inset-0 h-screen w-screen ${visibility ? "" : "hidden"}`}>
            <div className="fixed h-full w-full bg-black opacity-70" onClick={onClose}></div>

            <div className="relative left-1/2 top-1/2 flex max-h-[90%] w-[35rem] -translate-x-1/2 -translate-y-1/2 transform flex-col overflow-hidden rounded-lg bg-white">
                <div className="flex h-10 items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10">
                            <Avatar />
                        </div>
                        <textarea
                            className="w-full resize-none border-2 text-2xl outline-none"
                            value={tweets[0]}
                            onChange={(e) => handleChange(e, 0)}
                            placeholder={isThreadStarter ? "What's Happening" : "Add Another Tweet"}
                            onClick={() => toggleActive(0)}
                            style={{ height: "auto", maxHeight: "14.5rem" }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {tweets.every((tweet) => tweet.length > 0) && (
                            <button className="rounded-full border-2 border-gray-200 px-3 py-1 font-bold text-blue-500 hover:bg-blue-100" onClick={addTweet}>
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
        </div>
    );
};
export default Text;
