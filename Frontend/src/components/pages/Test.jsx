import React from "react";
import { useNavigate } from "react-router-dom";
import { Delete, PushPin, UserPlus } from "../SVGs/SVGs";

const Test = () => {
    const navigate = useNavigate();
    const nH = () => {
        navigate(-1);
    };
    return (
        <div>
            <button onClick={nH}>close</button>
        </div>
    );
};

export default Test;
