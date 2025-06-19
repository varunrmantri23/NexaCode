// src/container/Profile.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MdEdit, MdCheck } from "react-icons/md";
import { setDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { Link } from "react-router-dom";

const Profile = () => {
    const user = useSelector((state) => state.user?.user);
    const projects = useSelector((state) => state.projects?.projects);
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [userProjects, setUserProjects] = useState([]);
    const [userCollections, setUserCollections] = useState([]);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "");
            // filter user's projects
            const filtered = projects?.filter(project => project.user?.uid === user.uid) || [];
            setUserProjects(filtered);
            fetchUserCollections();
        }
    }, [user, projects]);

    const fetchUserCollections = async () => {
        if (!user) return;
        try {
            const collectionsRef = collection(db, "users", user.uid, "collections");
            const snapshot = await getDocs(collectionsRef);
            const collectionsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUserCollections(collectionsData);
        } catch (error) {
            console.log("error fetching user collections:", error);
        }
    };

    const updateProfile = async () => {
        if (!user || !displayName.trim()) return;
        
        try {
            await setDoc(doc(db, "users", user.uid), {
                ...user,
                displayName: displayName,
                updatedAt: new Date()
            }, { merge: true });
            setIsEditing(false);
        } catch (error) {
            console.log("error updating profile:", error);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(parseInt(timestamp));
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timestamp) => {
        const date = new Date(parseInt(timestamp));
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="w-full py-6 px-4">
            {/* profile header */}
            <div className="bg-secondary p-6 rounded-lg mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-theme rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.photoURL ? (
                            <img
                                src={user?.photoURL}
                                alt={user?.displayName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"
                        )}
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
                        <p className="text-primaryText text-sm">
                            member since {new Date(user?.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                        </p>
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
                    <h3 className="text-2xl font-bold text-theme">{userCollections.length}</h3>
                    <p className="text-primaryText">collections</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg text-center">
                    <h3 className="text-2xl font-bold text-theme">0</h3>
                    <p className="text-primaryText">followers</p>
                </div>
            </div>

            {/* my projects */}
            <div className="bg-secondary p-6 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">my projects</h2>
                    <Link 
                        to="/newProject"
                        className="bg-theme hover:bg-themedark px-4 py-2 rounded-lg text-white font-semibold transition-colors"
                    >
                        create new
                    </Link>
                </div>
                
                {userProjects.length > 0 ? (
                    <div className="space-y-3">
                        {userProjects.map((project) => (
                            <Link 
                                key={project.id} 
                                to={`/home/projectPage/${project.id}`}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    className="bg-primary p-4 rounded-lg border border-gray-700 hover:border-theme transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold text-lg mb-1">
                                                {project.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-primaryText">
                                                <span>by {project.user?.displayName || project.user?.email?.split("@")[0]}</span>
                                                <span>•</span>
                                                <span>created {formatDate(project.id)}</span>
                                                <span>•</span>
                                                <span>{formatTime(project.id)}</span>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-primaryText mb-4">no projects yet</p>
                        <Link 
                            to="/newProject"
                            className="bg-theme hover:bg-themedark px-6 py-3 rounded-lg text-white font-semibold transition-colors"
                        >
                            create your first project
                        </Link>
                    </div>
                )}
            </div>

            {/* my collections */}
            <div className="bg-secondary p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">my collections</h2>
                    <Link 
                        to="/home/collections"
                        className="bg-theme hover:bg-themedark px-4 py-2 rounded-lg text-white font-semibold transition-colors"
                    >
                        manage collections
                    </Link>
                </div>
                
                {userCollections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userCollections.map((collection) => (
                            <Link 
                                key={collection.id} 
                                to="/home/collections"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-primary p-4 rounded-lg border border-gray-700 hover:border-theme transition-colors"
                                >
                                    <h3 className="text-white font-semibold mb-2">{collection.name}</h3>
                                    <div className="text-sm text-primaryText">
                                        <p>{collection.projects?.length || 0} projects</p>
                                        <p>created {formatDate(collection.id)}</p>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-primaryText mb-4">no collections yet</p>
                        <Link 
                            to="/home/collections"
                            className="bg-theme hover:bg-themedark px-6 py-3 rounded-lg text-white font-semibold transition-colors"
                        >
                            create your first collection
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;