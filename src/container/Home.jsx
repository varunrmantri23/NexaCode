import React, { useState, useEffect } from "react";
import { HiChevronDoubleLeft } from "react-icons/hi2";
import { MdHome } from "react-icons/md";
import { FaSearchengin } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Link, Route, Routes, useLocation, Navigate } from "react-router-dom";
import Logo from "../assets/img/logo.png";
import { NewProject, Projects } from "../container";
import { SignUp } from "../container";
import { useDispatch, useSelector } from "react-redux";
import { UserProfileDetails } from "../components";
import { SET_SEARCH_TERM } from "../context/actions/searchActions";
import ProjectPage from "./ProjectPage";
import Collections from "./Collections";
import Profile from "./Profile";

const Home = () => {
    const location = useLocation();
    const [isSideMenu, setIsSideMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const user = useSelector((state) => state.user?.user);
    const searchterm = useSelector((state) =>
        state.searchterm?.searchterm ? state.searchterm?.searchterm : ""
    );
    const dispatch = useDispatch();

    // check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // auto-hide sidebar for project pages
    useEffect(() => {
        if (location.pathname.includes('/projectPage') || location.pathname === '/newProject') {
            setIsSideMenu(true);
        } else {
            setIsSideMenu(false);
        }
    }, [location.pathname]);

    // protected route component
    const ProtectedRoute = ({ children }) => {
        if (!user) {
            return <Navigate to="/home/auth" replace />;
        }
        return children;
    };

    // mobile warning component
    const MobileWarning = () => (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-primary px-6">
            <div className="text-center max-w-md">
                <img
                    src={Logo}
                    alt="NexaCode Logo"
                    className="w-40 h-auto mx-auto mb-8 opacity-80"
                />
                
                <svg 
                    className="w-24 h-24 mx-auto mb-8 text-theme" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                </svg>

                <h1 className="text-4xl font-bold text-white mb-4">
                    Sorry!
                </h1>
                
                <p className="text-primaryText text-lg mb-6 leading-relaxed">
                    Nexacode is optimized for desktop and laptop screens to provide 
                    the best coding experience. Please switch to a larger screen to access the editor.
                </p>

                <div className="bg-secondary rounded-lg p-6 mb-8 border border-gray-700">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <svg className="w-5 h-5 text-theme" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white font-semibold">System requirements</span>
                    </div>
                    <ul className="text-primaryText text-sm space-y-1">
                        <li>• Minimum screen width: 768px</li>
                        <li>• Desktop or laptop recommended</li>
                        <li>• Modern web browser required</li>
                        <li>• Stable internet connection</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full bg-theme hover:bg-themedark px-6 py-3 rounded-lg text-white font-semibold transition-colors"
                    >
                        Refresh page
                    </button>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => window.open('https://github.com/varunrmantri23/NexaCode', '_blank')}
                            className="flex-1 bg-secondary hover:bg-gray-700 px-4 py-3 rounded-lg text-primaryText font-semibold transition-colors border border-gray-600 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Github
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700">
                    <p className="text-primaryText text-sm">
                        nexacode - code. create. collaborate. 🚀
                    </p>
                </div>
            </div>
        </div>
    );

    // show mobile warning for mobile devices
    if (isMobile) {
        return <MobileWarning />;
    }

    return (
        <>
            <div
                className={`w-2 ${
                    isSideMenu ? "w-2" : "flex-[.2] xl:flex-[0.15]"
                } min-h-screen max-h-screen relative bg-secondary px-3 py-6 flex flex-col items-center justify-start gap-4 transition-all duration-300 ease-in-out`}
            >
                {/* sidebar toggle */}
                <motion.div
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        setIsSideMenu(!isSideMenu);
                    }}
                    className="w-8 h-8 bg-secondary rounded-tr-lg rounded-br-lg absolute -right-6 flex items-center justify-center cursor-pointer z-50"
                >
                    <HiChevronDoubleLeft
                        className={`${
                            isSideMenu
                                ? "text-white text-xl rotate-180"
                                : "text-white text-xl "
                        }`}
                    />
                </motion.div>
                
                {!isSideMenu && (
                    <div className="overflow-hidden w-full flex flex-col gap-4">
                        {/* logo */}
                        <Link to={user ? "/home/projects" : "/home/auth"}>
                            <img
                                src={Logo}
                                alt="Logo"
                                className="object-fit h-fit-content top-0 w-full"
                            />
                        </Link>

                        {/* start coding - only if authenticated */}
                        {user && (
                            <Link to={"/newProject"}>
                                <div className="px-6 py-3 flex items-center justify-center rounded-xl border border-gray-400 cursor-pointer group hover:border-gray-200">
                                    <p className="text-gray-400 cursor-pointer group-hover:text-gray-200">
                                        Start Coding
                                    </p>
                                </div>
                            </Link>
                        )}

                        {/* home nav - only if authenticated */}
                        {user && (
                            <Link
                                to={"/home/projects"}
                                className="flex items-center justify-center gap-6"
                            >
                                <MdHome className="text-primaryText text-xl" />
                                <p className="text-lg text-primaryText">Home</p>
                            </Link>
                        )}

                        {/* auth prompt if not logged in */}
                        {!user && (
                            <div className="px-6 py-4 text-center">
                                <p className="text-primaryText text-sm mb-4">
                                    Please sign in to access all features
                                </p>
                                <Link 
                                    to="/home/auth"
                                    className="bg-theme hover:bg-themedark px-4 py-2 rounded-lg text-white font-semibold transition-colors"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <div className={`${
                isSideMenu ? "flex-1" : "flex-[.8] xl:flex-[0.85]"
            } min-h-screen max-h-screen overflow-y-auto h-full flex flex-col items-start justify-start transition-all duration-300 ease-in-out`}>
                
                {/* search and profile - only for authenticated users on non-editor pages */}
                {user && !location.pathname.includes('/projectPage') && location.pathname !== '/newProject' && location.pathname !== '/home/auth' && (
                    <div className="w-full flex items-center justify-between gap-3 px-4 md:px-12 py-4 md:py-6">
                        {/* search section */}
                        <div className="bg-secondary w-full px-4 py-3 rounded-md flex items-center justify-center gap-4">
                            <FaSearchengin className="text-2xl text-primaryText" />
                            <input
                                type="text"
                                value={searchterm}
                                className="flex-1 px-4 py-1 text-xl bg-transparent outline-none border-none text-primaryText placeholder:text-gray-600"
                                placeholder="Search projects..."
                                onChange={(e) => {
                                    dispatch(SET_SEARCH_TERM(e.target.value));
                                }}
                            />
                        </div>
                        
                        {/* profile section */}
                        <UserProfileDetails />
                    </div>
                )}

                {/* main content */}
                <div className={`w-full ${
                    location.pathname.includes('/projectPage') || location.pathname === '/newProject' 
                        ? 'h-full' 
                        : 'px-4 md:px-12'
                }`}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/auth" element={<SignUp />} />
                        
                        {/* Protected routes */}
                        <Route 
                            path="/projects" 
                            element={
                                <ProtectedRoute>
                                    <Projects />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/collections" 
                            element={
                                <ProtectedRoute>
                                    <Collections />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/profile" 
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } 
                        />
                        <Route
                            path="/projectPage/:projectId"
                            element={
                                <ProtectedRoute>
                                    <ProjectPage />
                                </ProtectedRoute>
                            }
                        />
                        
                        {/* Default redirect */}
                        <Route 
                            path="/" 
                            element={<Navigate to={user ? "/home/projects" : "/home/auth"} replace />} 
                        />
                        <Route 
                            path="/*" 
                            element={<Navigate to={user ? "/home/projects" : "/home/auth"} replace />} 
                        />
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default Home;
