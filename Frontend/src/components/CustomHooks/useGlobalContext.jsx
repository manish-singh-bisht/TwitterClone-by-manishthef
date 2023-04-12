import { useContext } from "react";
import { AppContext } from "../context/Context";

export const useGlobalContext = () => {
    return useContext(AppContext);
};
