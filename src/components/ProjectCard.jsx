import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SaveToCollection from "./SaveToCollection";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.config";

const ProjectCard = ({ project, index }) => {
    const user = useSelector((state) => state.user?.user);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // check if project is saved in any collection
    useEffect(() => {
        const checkIfSaved = async () => {
            if (!user || !project) return;
            
            try {
                const collectionsRef = collection(db, "users", user.uid, "collections");
                const snapshot = await getDocs(collectionsRef);
                
                const isProjectSaved = snapshot.docs.some(doc => {
                    const collectionData = doc.data();
                    return collectionData.projects?.includes(project.id);
                });
                
                setIsSaved(isProjectSaved);
            } catch (error) {
                console.log("error checking if saved:", error);
            }
        };

        checkIfSaved();
    }, [user, project]);

    const handleSaveClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (user) {
            setShowSaveModal(true); // always show modal, even if already saved
        }
    };

    const handleSaveSuccess = () => {
        setShowSaveModal(false);
        // refresh saved state
        const checkIfSaved = async () => {
            if (!user || !project) return;
            
            try {
                const collectionsRef = collection(db, "users", user.uid, "collections");
                const snapshot = await getDocs(collectionsRef);
                
                const isProjectSaved = snapshot.docs.some(doc => {
                    const collectionData = doc.data();
                    return collectionData.projects?.includes(project.id);
                });
                
                setIsSaved(isProjectSaved);
            } catch (error) {
                console.log("error checking if saved:", error);
            }
        };
        checkIfSaved();
    };

    return (
        <>
            <Link to={`/home/projectPage/${project.id}`}>
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="w-full cursor-pointer md:w-[450px] h-[375px] bg-secondary rounded-md p-4 flex flex-col items-center justify-center gap-4 hover:bg-gray-700 transition-colors"
                >
                    <div className="bg-primary w-full h-full overflow-hidden rounded-md">
                        <iframe
                            title="project preview"
                            srcDoc={project.output}
                            className="w-full h-full border-none"
                        />
                    </div>

                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden cursor-pointer bg-theme">
                                {project?.user?.photoURL ? (
                                    <img
                                        src={project?.user?.photoURL}
                                        alt={project?.user?.displayName}
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <p className="text-lg text-white font-semibold">
                                        {project?.user?.email?.[0]?.toUpperCase() || "U"}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-white text-lg font-semibold">{project?.title}</p>
                                <p className="text-primaryText text-sm">
                                    {project?.user?.displayName || 
                                     project?.user?.email?.split("@")[0] || 
                                     "unknown"}
                                </p>
                            </div>
                        </div>

                        {user && (
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSaveClick}
                                className={`cursor-pointer p-2 transition-colors ${
                                    isSaved 
                                        ? 'text-theme' 
                                        : 'text-primaryText hover:text-theme'
                                }`}
                                title={isSaved ? "manage collections" : "save to collection"}
                            >
                                {isSaved ? (
                                    <MdBookmark className="text-2xl" />
                                ) : (
                                    <MdBookmarkBorder className="text-2xl" />
                                )}
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </Link>

            {showSaveModal && (
                <SaveToCollection
                    project={project}
                    onClose={() => setShowSaveModal(false)}
                    onSaveSuccess={handleSaveSuccess}
                />
            )}
        </>
    );
};

export default ProjectCard;