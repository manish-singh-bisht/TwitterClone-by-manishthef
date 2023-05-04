import React from "react";
import Post from "./Post";

const CommentCard = ({ comment }) => {
    const ownerImage = comment.owner.profile && comment.owner.profile.image.url ? comment.owner.profile.image.url : null;
    const commentVideo = comment.video && comment.video.url ? comment.video.url : null;

    return (
        <>
            <Post
                key={comment._id}
                postId={comment._id}
                tweet={comment.comment}
                postImage={comment.images.url}
                postVideo={commentVideo}
                likes={comment.likes}
                comments={comment.comments}
                ownerName={comment.owner.name}
                ownerImage={ownerImage}
                ownerId={comment.owner._id}
                handle={comment.owner.handle}
                timeCreated={comment.createdAt}
            />
        </>
    );
};

export default CommentCard;
