import React from "react";
import { useParams } from "react-router-dom";

const TweetDetail = () => {
    const { ownerName } = useParams();

    return <div>{ownerName}</div>;
};

export default TweetDetail;
