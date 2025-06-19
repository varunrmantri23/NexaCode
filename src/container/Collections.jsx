import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MdAdd, MdDelete, MdFolder, MdFolderOpen, MdRemove } from "react-icons/md";
import { setDoc, doc, deleteDoc, collection, getDocs, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { Link } from "react-router-dom";

const Collections = () => {
    const user = useSelector((state) => state.user?.user);
    const allProjects = useSelector((state) => state.projects?.projects);
    const [collections, setCollections] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [expandedCollection, setExpandedCollection] = useState(null);

    useEffect(() => {
        if (user) {
            fetchCollections();
        }
    }, [user]);

    const fetchCollections = async () => {
        if (!user) return;
        try {
            const collectionsRef = collection(db, "users", user.uid, "collections");
            const snapshot = await getDocs(collectionsRef);
            const collectionsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCollections(collectionsData);
        } catch (error) {
            console.log("error fetching collections:", error);
        }
    };

    const createCollection = async () => {
        if (!newCollectionName.trim() || !user) return;
        
        const collectionId = `${Date.now()}`;
        const collectionData = {
            id: collectionId,
            name: newCollectionName,
            projects: [],
            createdAt: new Date(),
        };

        try {
            await setDoc(doc(db, "users", user.uid, "collections", collectionId), collectionData);
            setCollections([...collections, collectionData]);
            setNewCollectionName("");
            setIsCreating(false);
        } catch (error) {
            console.log("error creating collection:", error);
        }
    };

    const deleteCollection = async (collectionId) => {
        try {
            await deleteDoc(doc(db, "users", user.uid, "collections", collectionId));
            setCollections(collections.filter(col => col.id !== collectionId));
        } catch (error) {
            console.log("error deleting collection:", error);
        }
    };

    const removeProjectFromCollection = async (collectionId, projectId) => {
        try {
            const collectionRef = doc(db, "users", user.uid, "collections", collectionId);
            await updateDoc(collectionRef, {
                projects: arrayRemove(projectId)
            });
            
            // update local state
            setCollections(prev => 
                prev.map(col => 
                    col.id === collectionId 
                        ? { ...col, projects: col.projects.filter(id => id !== projectId) }
                        : col
                )
            );
        } catch (error) {
            console.log("error removing project from collection:", error);
        }
    };

    const getProjectsInCollection = (projectIds) => {
        if (!projectIds || !allProjects) return [];
        return allProjects.filter(project => projectIds.includes(project.id));
    };

    return (
        <div className="w-full py-6 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">My Collections</h1>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCreating(true)}
                    className="bg-theme hover:bg-themedark px-4 py-2 rounded-lg text-white font-semibold transition-colors flex items-center gap-2"
                >
                    <MdAdd className="text-xl" />
                    New collection
                </motion.button>
            </div>

            {/* create collection form */}
            {isCreating && (
                <div className="bg-secondary p-4 rounded-lg mb-6">
                    <input
                        type="text"
                        placeholder="collection name"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        className="w-full bg-primary text-white px-3 py-2 rounded border border-gray-600 focus:border-theme outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && createCollection()}
                    />
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={createCollection}
                            className="bg-theme hover:bg-themedark px-4 py-2 rounded text-white"
                        >
                            create
                        </button>
                        <button
                            onClick={() => {
                                setIsCreating(false);
                                setNewCollectionName("");
                            }}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
                        >
                            cancel
                        </button>
                    </div>
                </div>
            )}

            {/* collections list */}
            <div className="space-y-4">
                {collections.map((collection) => {
                    const projectsInCollection = getProjectsInCollection(collection.projects);
                    const isExpanded = expandedCollection === collection.id;
                    
                    return (
                        <motion.div
                            key={collection.id}
                            className="bg-secondary rounded-lg border border-gray-700 hover:border-theme transition-colors"
                        >
                            <div className="p-4">
                                <div className="flex justify-between items-center">
                                    <div 
                                        className="flex items-center gap-3 cursor-pointer flex-1"
                                        onClick={() => setExpandedCollection(isExpanded ? null : collection.id)}
                                    >
                                        {isExpanded ? (
                                            <MdFolderOpen className="text-2xl text-theme" />
                                        ) : (
                                            <MdFolder className="text-2xl text-theme" />
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
                                            <p className="text-primaryText text-sm">
                                                {collection.projects?.length || 0} projects
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteCollection(collection.id)}
                                        className="text-red-400 hover:text-red-300 p-2"
                                    >
                                        <MdDelete className="text-xl" />
                                    </button>
                                </div>

                                {/* expanded projects - simple list view */}
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-4 pt-4 border-t border-gray-700"
                                    >
                                        {projectsInCollection.length > 0 ? (
                                            <div className="space-y-2">
                                                {projectsInCollection.map((project) => (
                                                    <div key={project.id} className="flex items-center gap-3">
                                                        <Link 
                                                            to={`/home/projectPage/${project.id}`}
                                                            className="flex-1"
                                                        >
                                                            <motion.div
                                                                whileHover={{ scale: 1.01 }}
                                                                className="bg-primary p-3 rounded-lg border border-gray-700 hover:border-theme transition-colors flex items-center justify-between"
                                                            >
                                                                <div>
                                                                    <h4 className="text-white font-semibold text-sm">
                                                                        {project.title}
                                                                    </h4>
                                                                    <p className="text-primaryText text-xs">
                                                                        by {project.user?.displayName || project.user?.email?.split("@")[0]}
                                                                    </p>
                                                                </div>
                                                                <div className="text-primaryText text-xs">
                                                                    {new Date(parseInt(project.id)).toLocaleDateString()}
                                                                </div>
                                                            </motion.div>
                                                        </Link>
                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => removeProjectFromCollection(collection.id, project.id)}
                                                            className="text-red-400 hover:text-red-300 p-2"
                                                            title="remove from collection"
                                                        >
                                                            <MdRemove className="text-lg" />
                                                        </motion.button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-primaryText text-center py-4">
                                                no projects saved yet
                                            </p>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {collections.length === 0 && !isCreating && (
                <div className="text-center py-12">
                    <MdFolder className="text-6xl text-primaryText mx-auto mb-4 opacity-50" />
                    <p className="text-primaryText text-lg">no collections yet</p>
                    <p className="text-primaryText text-sm mt-2">create collections to organize your saved projects</p>
                </div>
            )}
        </div>
    );
};

export default Collections;