import React from "react";

const CommentCard = ({ comment }) => {
    return (
        <>
            <div className="border-2 bg-red-400">{comment.comment}</div>
        </>
    );
};

export default CommentCard;
