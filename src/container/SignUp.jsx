import React, { useState } from "react";
import Logo from "../assets/img/logo.png";
import { UserAuthInput } from "../components";
import { FaEnvelope, FaEye, FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { MdPassword } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { signInWithGithub, signInWithGoogle } from "../utils/helpers";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase.config";
import { fadeinOut } from "../animations";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [getEmailValidationStatus, setGetEmailValidationStatus] =
        useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const createNewUser = async () => {
        if (getEmailValidationStatus) {
            await createUserWithEmailAndPassword(auth, email, password)
                .then((userCred) => {
                    if (userCred) {
                        // console.log(userCred);
                    }
                })
                .catch((err) => console.log(err));
        }
    };
    const loginWithEmailPassword = async () => {
        if (getEmailValidationStatus) {
            await signInWithEmailAndPassword(auth, email, password)
                .then((userCred) => {
                    if (userCred) {
                        //console.log(userCred);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    if (err.message.includes("user-not-found")) {
                        setAlert(true);
                        setAlertMessage("Invalid Id :  User Not Found");
                    } else if (err.message.includes("wrong-password")) {
                        setAlert(true);
                        setAlertMessage("Invalid Password");
                    } else if (err.message.includes("invalid-credential")) {
                        setAlert(true);
                        setAlertMessage("Invalid Credentials");
                    } else {
                        setAlert(true);
                        setAlertMessage("Try Again Later..");
                    }
                    setInterval(() => {
                        setAlertMessage(false);
                    }, 4000);
                });
        }
    };
    return (
        <div className="w-full py-6">
            <img
                src={Logo}
                alt="Logo"
                className=" object-contain w-32 opacity-50 h-auto"
            ></img>
            <div className="w-full flex flex-col items-center justify-center py-8">
                <p className="py-12 text-primaryText text-2xl">Join With Us!</p>
                <div className="px-8 w-full md:w-auto py-4 rounded-xl bg-secondary shadow-md flex flex-col items-center justify-center gap-8">
                    {/* email */}
                    <UserAuthInput
                        label="Email"
                        placeHolder="Email"
                        isPass={false}
                        key="Email"
                        setStateFunction={setEmail}
                        Icon={FaEnvelope}
                        setGetEmailValidationStatus={
                            setGetEmailValidationStatus
                        }
                    />
                    {/* password */}
                    <UserAuthInput
                        label="Password"
                        placeHolder="Password"
                        isPass={true}
                        key="Password"
                        setStateFunction={setPassword}
                        Icon={MdPassword}
                    />
                    {/* alert section .. invalid  email or password.. etc  */}
                    <AnimatePresence>
                        {alert && (
                            <motion.p
                                key={"AlertMessage"}
                                {...fadeinOut}
                                className="text-red-500 "
                            >
                                {alertMessage}
                            </motion.p>
                        )}
                    </AnimatePresence>
                    {/* login button */}
                    {isLogin ? (
                        <motion.div
                            onClick={loginWithEmailPassword}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center justify-center w-full bg-theme py-3 rounded-xl text-white text-xl cursor-pointer hover:bg-themedark "
                        >
                            <p> Log In </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            onClick={createNewUser}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center justify-center w-full bg-theme py-3 rounded-xl text-white text-xl cursor-pointer hover:bg-themedark "
                        >
                            <p> Sign Up</p>
                        </motion.div>
                    )}
                    {/* account text , password forget or sign up now */}
                    {!isLogin ? (
                        <p className="text-sm text-primaryText flex items-center justify-center gap-3">
                            Already Have an Account !
                            <span
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-emerald-500 cursor-pointer"
                            >
                                {" "}
                                Login Here{" "}
                            </span>
                        </p>
                    ) : (
                        <p className="text-sm text-primaryText flex items-center justify-center gap-3">
                            Don't Have an Account !
                            <span
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-emerald-500 cursor-pointer"
                            >
                                {" "}
                                Create Here{" "}
                            </span>
                        </p>
                    )}

                    {/* or divider line */}
                    <div className="flex items-center justify-center gap-12">
                        <div className="h-[1px] bg-[rgba(256,256,256,0.2)] w-24 rounded-md"></div>
                        <p className="text-sm text-[rgba(256,256,256,0.2)]">
                            OR
                        </p>
                        <div className="h-[1px] bg-[rgba(256,256,256,0.2)] w-24 rounded-md"></div>
                    </div>
                    {/* sign in with google */}
                    <motion.div
                        onClick={signInWithGoogle}
                        className="flex items-center justify-center gap-3 bg-[rgba(256,256,256,0.2)] backdrop-blur-md w-full py-3 rounded-xl hover:bg-[rgba(256,256,256,0.4)] cursor-pointer"
                        whileTap={{ scale: 0.9 }}
                    >
                        <FcGoogle className="text-3xl"></FcGoogle>
                        <p className="text-xl text-white">
                            Sign In with Google
                        </p>
                    </motion.div>
                    {/* or divider line */}
                    <div className="flex items-center justify-center gap-12">
                        <div className="h-[1px] bg-[rgba(256,256,256,0.2)] w-24 rounded-md"></div>
                        <p className="text-sm text-[rgba(256,256,256,0.2)]">
                            OR
                        </p>
                        <div className="h-[1px] bg-[rgba(256,256,256,0.2)] w-24 rounded-md"></div>
                    </div>
                    {/* sign in with github */}
                    <motion.div
                        onClick={signInWithGithub}
                        className="flex items-center justify-center gap-3 bg-[rgba(256,256,256,0.2)] backdrop-blur-md w-full py-3 rounded-xl hover:bg-[rgba(256,256,256,0.4)] cursor-pointer"
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaGithub className="text-3xl text-white"></FaGithub>
                        <p className="text-xl text-white">
                            Sign In with Github
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
