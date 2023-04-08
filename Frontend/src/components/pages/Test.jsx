import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GetPostById from "../context/actions/GetAllUsers";
import { useGlobalContext } from "../context/Context";

function Test() {
    const postId = "64022360385e05dc0ed30ddb";
    const { ACTIONS, dispatchLikeUnlike, state, dispatchGetPostById, stateGetPostById } = useGlobalContext();
    async function GetPostByIdHandler() {
        await GetPostById({ dispatchGetPostById, ACTIONS, postId });
    }

    useEffect(() => {
        GetPostByIdHandler();
    }, []);

    const { post } = stateGetPostById;
    const likes = [post.likes];

    return (
        <>
            <div>hi</div>
        </>
    );
}

export default Test;
