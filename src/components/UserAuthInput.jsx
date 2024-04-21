import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { motion } from "framer-motion";

const UserAuthInput = ({
    label,
    placeHolder,
    isPass,
    key,
    setStateFunction,
    Icon,
    setGetEmailValidationStatus,
}) => {
    const [value, setValue] = useState("");
    const [showPass, setShowPass] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const handleTextChange = (e) => {
        setValue(e.target.value);
        setStateFunction(e.target.value);
        if (placeHolder === "Email") {
            const emailRegex =
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const status = emailRegex.test(value);
            setIsEmailValid(status);
            setGetEmailValidationStatus(status);
        }
    };
    return (
        <div className="flex flex-col items-start justify-start gap-1">
            <label className="text-sm text-gray-200">{label}</label>
            <div
                className={`flex items-center justify-center gap-3 w-full md:w-96 rounded-md px-4 py-1 bg-gray-100 ${
                    !isEmailValid &&
                    placeHolder === "Email" &&
                    value.length > 0 &&
                    "border-red-500 border-2"
                }`}
            >
                <Icon className="text-text555 text-2xl"></Icon>
                <input
                    type={isPass && showPass ? "password" : "text"}
                    placeholder={placeHolder}
                    className="flex-1 w-full h-full py-2 outline-none border-none bg-transparent text-text555 text-lg"
                    value={value}
                    onChange={handleTextChange}
                ></input>
                {isPass && (
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            setShowPass(!showPass);
                        }}
                        className="cursor-pointer"
                    >
                        {showPass ? (
                            <FaEye className="text-text555 text-2xl "></FaEye>
                        ) : (
                            <FaEyeSlash className="text-text555 text-2xl "></FaEyeSlash>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default UserAuthInput;
