import React, { Suspense, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LeftArrow } from "../../SVGs/SVGs";
import Avatar from "../Avatar";
import axios from "axios";
import Post from "./Post";
import { useGlobalContext } from "../../../CustomHooks/useGlobalContext";
import LikeUnlike from "../../../context/Actions/LikeUnlike";
import Loader from "../Loader";
import CommentLikeUnlike from "../../../context/Actions/CommentLikeUnlike";

const CommentCard = React.lazy(() => import("./CommentCard"));
const ActiveComment = React.lazy(() => import("./ActiveComment"));

const CommentDetail = () => {
    const componentRef = useRef(null); //when clicking on comment, it scrolls to the comment clicked and not to top.
    const { ACTIONS, state, dispatchLikeUnlike, stateComment, dispatchCommentLikeUnlike } = useGlobalContext();
    //For navigating to a particular section that is to the comment that openend this component.
    const navigate = useNavigate();
    const { commentId } = useParams();

    const [post, setPost] = useState();
    const [comment, setComment] = useState([]);
    const [parentCollection, setParentCollection] = useState([]); //for getting the parent/parents

    useEffect(() => {
        const getCommentById = async () => {
            const { data } = await axios.get(`http://localhost:4000/api/v1/comment/${commentId}`, { withCredentials: true });
            setPost(data.comment.post);
            setComment(data.comment);

            if (data.comment.parent !== undefined && !parentCollection.some((item) => item._id === data.comment.parent._id)) {
                setParentCollection((prevCollection) => [...prevCollection, data.comment.parent]);
            }
            console.log(parentCollection);
        };
        getCommentById();

        componentRef?.current?.scrollIntoView();
    }, [commentId, stateComment]);

    function handleClick() {
        navigate(`/${post.owner.name}/${post._id}`, {
            replace: true,
            state: { sectionId: commentId, tweet: post.tweet, handle: post.owner.handle, ownerName: post.owner.name, timeCreated: post.createdAt, ownerImage: post.owner.profile && post.owner.profile.image.url ? post.owner.profile.image.url : null },
        });
    }

    const photos = ["https://source.unsplash.com/random/1200x600", "https://source.unsplash.com/random/900x900"];
    //Grid layout for different numbers of image,used below
    let gridClass = "";
    switch (photos.length) {
        case 0:
            gridClass = "";
            break;
        case 1:
            gridClass = "w-full h-full";
            break;
        case 2:
            gridClass = "grid-cols-2 grid-rows-1";
            break;
        case 3:
            gridClass = "grid-cols-2 grid-rows-2";
            break;
        case 4:
            gridClass = "grid-cols-2 grid-rows-2";
            break;
        default:
            break;
    }

    const tv = 0;

    return (
        post !== undefined && (
            <main className="grid grid-cols-[44vw_auto]   ">
                <div className="flex h-[100%] min-h-screen flex-col  border-l  border-r">
                    <div className=" sticky inset-0 z-10 flex h-[3.5rem] items-center gap-7 bg-white/60 backdrop-blur-md ">
                        <div onClick={handleClick}>
                            <div className="m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:border-2 hover:bg-gray-200 active:bg-gray-300">
                                <LeftArrow className="h-[65%] w-[65%] " />
                            </div>
                        </div>
                        <div className="text-[1.6rem] font-bold">Tweet</div>
                    </div>
                    {/* Parent Post */}
                    <Post
                        key={post._id}
                        isComment={false}
                        postId={post._id}
                        tweet={post.tweet}
                        likes={post.likes}
                        ownerName={post.owner.name}
                        ownerImage={post.owner.profile && post.owner.profile.image.url ? post.owner.profile.image.url : null}
                        ownerId={post.owner._id}
                        handle={post.owner.handle}
                        timeCreated={post.createdAt}
                        handler={LikeUnlike}
                        dispatch={dispatchLikeUnlike}
                        state={state}
                        ACTIONS={ACTIONS}
                    />

                    {parentCollection &&
                        parentCollection.length > 0 &&
                        parentCollection.map((item) => {
                            return (
                                <Post
                                    key={item._id}
                                    isComment={true}
                                    postId={item._id}
                                    tweet={item.comment}
                                    likes={item.likes}
                                    ownerName={item.owner.name}
                                    ownerImage={item.owner.profile && item.owner.profile.image.url ? item.owner.profile.image.url : null}
                                    ownerId={item.owner._id}
                                    handle={item.owner.handle}
                                    timeCreated={item.createdAt}
                                    dispatch={dispatchCommentLikeUnlike}
                                    state={state}
                                    ACTIONS={ACTIONS}
                                    handler={CommentLikeUnlike}
                                />
                            );
                        })}

                    <Suspense fallback={<Loader />}>
                        <ActiveComment commentId={commentId} postId={post._id} parent={commentId} ref={componentRef} />

                        {comment.children && comment.children.length > 0 && <CommentCard comments={comment.children} postId={comment.children.post} parent={comment.children.parent} fromCommentDetail={true} isParentPresent={true} />}
                    </Suspense>
                </div>
            </main>
        )
    );
};

export default CommentDetail;