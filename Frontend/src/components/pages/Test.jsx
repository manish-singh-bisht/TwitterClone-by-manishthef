import React, { useState } from "react";

function Test() {
    const photos = ["https://source.unsplash.com/random/1200x600", "https://source.unsplash.com/random/900x1000", "https://source.unsplash.com/random/1500x1600"];
    const photoLayouts = [
        { colSpan: 2, rowSpan: 2, topLeft: true },
        { colSpan: 1, rowSpan: 2, topRight: true },
        { colSpan: 1, rowSpan: 1, bottomLeft: true },
        { colSpan: 1, rowSpan: 1, bottomRight: true },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo, index) => {
                const layout = photoLayouts[index];
                const classes = [];

                if (layout.topLeft) {
                    classes.push("rounded-t-md");
                } else if (layout.topRight) {
                    classes.push("rounded-t-md", "rounded-r-md");
                } else if (layout.bottomLeft) {
                    classes.push("rounded-b-md", "rounded-l-md");
                } else if (layout.bottomRight) {
                    classes.push("rounded-b-md", "rounded-r-md");
                } else {
                    classes.push("rounded-md");
                }

                return (
                    <div key={index} className={`col-span-${layout.colSpan} row-span-${layout.rowSpan}`}>
                        <img src={photo} alt={`Photo ${index + 1}`} className={`h-full w-full object-cover ${classes.join(" ")}`} />
                    </div>
                );
            })}
        </div>
    );
}

export default Test;
