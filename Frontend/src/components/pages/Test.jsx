import React, { useState } from "react";

export default function Test() {
    const [boxes, setBoxes] = useState([
        { id: 1, color: "bg-red-500" },
        { id: 2, color: "bg-green-500" },
        { id: 3, color: "bg-blue-500" },
        { id: 4, color: "bg-yellow-500" },
        { id: 5, color: "bg-purple-500" },
    ]);
    const [clickedBox, setClickedBox] = useState(null);

    const handleClick = (id) => {
        setClickedBox(id);
    };

    const boxStyles = "h-20 w-20 border border-black rounded-md  ";

    return (
        <div className=" -translate-y-[3rem]">
            {boxes.map((box, index) => (
                <div key={box.id} className={`${boxStyles} ${box.color} ${box.id === clickedBox ? "z-10 mb-[13rem]" : "z-0"}`} onClick={() => handleClick(box.id)} />
            ))}
        </div>
    );
}
