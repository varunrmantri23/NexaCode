import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa6";
import { Menus, signOutAction } from "../utils/helpers";
import { Link } from "react-router-dom";
import { slideUpOut } from "../animations";

const UserProfileDetails = () => {
    const user = useSelector((state) => state.user?.user);
    const [isMenu, setIsMenu] = useState(false);
    const menuRef = useRef(null);

    // close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenu(false);
            }
        };

        if (isMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenu]);

    return (
        <div className="flex items-center justify-center gap-4 relative" ref={menuRef}>
            <div className="w-14 h-14 flex items-center justify-center rounded-xl overflow-hidden cursor-pointer bg-theme">
                {user?.photoURL ? (
                    <motion.img
                        whileHover={{ scale: 1.3 }}
                        src={user?.photoURL}
                        alt={user?.displayName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <p className="text-xl text-white font-semibold capitalize">
                        {user?.email?.[0] || "U"}
                    </p>
                )}
            </div>
            <motion.div
                onClick={() => setIsMenu(!isMenu)}
                className="px-4 py-4 rounded-md flex items-center justify-center bg-secondary cursor-pointer"
                whileTap={{ scale: 0.9 }}
            >
                <FaChevronDown className="text-primaryText" />
            </motion.div>
            <AnimatePresence>
                {isMenu && (
                    <motion.div
                        {...slideUpOut}
                        className="bg-secondary absolute top-16 right-0 px-4 py-3 rounded-xl shadow-md z-10 flex flex-col items-start justify-start gap-4 min-w-[225px]"
                    >
                        {Menus &&
                            Menus.map((menu) => (
                                <Link
                                    key={menu.id}
                                    to={menu.uri}
                                    className="text-primaryText text-lg hover:bg-[rgba(256,256,256,0.05)] px-2 py-1 w-full rounded-md"
                                    onClick={() => setIsMenu(false)} // close menu on link click
                                >
                                    {menu.name}
                                </Link>
                            ))}
                        <motion.p
                            onClick={() => {
                                setIsMenu(false);
                                signOutAction();
                            }}
                            whileTap={{ scale: 0.9 }}
                            className="text-primaryText text-lg hover:bg-[rgba(256,256,256,0.05)] px-2 py-1 w-full rounded-md cursor-pointer"
                        >
                            Sign Out
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserProfileDetails;
