// src/container/Profile.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MdEdit, MdCheck } from "react-icons/md";
import { setDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.config";

const Profile = () => {
    const user = useSelector((state) => state.user?.user);
    const projects = useSelector((state) => state.projects?.projects);
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [userProjects, setUserProjects] = useState([]);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "");
            // filter user's projects
            const filtered = projects?.filter(project => project.user?.uid === user.uid) || [];
            setUserProjects(filtered);
        }
    }, [user, projects]);

    const updateProfile = async () => {
        if (!user || !displayName.trim()) return;
        
        try {
            await setDoc(doc(db, "users", user.uid), {
                ...user,
                displayName: displayName,
                updatedAt: new Date()
            });
            setIsEditing(false);
        } catch (error) {
            console.log("error updating profile:", error);
        }
    };

    return (
        <div className="w-full py-6 px-4">
            {/* profile header */}
            <div className="bg-secondary p-6 rounded-lg mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-theme rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="bg-primary text-white px-3 py-2 rounded border border-gray-600 focus:border-theme outline-none"
                                    onKeyPress={(e) => e.key === 'Enter' && updateProfile()}
                                />
                            ) : (
                                <h1 className="text-2xl font-bold text-white">
                                    {user?.displayName || "unnamed user"}
                                </h1>
                            )}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={isEditing ? updateProfile : () => setIsEditing(true)}
                                className="text-theme hover:text-themedark"
                            >
                                {isEditing ? <MdCheck className="text-xl" /> : <MdEdit className="text-xl" />}
                            </motion.button>
                        </div>
                        <p className="text-primaryText">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-secondary p-4 rounded-lg text-center">
                    <h3 className="text-2xl font-bold text-theme">{userProjects.length}</h3>
                    <p className="text-primaryText">projects</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg text-center">
                    <h3 className="text-2xl font-bold text-theme">0</h3>
                    <p className="text-primaryText">collections</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg text-center">
                    <h3 className="text-2xl font-bold text-theme">0</h3>
                    <p className="text-primaryText">followers</p>
                </div>
            </div>

            {/* recent projects */}
            <div className="bg-secondary p-6 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-4">recent projects</h2>
                {userProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userProjects.slice(0, 6).map((project) => (
                            <motion.div
                                key={project.id}
                                className="bg-primary p-4 rounded-lg border border-gray-700 hover:border-theme transition-colors"
                                whileHover={{ scale: 1.02 }}
                            >
                                <h3 className="text-white font-semibold">{project.title}</h3>
                                <p className="text-primaryText text-sm mt-2">
                                    created {new Date(project.id).toLocaleDateString()}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-primaryText">no projects yet</p>
                )}
            </div>
        </div>
    );
};

export default Profile;