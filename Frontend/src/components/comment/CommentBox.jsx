import React, { useState } from "react";
import Avatar from "../Avatar/Avatar";
import EditorForComments from "../Editors/EditorForComments";
import { CircularRadialProgressForTweetTextLimit } from "../SVGs/SVGs";
import { v4 as uuidv4 } from "uuid";
import { MediaUploadPanelLong } from "../CommonPostComponent/MediaUploadPanel";

const CommentBox = ({ profile, postId, parent, mentionHandleCollection, fromActiveComment }) => {
    const [comment, setComment] = useState({ id: uuidv4(), text: "" });
    const [isReplyPress, setIsReplyPress] = useState(false); //for clearing the comment box  after the reply button is pressed.
    const [showReplyingTo, setShowReplyingTo] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    const setShowReplyingToHandler = () => {
        setShowReplyingTo(true);
    };

    const handleReply = async () => {
        // await PostComments({ dispatchComment, ACTIONS, postId, comment: comment.text, parent });=> this should have been here, but is in the editorForComments component
        const newComment = { id: uuidv4(), text: "" };
        setComment(newComment);
        setIsReplyPress(true);
        setShowReplyingTo(false);
    };
    const handleCommentChange = (value) => {
        setComment({ ...comment, text: value });
    };
    const handleIsReplyPressFalse = () => {
        setIsReplyPress(false);
    };
    const deleteImages = (image) => {
        setSelectedImages((prev) => prev.filter((item) => item !== image));
    };
    return (
        <>
            <div className=" border-b ">
                {showReplyingTo && (
                    <div className="m-2 ml-[2rem] flex flex-wrap gap-1 md:ml-[4.7rem] ">
                        {mentionHandleCollection.length > 0 && <span className="text-gray-500">Replying to</span>}
                        {mentionHandleCollection.map((item, index) => {
                            return (
                                <span className="text-blue-500" key={index}>
                                    @{item}
                                </span>
                            );
                        })}
                    </div>
                )}
                <div className="m-2 flex gap-2  ">
                    <div className="hidden md:block">
                        <Avatar profile={profile} />
                    </div>
                    <EditorForComments
                        onChange={(value) => {
                            handleCommentChange(value);
                        }}
                        isReplyPress={isReplyPress}
                        handleIsReplyPressFalse={handleIsReplyPressFalse}
                        postId={postId}
                        parent={parent}
                        setShowReplyingToHandler={setShowReplyingToHandler}
                        selectedImages={selectedImages}
                        setSelectedImages={setSelectedImages}
                        deleteImages={deleteImages}
                        fromActiveComment={fromActiveComment}
                    />
                </div>
                <div className="flex h-fit items-center min-[320px]:justify-around sm:justify-between">
                    <div className="min-[425px]:ml-[1.5rem] md:ml-16">
                        <MediaUploadPanelLong setSelectedImages={setSelectedImages} selectedImages={selectedImages} />
                    </div>{" "}
                    <div className={`mt-1 mb-2 flex justify-end md:mx-5 md:gap-2 `}>
                        {comment.text.length > 0 && (
                            <div className="flex gap-1 ">
                                <div className={`  h-[2.3rem] w-fit `}>{<CircularRadialProgressForTweetTextLimit tweetCount={comment.text.length} maxCount={280} />}</div>
                            </div>
                        )}
                        {comment.text.length > 0 && comment.text.length <= 280 ? (
                            <button className=" w-fit rounded-3xl bg-blue-500  py-[0.2rem] px-1 font-bold text-white md:px-3" onClick={handleReply}>
                                Reply
                            </button>
                        ) : (
                            <button className="w-fit rounded-3xl bg-gray-500 px-1  py-[0.2rem] font-bold text-white md:px-3">Reply </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CommentBox;
