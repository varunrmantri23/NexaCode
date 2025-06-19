import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/img/logo.png";
import { UserAuthInput, Login } from "../components";
import { FaEnvelope, FaGithub, FaGoogle } from "react-icons/fa6";
import { MdPassword } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
} from "firebase/auth";
import { auth, db } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { fadeInOut } from "../animations";

const SignUp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [getEmailValidationStatus, setGetEmailValidationStatus] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const createNewUser = async () => {
        if (getEmailValidationStatus && email && password) {
            setIsLoading(true);
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // save user to firestore
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || email.split('@')[0],
                    photoURL: user.photoURL || null,
                    providerId: 'password',
                    createdAt: new Date()
                });
                
                console.log("User created successfully");
                
                // small delay to ensure auth state propagates
                setTimeout(() => {
                    window.location.replace('/home/projects');
                }, 500);
                
            } catch (err) {
                console.log(err);
                if (err.message.includes("Password")) {
                    setAlert(true);
                    setAlertMessage("Password should be at least 6 characters");
                } else if (err.message.includes("email-already")) {
                    setAlert(true);
                    setAlertMessage("Email Already exists");
                } else {
                    setAlert(true);
                    setAlertMessage("Temporarily disabled, try again later");
                }
                setTimeout(() => {
                    setAlert(false);
                }, 1000);
            }
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        setIsLoading(true);
        const googleProvider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // save user to firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                providerId: 'google.com',
                createdAt: new Date()
            });
            
            console.log("Google login successful", user);
            
            // small delay to ensure auth state propagates
            setTimeout(() => {
                window.location.replace('/home/projects');
            }, 500);
            
        } catch (err) {
            console.log("Google login error:", err);
            setAlert(true);
            setAlertMessage("Google login failed. Please try again.");
            setTimeout(() => {
                setAlert(false);
            }, 1000);
        }
        setIsLoading(false);
    };

    const signInWithGithub = async () => {
        setIsLoading(true);
        const githubProvider = new GithubAuthProvider();
        try {
            const result = await signInWithPopup(auth, githubProvider);
            const user = result.user;
            
            // save user to firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                providerId: 'github.com',
                createdAt: new Date()
            });
            
            console.log("GitHub login successful", user);
            
            // small delay to ensure auth state propagates
            setTimeout(() => {
                window.location.replace('/home/projects');
            }, 500);
            
        } catch (err) {
            console.log("GitHub login error:", err);
            setAlert(true);
            setAlertMessage("GitHub login failed. Please try again.");
            setTimeout(() => {
                setAlert(false);
            }, 1000);
        }
        setIsLoading(false);
    };

    // If user wants to login, show Login component
    if (isLogin) {
        return <Login />;
    }

    return (
        <div className="w-full py-6">
            <img
                src={Logo}
                alt="Logo"
                className="object-contain w-32 opacity-50 h-auto"
            />
            <div className="w-full flex flex-col items-center justify-center py-8">
                <p className="py-12 text-primaryText text-2xl">Join With Us! 🤩</p>
                <div className="px-8 w-full md:w-auto py-4 rounded-xl bg-secondary shadow-md flex flex-col items-center justify-center gap-8">
                    {/* Email */}
                    <UserAuthInput
                        label="Email"
                        placeholder="Email"
                        isPass={false}
                        setStateFunction={setEmail}
                        Icon={FaEnvelope}
                        setGetEmailValidationStatus={setGetEmailValidationStatus}
                    />
                    
                    {/* Password */}
                    <UserAuthInput
                        label="Password"
                        placeholder="Password"
                        isPass={true}
                        setStateFunction={setPassword}
                        Icon={MdPassword}
                    />

                    {/* Alert section */}
                    <AnimatePresence>
                        {alert && (
                            <motion.p
                                key={"AlertMessage"}
                                {...fadeInOut}
                                className="text-red-500"
                            >
                                {alertMessage}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Sign Up button */}
                    <motion.div
                        onClick={createNewUser}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center justify-center w-full bg-theme py-3 rounded-xl text-white text-xl cursor-pointer hover:bg-themedark"
                    >
                        <p>{isLoading ? "Creating Account..." : "Sign Up"}</p>
                    </motion.div>

                    {/* Account text */}
                    <p className="text-sm text-primaryText flex items-center justify-center gap-3">
                        Already Have an Account!
                        <span
                            onClick={() => setIsLogin(true)}
                            className="text-theme cursor-pointer"
                        >
                            Login Here
                        </span>
                    </p>

                    {/* OR divider line */}
                    <div className="flex items-center justify-center gap-12">
                        <div className="h-[1px] bg-[rgba(256,256,256,0.2)] w-24 rounded-md"></div>
                        <p className="text-sm text-[rgba(256,256,256,0.2)]">OR</p>
                        <div className="h-[1px] bg-[rgba(256,256,256,0.2)] w-24 rounded-md"></div>
                    </div>

                    {/* Sign in with Google */}
                    <motion.div
                        onClick={signInWithGoogle}
                        className="flex items-center justify-center gap-3 bg-[rgba(256,256,256,0.2)] backdrop-blur-md w-full py-3 rounded-xl hover:bg-[rgba(256,256,256,0.4)] cursor-pointer"
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaGoogle className="text-xl text-white" />
                        <p className="text-xl text-white">
                            {isLoading ? "Signing in..." : "Sign in with Google"}
                        </p>
                    </motion.div>

                    {/* Sign in with GitHub */}
                    <motion.div
                        onClick={signInWithGithub}
                        className="flex items-center justify-center gap-3 bg-[rgba(256,256,256,0.2)] backdrop-blur-md w-full py-3 rounded-xl hover:bg-[rgba(256,256,256,0.4)] cursor-pointer"
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaGithub className="text-xl text-white" />
                        <p className="text-xl text-white">
                            {isLoading ? "Signing in..." : "Sign in with GitHub"}
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
