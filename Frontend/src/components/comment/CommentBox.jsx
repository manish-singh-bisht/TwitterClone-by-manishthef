import React, { useState } from "react";
import Avatar from "../Avatar/Avatar";
import EditorForComments from "../Editors/EditorForComments";
import { CircularRadialProgressForTweetTextLimit } from "../SVGs/SVGs";
import { v4 as uuidv4 } from "uuid";

const CommentBox = ({ profile, postId, parent, mentionHandleCollection }) => {
    const [comment, setComment] = useState({ id: uuidv4(), text: "" });
    const [isReplyPress, setIsReplyPress] = useState(false); //for clearing the comment box  after the reply button is pressed.
    const [showReplyingTo, setShowReplyingTo] = useState(false);

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
    return (
        <>
            <div className=" border-b ">
                {showReplyingTo && (
                    <div className="m-2 ml-[4.7rem] flex gap-1">
                        <span className="text-gray-500">Replying to</span>
                        {mentionHandleCollection.map((item, index) => {
                            return (
                                <span className="text-blue-500" key={index}>
                                    @{item}
                                </span>
                            );
                        })}
                    </div>
                )}
                <div className="m-2 flex gap-2 ">
                    <Avatar profile={profile} />
                    <EditorForComments
                        onChange={(value) => {
                            handleCommentChange(value);
                        }}
                        isReplyPress={isReplyPress}
                        handleIsReplyPressFalse={handleIsReplyPressFalse}
                        postId={postId}
                        parent={parent}
                        setShowReplyingToHandler={setShowReplyingToHandler}
                    />
                </div>
                <div className={` mx-5 mt-1 mb-2 flex justify-end gap-2 `}>
                    {comment.text.length > 0 && (
                        <div className="flex gap-1">
                            <div className={`  h-[2.3rem] w-fit `}>{<CircularRadialProgressForTweetTextLimit tweetCount={comment.text.length} maxCount={280} />}</div>
                        </div>
                    )}
                    {comment.text.length > 0 && comment.text.length <= 280 ? (
                        <button className=" w-fit rounded-3xl bg-blue-500  px-3 py-[0.2rem] font-bold text-white" onClick={handleReply}>
                            Reply
                        </button>
                    ) : (
                        <button className="w-fit rounded-3xl bg-gray-500  px-3 py-[0.2rem] font-bold text-white">Reply </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default CommentBox;
