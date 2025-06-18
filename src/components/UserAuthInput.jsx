import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { motion } from "framer-motion";

const UserAuthInput = ({ 
    label, 
    placeholder, 
    isPass, 
    setStateFunction, 
    Icon, 
    setGetEmailValidationStatus 
}) => {
    const [value, setValue] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);

    const handleTextChange = (e) => {
        setValue(e.target.value);
        setStateFunction(e.target.value);

        if (placeholder === "Email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(e.target.value);
            setIsEmailValid(isValid);
            setGetEmailValidationStatus(isValid);
        }
    };

    return (
        <div className="flex flex-col items-start justify-start gap-1">
            <label className="text-sm text-gray-300">{label}</label>
            <div className={`flex items-center justify-center gap-3 w-full md:w-96 rounded-md px-4 py-1 border ${
                !isEmailValid && placeholder === "Email" && value !== "" 
                    ? "border-red-500" 
                    : "border-gray-300"
            } bg-gray-200 focus-within:border-gray-400 focus-within:shadow-md`}>
                <Icon className="text-text555 text-2xl" />
                <input
                    type={isPass && !showPass ? "password" : "text"}
                    placeholder={placeholder}
                    className="flex-1 w-full h-full py-2 outline-none border-none bg-transparent text-text555 text-lg"
                    value={value}
                    onChange={handleTextChange}
                />
                {isPass && (
                    <motion.div
                        onClick={() => setShowPass(!showPass)}
                        whileTap={{ scale: 0.9 }}
                        className="cursor-pointer"
                    >
                        {showPass ? (
                            <FaEyeSlash className="text-text555 text-2xl" />
                        ) : (
                            <FaEye className="text-text555 text-2xl" />
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default UserAuthInput;
