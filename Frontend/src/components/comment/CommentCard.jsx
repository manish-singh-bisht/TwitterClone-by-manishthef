import React from "react";
import CommentBox from "./CommentBox";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import CommentLikeUnlike from "../../context/Actions/CommentLikeUnlike";
import Post from "../CommonPostComponent/Post";

const CommentCard = ({ comments, postId, parent, fromTweetDetail, fromCommentDetail, isParentPresent, POSTID, mentionHandleCollection }) => {
    const { ACTIONS, state, dispatchCommentLikeUnlike } = useGlobalContext();
    const profile = state.user && state.user.profile && state.user.profile.image.url ? state.user.profile.image.url : null;

    return (
        <>
            {!isParentPresent && <CommentBox profile={profile} postId={postId} parent={parent} mentionHandleCollection={mentionHandleCollection} />}

            {comments &&
                comments.length > 0 &&
                comments.map((comment) => {
                    const ownerImage = comment.owner.profile && comment.owner.profile.image.url ? comment.owner.profile.image.url : null;
                    const commentVideo = comment.video && comment.video.url ? comment.video.url : null;

                    return (
                        <Post
                            key={comment._id}
                            comment={[comment]} //this is being passed from CommentDetail and is actually child comments of the active comments. its not actually being passed as props, comments is being passed as prop,comment is an instance of comments map.
                            isComment={true}
                            fromTweetDetail={fromTweetDetail}
                            fromCommentDetail={fromCommentDetail}
                            postId={comment._id} //this is the comment id
                            POSTID={fromTweetDetail ? postId : POSTID} //this is the post id
                            tweet={comment.comment}
                            postImage={comment.images.url}
                            postVideo={commentVideo}
                            likes={comment.likes}
                            comments={comment.comments}
                            commentsChildren={comment.children}
                            ownerName={comment.owner.name}
                            ownerImage={ownerImage}
                            ownerId={comment.owner._id}
                            handle={comment.owner.handle}
                            timeCreated={comment.createdAt}
                            dispatch={dispatchCommentLikeUnlike}
                            state={state}
                            ACTIONS={ACTIONS}
                            handler={CommentLikeUnlike}
                            mentions={comment.mentions}
                        />
                    );
                })}
        </>
    );
};

export default CommentCard;
