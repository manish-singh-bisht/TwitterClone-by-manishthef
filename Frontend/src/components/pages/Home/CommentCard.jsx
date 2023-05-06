import React from "react";
import Post from "./Post";
import CommentBox from "./CommentBox";
import { useGlobalContext } from "../../../CustomHooks/useGlobalContext";
import CommentLikeUnlike from "../../../context/Actions/CommentLikeUnlike";

const CommentCard = ({ comments, postId }) => {
    const { ACTIONS, state, dispatchCommentLikeUnlike } = useGlobalContext();
    const profile = state.user && state.user.profile && state.user.profile.image.url ? state.user.profile.image.url : null;
    return (
        <>
            <CommentBox profile={profile} postId={postId} />
            {comments &&
                comments.length > 0 &&
                comments.map((comment) => {
                    const ownerImage = comment.owner.profile && comment.owner.profile.image.url ? comment.owner.profile.image.url : null;
                    const commentVideo = comment.video && comment.video.url ? comment.video.url : null;

                    return (
                        <Post
                            key={comment._id}
                            isComment={true}
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
                            dispatch={dispatchCommentLikeUnlike}
                            state={state}
                            ACTIONS={ACTIONS}
                            handler={CommentLikeUnlike}
                        />
                    );
                })}
        </>
    );
};

export default CommentCard;
