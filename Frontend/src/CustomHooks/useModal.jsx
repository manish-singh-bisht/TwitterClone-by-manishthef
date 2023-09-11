import { useState } from "react";

const useModal = () => {
    const [modal, setModal] = useState(false);
    const hideModal = () => {
        setModal(false);
<<<<<<< HEAD
        document.body.style.overflow = "unset";
=======
>>>>>>> de8a491f8365e608fdf6ca9ea6c2f4fecb28756e
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
