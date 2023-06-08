import React, { Suspense, useState } from "react";
import Loader from "../Loader/Loader";
const ExpandedImage = React.lazy(() => import("./ExpandedImage"));

export const ProfileImage = ({ profile }) => {
    const [visibility, setVisibility] = useState(false);
    const [modalData, setModalData] = useState({ imageUrl: null, type: null });

    const openModal = ({ imageUrl, type }) => {
        setModalData({ imageUrl, type });
        setVisibility(true);
    };
    const oncloseHandler = () => {
        setVisibility(false);
    };
    return (
        <>
            <div
                className="absolute left-2 bottom-0 h-[9.5rem] w-[9.5rem] rounded-full   bg-white"
                onClick={() => {
                    if (profile) {
                        openModal({ imageUrl: profile, type: "profile" });
                    }
                }}>
                {profile ? (
                    <img src={profile} alt="profile" loading="lazy" className="relative mx-auto mt-[0.25rem]  h-[8.8rem] w-[8.8rem] cursor-pointer rounded-full object-cover" />
                ) : (
                    <div className="relative mx-auto mt-[0.25rem]   flex h-[8.8rem] w-[8.8rem] items-center justify-center  rounded-full bg-gray-200">
                        <svg className="  h-28 w-28 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                )}
            </div>
            <Suspense fallback={<Loader />}>
                <ExpandedImage visibility={visibility} onclose={oncloseHandler} modalData={modalData} />
            </Suspense>
        </>
    );
};

export const BannerImage = ({ banner }) => {
    const [visibility, setVisibility] = useState(false);
    const [modalData, setModalData] = useState({ imageUrl: null, type: null });

    const openModal = ({ imageUrl, type }) => {
        setModalData({ imageUrl, type });
        setVisibility(true);
    };
    const oncloseHandler = () => {
        setVisibility(false);
    };
    return (
        <>
            <div
                className="relative mt-2 max-h-[13rem] "
                onClick={() => {
                    if (banner) {
                        openModal({ imageUrl: banner, type: "banner" });
                    }
                }}>
                {banner ? <img src={banner} alt="banner" loading="lazy" className="max-h-[100%] min-w-full cursor-pointer object-cover" /> : <div className="min-h-[15rem]  min-w-[100%] bg-gray-200"></div>}
            </div>
            <Suspense fallback={<Loader />}>
                <ExpandedImage visibility={visibility} onclose={oncloseHandler} modalData={modalData} />
            </Suspense>
        </>
    );
};
