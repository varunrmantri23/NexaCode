import React from "react";
import Logo from "../assets/img/logo.png";

const SignUp = () => {
    return (
        <div className="w-full py-6">
            <img
                src={Logo}
                alt="Logo"
                className=" object-contain w-32 opacity-50 h-auto"
            ></img>
            <div className="w-full flex flex-col items-center justify-center py-8">
                <p className="py-12 text-primaryText text-2xl">Join With Us!</p>
                <div className="px-8 w-full md:w-auto py-4 rounded-xl bg-secondary shadow-md flex flex-col items-center justify-center gap-8"></div>
            </div>
        </div>
    );
};

export default SignUp;
