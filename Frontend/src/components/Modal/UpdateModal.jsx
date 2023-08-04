import React, { useRef, useState } from "react";
import { Cross } from "../SVGs/SVGs";
import { BannerImage, ProfileImage } from "../Profile/ProfileBanner";
import axios from "axios";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import { toast } from "react-toastify";

const UpdateModal = ({ visibility, onClose, handleOutsideClick, profile, banner, name, website, bio, location, setUser }) => {
    if (!visibility) return;

    const { dispatch, ACTIONS } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: name,
        bio: bio,
        location: location,
        website: website,
    });
    const [updatedProfile, setUpdatedProfile] = useState({
        image: profile,
        banner: banner,
    });
    const addHttpAndWwwPrefix = (url) => {
        if (!url) return "";

        const hasHttp = /^https?:\/\//i.test(url);
        const hasWww = /^www\./i.test(url);

        if (!hasHttp && !hasWww) {
            return `https://www.${url}`;
        }

        if (hasWww && !hasHttp) {
            return `https://${url}`;
        }

        return url;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "website") {
            const correctWebsiteString = addHttpAndWwwPrefix(value);
            setFormData((prevData) => ({ ...prevData, ["website"]: correctWebsiteString }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleChangeImage = (value, type) => {
        setUpdatedProfile((prevData) => ({ ...prevData, [type]: value }));
    };

    const textareaRef = useRef(null);

    const handleTextareaInput = () => {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    };

    const onSubmitHandler = async (formData, updatedProfile) => {
        if (!formData.name || formData.name.trim() === "") {
            const toastConfig = {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                closeButton: false,
                style: {
                    backgroundColor: "#1DA1F2",
                    border: "none",
                    boxShadow: "none",
                    width: "fit-content",
                    zIndex: 9999,
                    color: "white",
                    padding: "0px 16px",
                    minHeight: "3rem",
                },
            };

            toast("Name Cannot be Empty", toastConfig);

            return;
        }
        setLoading(true);
        await axios.put(
            `http://localhost:4000/api/v1/update/profile`,
            { name: formData.name, profile: updatedProfile, website: formData.website, location: formData.location, description: formData.bio },

            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        const { data } = await axios.get("http://localhost:4000/api/v1/me", { withCredentials: true });
        dispatch({ type: ACTIONS.LOAD_SUCCESS, payload: { myProfile: data.myProfile, total: data.total } });
        setLoading(false);

        setUser(data.myProfile);

        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-40  flex  h-[100vh] w-[100vw] items-center justify-center">
                <div className="fixed h-[100vh] w-[100vw]  bg-black opacity-40" onClick={handleOutsideClick}></div>
                <div className="z-40 h-[85vh] w-[42vw] overflow-y-auto rounded-xl bg-white">
                    <div className="sticky inset-0 z-40 mt-[0.1rem] flex w-full items-center justify-between rounded-tl-xl    bg-white/60 px-4 backdrop-blur-md">
                        <div className="flex items-center gap-7">
                            <div className="my-2 flex h-fit    w-fit cursor-pointer items-center justify-center  rounded-full  p-2 hover:bg-gray-200 " onClick={onClose}>
                                <Cross />
                            </div>
                            <div className="text-[1.5rem] font-bold">Edit profile</div>
                        </div>
                        <button
                            className=" h-fit rounded-full bg-black px-4 py-1 font-bold text-white hover:text-gray-200 disabled:text-gray-200"
                            disabled={loading}
                            onClick={() => {
                                onSubmitHandler(formData, updatedProfile);
                            }}>
                            Save
                        </button>
                    </div>
                    <div className="h-[13rem]">
                        <BannerImage
                            banner={updatedProfile.banner}
                            changeBanner={true}
                            handleChangeImage={(value, type) => {
                                handleChangeImage(value, type);
                            }}
                        />
                    </div>
                    <div className="relative h-[6.5rem]     ">
                        <ProfileImage
                            profile={updatedProfile.image}
                            changeImage={true}
                            handleChangeImage={(value, type) => {
                                handleChangeImage(value, type);
                            }}
                        />
                    </div>
                    <form className="  my-2 mb-4 flex flex-col gap-6 px-5">
                        <div className="relative">
                            <input
                                type="text"
                                id="Name"
                                name="name"
                                required
                                className="peer block h-[3.8rem]  w-full rounded-md border-2   p-2  pt-8 placeholder-transparent focus:border-blue-500 focus:outline-none"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                maxLength={26}
                            />
                            <label
                                htmlFor="Name"
                                className="absolute top-1
                                left-[.60rem] text-sm  transition-all  peer-placeholder-shown:top-[1.2rem] peer-placeholder-shown:text-[1.1rem] peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400">
                                Name
                            </label>
                            <div
                                className="absolute top-1 right-2 hidden text-gray-400 peer-focus:block
                    
                             ">
                                {formData.name?.length}/26
                            </div>
                        </div>
                        <div className="relative">
                            <textarea
                                type="text"
                                id="Bio"
                                name="bio"
                                ref={textareaRef}
                                required
                                className="peer block h-[5.8rem] w-full resize-none overflow-hidden rounded-md border-2   p-2 pt-8  placeholder-transparent focus:border-blue-500 focus:outline-none"
                                placeholder="Bio"
                                value={formData.bio}
                                onChange={handleChange}
                                onInput={handleTextareaInput}
                                maxLength={160}
                            />
                            <label
                                htmlFor="Bio"
                                className="absolute top-1
                                left-[.60rem] text-sm  transition-all  peer-placeholder-shown:top-[1.2rem] peer-placeholder-shown:text-[1.1rem] peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400">
                                Bio
                            </label>
                            <div
                                className="absolute top-1 right-2 hidden text-gray-400 peer-focus:block
                    
                             ">
                                {formData.bio?.length}/160
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                id="location"
                                name="location"
                                required
                                className="peer block h-[3.8rem] w-full rounded-md border-2   p-2 pt-8  placeholder-transparent focus:border-blue-500 focus:outline-none"
                                placeholder="Location"
                                value={formData.location}
                                onChange={handleChange}
                                maxLength={30}
                            />
                            <label
                                htmlFor="location"
                                className="absolute top-1
                                left-[.60rem] text-sm  transition-all  peer-placeholder-shown:top-[1.2rem] peer-placeholder-shown:text-[1.1rem] peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400">
                                Location
                            </label>
                            <div
                                className="absolute top-1 right-2 hidden text-gray-400 peer-focus:block
                    
                             ">
                                {formData.location?.length}/30
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                id="website"
                                name="website"
                                required
                                className="peer block h-[3.8rem] w-full rounded-md border-2   p-2 pt-8  placeholder-transparent focus:border-blue-500 focus:outline-none"
                                placeholder="website"
                                value={formData.website}
                                onChange={handleChange}
                                maxLength={100}
                            />
                            <label
                                htmlFor="website"
                                className="absolute top-1
                                left-[.60rem] text-sm  transition-all  peer-placeholder-shown:top-[1.2rem] peer-placeholder-shown:text-[1.1rem] peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400">
                                Website
                            </label>
                            <div
                                className="absolute top-1 right-2 hidden text-gray-400 peer-focus:block
                    
                             ">
                                {formData.website?.length}/100
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
export default UpdateModal;
