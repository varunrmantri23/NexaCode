import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Home, NewProject } from "./container";
import { auth, db } from "./config/firebase.config";
import { QuerySnapshot, collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { Spinner } from "./components";
import Logo from "./assets/img/logo.png";

import { useDispatch } from "react-redux";
import { SET_USER } from "./context/actions/userActions";
import { SET_PROJECTS } from "./context/actions/projectActions";

const App = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const dispatch = useDispatch();

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((userCred) => {
            if (userCred) {
                console.log(userCred.providerData[0]);
                setDoc(
                    doc(db, "users", userCred?.uid),
                    userCred?.providerData[0]
                ).then(() => {
                    //dispatch the action to store
                    dispatch(SET_USER(userCred.providerData[0]));
                    navigate("/home/projects", { replace: true });
                });
            } else {
                navigate("/home/auth", { replace: true });
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        });
        //cleanup the listener event
        return () => unsubscribe();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const projectQuery = query(
            collection(db, "Projects"),
            orderBy("id", "desc")
        );
        const unsubscribe = onSnapshot(projectQuery, (querySnaps) => {
            const projectsList = querySnaps.docs.map(doc => doc.data());
            dispatch(SET_PROJECTS(projectsList));
        });

        return () => unsubscribe();
    }, [dispatch]);

    // Mobile Warning Component
    const MobileWarning = () => (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-primary px-6">
            <div className="text-center max-w-md">
                <img
                    src={Logo}
                    alt="NexaCode Logo"
                    className="w-40 h-auto mx-auto mb-8 opacity-80"
                />
                
                {/* Desktop/Laptop SVG */}
                <svg 
                    className="w-24 h-24 mx-auto mb-8 text-theme" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                </svg>

                <h1 className="text-4xl font-bold text-white mb-4">
                    Access Through Laptop! 💻
                </h1>
                
                <p className="text-primaryText text-lg mb-6 leading-relaxed">
                    Sorry, NexaCode is optimized for desktop and laptop screens to provide 
                    the best coding experience. Please switch to a larger screen to access the editor.
                </p>

                <div className="bg-secondary rounded-lg p-6 mb-8 border border-gray-700">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <svg className="w-5 h-5 text-theme" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white font-semibold">System Requirements</span>
                    </div>
                    <ul className="text-primaryText text-sm space-y-1">
                        <li>• Minimum screen width: 768px</li>
                        <li>• Desktop or laptop recommended</li>
                        <li>• Modern web browser</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full bg-theme hover:bg-themedark px-6 py-3 rounded-lg text-white font-semibold transition-colors"
                    >
                        Refresh Page
                    </button>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => window.open('https://github.com/varunrmantri23/NexaCode', '_blank')}
                            className="flex-1 bg-secondary hover:bg-gray-700 px-4 py-3 rounded-lg text-primaryText font-semibold transition-colors border border-gray-600"
                        >
                             GitHub
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700">
                    <p className="text-primaryText text-sm">
                        NexaCode - Code. Create. Collaborate. 🚀
                    </p>
                </div>
            </div>
        </div>
    );

    // Show mobile warning for mobile devices (unless loading)
    if (isMobile && !isLoading) {
        return <MobileWarning />;
    }

    return (
        <>
            {isLoading ? (
                <div className="w-screen h-screen flex items-center justify-center overflow-hidden bg-primary">
                    <Spinner />
                </div>
            ) : (
                <div className="w-screen h-screen flex items-start justify-start overflow-hidden">
                    <Routes>
                        <Route path="/home/*" element={<Home />} />
                        <Route path="/newProject" element={<NewProject />} />
                        {/*if the route not matching then re-route to home not the page but the user*/}
                        <Route path="*" element={<Navigate to={"/home/"} />} />
                    </Routes>
                </div>
            )}
        </>
    );
};

export default App;
