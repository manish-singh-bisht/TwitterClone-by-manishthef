import React, { Suspense, useState } from "react";
import Avatar from "../Avatar/Avatar";
import EditorInHome from "../Editors/EditorInHome";
import { CircularRadialProgressForTweetTextLimit, Globe, Mention, PeopleYouFollow } from "../SVGs/SVGs";
import { v4 as uuidv4 } from "uuid";
import Loader from "../Loader/Loader";
import { MediaUploadPanelLong } from "../CommonPostComponent/MediaUploadPanel";
import WhoCanReplyModal from "../Modal/WhoCanReplyModal";
import useModal from "../../CustomHooks/useModal";

const TweetModal = React.lazy(() => import("../Modal/TweetModal"));

const TweetBoxInHome = ({ profile }) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [showGlobe, setShowGlobe] = useState(false);
    const [singleTweet, setSingleTweet] = useState({ id: uuidv4(), text: "" });
    const [isTweetPress, setIsTweetPress] = useState(false); //for clearing the tweet box in home after the tweet button is pressed in home itself
    const [isTweetPressInTweetModal, setIsTweetPressInTweetModal] = useState(false); //for clearing the tweet box in home after the tweet button is pressed in tweetmodal

    const [isTweetBoxOpen, setIsTweetBoxOpen, handleOutsideClick, hideTwitterBox] = useModal();
    const [visibility, setvisibility, handleOutsideClickWhoCanReply] = useModal();

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
    const deleteImages = (image) => {
        setSelectedImages((prev) => prev.filter((item) => item !== image));
    };

    const [whoCanReply, setWhoCanReply] = useState(1);

    //  1=everyone can reply
    //  2=people you follow can reply
    //  3=only mentioned can reply
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

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
                        deleteImages={deleteImages}
                        selectedImages={selectedImages}
                        setSelectedImages={setSelectedImages}
                        whoCanReply={whoCanReply}
                    />
                </div>
                {showGlobe && (
                    <>
                        <div
                            className="mt-2 ml-[3.6rem] flex     w-fit "
                            onClick={(e) => {
                                setvisibility(true);
                                document.body.style.overflow = "hidden";
                                const buttonRect = e.target.getBoundingClientRect();
                                const top = buttonRect.top + buttonRect.height;
                                const left = buttonRect.left;
                                setButtonPosition({ top, left });
                            }}>
                            <div className="flex h-6  w-fit select-none items-center  gap-1 rounded-[1.8rem] px-3 text-[0.94rem] font-bold  text-blue-500 hover:bg-blue-100">
                                {whoCanReply === 1 && (
                                    <>
                                        <Globe />
                                        <p className="">Everyone can reply</p>
                                    </>
                                )}
                                {whoCanReply === 2 && (
                                    <>
                                        <PeopleYouFollow />
                                        <p className="">People you follow can only reply</p>
                                    </>
                                )}
                                {whoCanReply === 3 && (
                                    <>
                                        <Mention />
                                        <p className="">People mentioned can only reply</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className=" ml-[4.6rem] mt-3 w-[85%] border-[0.01rem] bg-gray-300"></div>
                    </>
                )}
                <div className="flex h-fit items-center justify-between ">
                    <div className="ml-16">
                        <MediaUploadPanelLong setSelectedImages={setSelectedImages} selectedImages={selectedImages} />
                    </div>
                    <div className={` mx-5 mt-3 mb-2 flex w-fit justify-end gap-2`}>
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
            </div>
            <Suspense fallback={<Loader />}>
                <TweetModal
                    visibility={isTweetBoxOpen}
                    onClose={hideTwitterBox}
                    initialTweetFromOtherPartsOfApp={{ text: singleTweet.text, whoCanReply }}
                    handleIsTweetPressInTweetModalTrue={handleIsTweetPressInTweetModalTrue}
                    handleOutsideClick={handleOutsideClick}
                />
                <WhoCanReplyModal setvisibility={setvisibility} setWhoCanReply={setWhoCanReply} visibility={visibility} buttonPosition={buttonPosition} handleOutsideClickWhoCanReply={handleOutsideClickWhoCanReply} />
            </Suspense>
        </>
    );
};

export default TweetBoxInHome;
