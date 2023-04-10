import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useGlobalContext } from "../context/Context";
import GetPostById from "../context/actions/GetPostById";
import Loader from "./Loader";

function Test() {
    const postId = "64022360385e05dc0ed30ddb";
    const { ACTIONS, dispatchLikeUnlike, state, dispatchGetPostById, stateGetPostById } = useGlobalContext();
    async function GetPostByIdHandler() {
        await GetPostById({ dispatchGetPostById, ACTIONS, postId });
    }

    useEffect(() => {
        GetPostByIdHandler();
    }, []);

    const { post, loading } = stateGetPostById;
    if (!loading && post.likes !== undefined) {
        console.log(post.likes.length);
    }

    return <>{loading ? <Loader /> : <div>hi</div>}</>;
}

export default Test;
