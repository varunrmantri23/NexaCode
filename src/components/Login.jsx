import React, { useState } from "react";
import Logo from "../assets/img/logo.png";
import { UserAuthInput } from "../components";
import { FaEnvelope, FaGithub, FaGoogle } from "react-icons/fa6";
import { MdPassword } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    GithubAuthProvider 
} from "firebase/auth";
import { auth } from "../config/firebase.config";
import { fadeInOut } from "../animations";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [getEmailValidationStatus, setGetEmailValidationStatus] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const signInUser = async () => {
        if (getEmailValidationStatus && email && password) {
            setIsLoading(true);
            try {
                await signInWithEmailAndPassword(auth, email, password);
                console.log("User signed in successfully");
            } catch (err) {
                console.log(err);
                if (err.message.includes("user-not-found")) {
                    setAlert(true);
                    setAlertMsg("User not found");
                } else if (err.message.includes("wrong-password")) {
                    setAlert(true);
                    setAlertMsg("Password mismatch");
                } else if (err.message.includes("invalid-credential")) {
                    setAlert(true);
                    setAlertMsg("Invalid credentials");
                } else {
                    setAlert(true);
                    setAlertMsg("Login failed. Please try again.");
                }
                setTimeout(() => {
                    setAlert(false);
                }, 4000);
            }
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        setIsLoading(true);
        const googleProvider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Google login successful", result.user);
        } catch (err) {
            console.log("Google login error:", err);
            setAlert(true);
            setAlertMsg("Google login failed. Please try again.");
            setTimeout(() => {
                setAlert(false);
            }, 4000);
        }
        setIsLoading(false);
    };

    const loginWithGitHub = async () => {
        setIsLoading(true);
        const githubProvider = new GithubAuthProvider();
        try {
            const result = await signInWithPopup(auth, githubProvider);
            console.log("GitHub login successful", result.user);
        } catch (err) {
            console.log("GitHub login error:", err);
            setAlert(true);
            setAlertMsg("GitHub login failed. Please try again.");
            setTimeout(() => {
                setAlert(false);
            }, 4000);
        }
        setIsLoading(false);
    };

    return (
        <div className="w-full py-6">
            <img
                src={Logo}
                className="object-contain w-32 opacity-50 h-auto"
                alt="Logo"
            />
            <div className="w-full flex flex-col items-center justify-center py-8">
                <p className="py-12 text-2xl text-primaryText">Welcome back! 👋</p>
                <div className="px-8 w-full md:w-auto py-4 rounded-xl bg-secondary shadow-md flex flex-col items-center justify-center gap-8">
                    <UserAuthInput
                        label="Email"
                        placeholder="Email"
                        isPass={false}
                        Icon={FaEnvelope}
                        setStateFunction={setEmail}
                        setGetEmailValidationStatus={setGetEmailValidationStatus}
                    />
                    <UserAuthInput
                        label="Password"
                        placeholder="Password"
                        isPass={true}
                        Icon={MdPassword}
                        setStateFunction={setPassword}
                    />

                    {/* Alert */}
                    <AnimatePresence>
                        {alert && (
                            <motion.p 
                                key={"AlertMessage"}
                                {...fadeInOut} 
                                className="text-red-500 text-sm py-2"
                            >
                                {alertMsg}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <motion.div
                        onClick={signInUser}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center justify-center w-full py-3 rounded-xl hover:bg-theme bg-theme cursor-pointer"
                        disabled={isLoading}
                    >
                        <p className="text-xl text-white">
                            {isLoading ? "Signing in..." : "Sign In"}
                        </p>
                    </motion.div>

                    <p className="text-sm text-primaryText flex items-center justify-center gap-3 py-3">
                        Don't have an account?{" "}
                        <span
                            onClick={() => window.location.reload()}
                            className="text-theme cursor-pointer"
                        >
                            Create Here
                        </span>
                    </p>

                    {/* OR Divider */}
                    <div className="flex items-center justify-center gap-12 py-4">
                        <div className="h-[1px] bg-[rgba(256,256,256,0.2)] rounded-md w-24"></div>
                        <p className="text-sm text-[rgba(256,256,256,0.2)]">OR</p>
                        <div className="h-[1px] bg-[rgba(256,256,256,0.2)] rounded-md w-24"></div>
                    </div>

                    {/* Social Login */}
                    <motion.div
                        onClick={loginWithGoogle}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center justify-center gap-3 bg-[rgba(256,256,256,0.2)] backdrop-blur-md w-full py-3 rounded-xl hover:bg-[rgba(256,256,256,0.4)] cursor-pointer mb-3"
                        disabled={isLoading}
                    >
                        <FaGoogle className="text-xl" />
                        <p className="text-xl text-white">
                            {isLoading ? "Signing in..." : "Sign in with Google"}
                        </p>
                    </motion.div>

                    <motion.div
                        onClick={loginWithGitHub}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center justify-center gap-3 bg-[rgba(256,256,256,0.2)] backdrop-blur-md w-full py-3 rounded-xl hover:bg-[rgba(256,256,256,0.4)] cursor-pointer"
                        disabled={isLoading}
                    >
                        <FaGithub className="text-xl" />
                        <p className="text-xl text-white">
                            {isLoading ? "Signing in..." : "Sign in with GitHub"}
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;