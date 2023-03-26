import React from "react";

import Post from "./Post";

const Home = () => {
    return (
        <>
            <div className="   flex w-[43vw] flex-col gap-2 border-2 ">
                <h1 className="m-4 text-2xl font-bold">Home</h1>
            </div>
            <main className="grid grid-cols-[43vw_auto]  ">
                <div className="flex h-[100%]  flex-col border-l border-r">
                    <Post postId="fdsf" tweet="hi thre ists" ownerName="o name" ownerImage="oimage" />
                </div>
            </main>
        </>
    );
};

export default Home;
