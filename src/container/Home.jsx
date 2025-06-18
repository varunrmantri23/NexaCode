import React, { useState, useEffect } from "react";
import { HiChevronDoubleLeft } from "react-icons/hi2";
import { MdHome } from "react-icons/md";
import { FaSearchengin } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Logo from "../assets/img/logo.png";
import { NewProject, Projects } from "../container";
import { SignUp } from "../container";
import { useDispatch, useSelector } from "react-redux";
import { UserProfileDetails } from "../components";
import { SET_SEARCH_TERM } from "../context/actions/searchActions";
import ProjectPage from "./ProjectPage";

const Home = () => {
    const location = useLocation();
    const [isSideMenu, setIsSideMenu] = useState(false);
    const user = useSelector((state) => state.user?.user);
    const searchterm = useSelector((state) =>
        state.searchterm?.searchterm ? state.searchterm?.searchterm : ""
    );
    const dispatch = useDispatch();

    // Auto-hide sidebar for project pages
    useEffect(() => {
        if (location.pathname.includes('/projectPage') || location.pathname === '/newProject') {
            setIsSideMenu(true); // Hide sidebar by default for editor pages
        } else {
            setIsSideMenu(false); // Show sidebar for other pages
        }
    }, [location.pathname]);

    return (
        <>
            <div
                className={`w-2 ${
                    isSideMenu ? "w-2" : "flex-[.2] xl:flex-[0.15]"
                } min-h-screen max-h-screen relative bg-secondary px-3 py-6 flex flex-col items-center justify-start gap-4 transition-all duration-300 ease-in-out`}
            >
                {/* anchor section for toggling*/}
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
                        <Link to={"/home"}>
                            <img
                                src={Logo}
                                alt="Logo"
                                className="object-fit h-fit-content top-0 w-full"
                            />
                        </Link>

                        {/* start coding */}
                        <Link to={"/newProject"}>
                            <div className="px-6 py-3 flex items-center justify-center rounded-xl border border-gray-400 cursor-pointer group hover:border-gray-200">
                                <p className="text-gray-400 cursor-pointer group-hover:text-gray-200">
                                    Start Coding
                                </p>
                            </div>
                        </Link>

                        {/* home nav */}
                        {user && (
                            <Link
                                to={"/home/projects"}
                                className="flex items-center justify-center gap-6"
                            >
                                <MdHome className="text-primaryText text-xl" />
                                <p className="text-lg text-primaryText">Home</p>
                            </Link>
                        )}
                    </div>
                )}
            </div>
            
            <div className={`${
                isSideMenu ? "flex-1" : "flex-[.8] xl:flex-[0.85]"
            } min-h-screen max-h-screen overflow-y-auto h-full flex flex-col items-start justify-start transition-all duration-300 ease-in-out`}>
                
                {/* Only show search and profile for non-editor pages */}
                {!location.pathname.includes('/projectPage') && location.pathname !== '/newProject' && (
                    <>
                        {/* search section and profile container  */}
                        <div className="w-full flex items-center justify-between gap-3 px-4 md:px-12 py-4 md:py-6">
                            {/* search section*/}
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
                            {!user && (
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center justify-center gap-3"
                                >
                                    <Link
                                        to={"/home/auth"}
                                        className="bg-theme px-6 py-3 rounded-lg text-white text-xl cursor-pointer hover:bg-themedark"
                                    >
                                        SignUp
                                    </Link>
                                </motion.div>
                            )}
                            {user && <UserProfileDetails />}
                        </div>
                    </>
                )}

                {/* Bottom section */}
                <div className={`w-full ${
                    location.pathname.includes('/projectPage') || location.pathname === '/newProject' 
                        ? 'h-full' 
                        : 'px-4 md:px-12'
                }`}>
                    <Routes>
                        <Route path="/*" element={<Projects />} />
                        <Route path="/auth" element={<SignUp />} />
                        <Route path="/newProject" element={<NewProject />} />
                        <Route
                            exact
                            path="/projectPage/:projectId"
                            element={<ProjectPage />}
                        />
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default Home;
