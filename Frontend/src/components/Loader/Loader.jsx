import React from "react";

const Loader = () => {
    return (
        <div className="mt-4 flex items-center justify-center">
            <div className="relative">
                <div
                    className="absolute h-8 w-8 rounded-full
                            border-4 border-solid border-gray-200"></div>

                <div
                    className="absolute h-8 w-8 animate-spin rounded-full
                            border-4 border-solid border-blue-500 border-t-transparent shadow-md"></div>
            </div>
        </div>
    );
};

export default Loader;
