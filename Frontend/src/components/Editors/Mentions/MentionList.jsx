import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export default forwardRef((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef(null);

    const selectItem = (index) => {
        const item = props.items[index];

        if (item) {
            props.command({ id: item.handle });
        }
    };

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => {
        setSelectedIndex(0);
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, [props.items]);

    useEffect(() => {
        const selected = containerRef.current?.querySelector(".is-selected");
        if (selected) {
            selected.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [selectedIndex]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === "ArrowUp") {
                upHandler();
                return true;
            }

            if (event.key === "ArrowDown") {
                downHandler();
                return true;
            }

            if (event.key === "Enter") {
                enterHandler();
                return true;
            }

            return false;
        },
    }));

    return (
        <>
            {props.items !== undefined && props.items.length > 0 && (
                <div className="relative  z-0 mt-[4.5rem] h-[21rem] w-[21rem] overflow-y-auto  rounded-md border-2 bg-white shadow-xl shadow-black" ref={containerRef}>
                    {props.items.map((item, index) => (
                        <button className={` items-top z-0 flex w-full gap-3  p-2 hover:bg-gray-50 ${index === selectedIndex ? "bg-gray-50" : ""}`} key={index} onClick={() => selectItem(index)}>
                            {item.url !== null ? (
                                <div className="m-1 h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full   bg-gray-400">
                                    <img src={item.url} alt="profile image" className="h-full w-full rounded-full object-cover" />
                                </div>
                            ) : (
                                <div className="relative m-1 flex h-[3.2rem] w-[3.2rem] items-center justify-center  rounded-full bg-gray-200">
                                    <svg className="  h-9 w-9 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                            )}
                            <div className="flex flex-col text-start align-top">
                                <div className="">{item.name}</div>
                                <div className="mt-[-0.2rem] text-gray-400">@{item.handle}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </>
    );
});
