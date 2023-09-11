import { useState } from "react";

const useModal = () => {
    const [modal, setModal] = useState(false);
    const hideModal = () => {
        setModal(false);
    };
    const handleOutsideClickModal = (event) => {
        if (event.target === event.currentTarget) {
            setModal(false);
            document.body.style.overflow = "unset";
        }
    };
    return [modal, setModal, handleOutsideClickModal, hideModal];
};

export default useModal;
