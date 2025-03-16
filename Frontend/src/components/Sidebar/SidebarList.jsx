import React from "react";

const SidebarList = ({ Icon, Option }) => {
    return (
        <>
            <section className=" flex w-fit items-center rounded-[24rem] p-4  hover:bg-gray-200">
                <Icon className=" text-3xl" />
                <p className="text-2xl">{Option}</p>
            </section>
        </>
    );
};

export default SidebarList;
