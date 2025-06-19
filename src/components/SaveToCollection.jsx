import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdBookmark, MdClose, MdRemove, MdAdd } from "react-icons/md";
import { useSelector } from "react-redux";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";
import { db } from "../config/firebase.config";

const SaveToCollection = ({ project, onClose, onSaveSuccess }) => {
    const user = useSelector((state) => state.user?.user);
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [projectCollections, setProjectCollections] = useState(new Set());
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");

    useEffect(() => {
        if (user) {
            fetchCollections();
        }
    }, [user]);

    const fetchCollections = async () => {
        try {
            const collectionsRef = collection(db, "users", user.uid, "collections");
            const snapshot = await getDocs(collectionsRef);
            const collectionsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCollections(collectionsData);

            // check which collections already have this project
            const savedCollections = new Set();
            collectionsData.forEach(col => {
                if (col.projects?.includes(project.id)) {
                    savedCollections.add(col.id);
                }
            });
            setProjectCollections(savedCollections);
        } catch (error) {
            console.log("error fetching collections:", error);
        }
    };

    const createNewCollection = async () => {
        if (!newCollectionName.trim() || !user) return;
        
        setIsLoading(true);
        const collectionId = `${Date.now()}`;
        const collectionData = {
            id: collectionId,
            name: newCollectionName,
            projects: [project.id], // immediately add current project
            createdAt: new Date(),
        };

        try {
            await setDoc(doc(db, "users", user.uid, "collections", collectionId), collectionData);
            setCollections([...collections, collectionData]);
            setProjectCollections(prev => new Set([...prev, collectionId]));
            setNewCollectionName("");
            setIsCreatingNew(false);
            
            if (onSaveSuccess) {
                onSaveSuccess();
            }
        } catch (error) {
            console.log("error creating collection:", error);
        }
        setIsLoading(false);
    };

    const saveToCollection = async (collectionId) => {
        if (!user || !project) return;
        
        setIsLoading(true);
        try {
            const collectionRef = doc(db, "users", user.uid, "collections", collectionId);
            await updateDoc(collectionRef, {
                projects: arrayUnion(project.id)
            });
            
            setProjectCollections(prev => new Set([...prev, collectionId]));
            
            if (onSaveSuccess) {
                onSaveSuccess();
            }
        } catch (error) {
            console.log("error saving to collection:", error);
        }
        setIsLoading(false);
    };

    const removeFromCollection = async (collectionId) => {
        if (!user || !project) return;
        
        setIsLoading(true);
        try {
            const collectionRef = doc(db, "users", user.uid, "collections", collectionId);
            await updateDoc(collectionRef, {
                projects: arrayRemove(project.id)
            });
            
            setProjectCollections(prev => {
                const newSet = new Set(prev);
                newSet.delete(collectionId);
                return newSet;
            });
            
            if (onSaveSuccess) {
                onSaveSuccess();
            }
        } catch (error) {
            console.log("error removing from collection:", error);
        }
        setIsLoading(false);
    };

    const handleCollectionClick = (collectionId) => {
        if (projectCollections.has(collectionId)) {
            removeFromCollection(collectionId);
        } else {
            saveToCollection(collectionId);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-secondary p-6 rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">manage collections</h3>
                        <button
                            onClick={onClose}
                            className="text-primaryText hover:text-white"
                        >
                            <MdClose className="text-xl" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {/* Create new collection option */}
                        {isCreatingNew ? (
                            <div className="bg-primary p-4 rounded-lg border border-theme">
                                <input
                                    type="text"
                                    placeholder="collection name"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    className="w-full bg-secondary text-white px-3 py-2 rounded border border-gray-600 focus:border-theme outline-none mb-3"
                                    onKeyPress={(e) => e.key === 'Enter' && createNewCollection()}
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={createNewCollection}
                                        disabled={!newCollectionName.trim() || isLoading}
                                        className="bg-theme hover:bg-themedark px-4 py-2 rounded text-white font-semibold disabled:opacity-50 flex-1"
                                    >
                                        {isLoading ? "creating..." : "create & save"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsCreatingNew(false);
                                            setNewCollectionName("");
                                        }}
                                        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
                                    >
                                        cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsCreatingNew(true)}
                                className="w-full p-3 rounded-lg text-white text-left transition-colors flex items-center gap-3 bg-primary hover:bg-gray-700 border border-dashed border-theme"
                            >
                                <MdAdd className="text-theme" />
                                <div className="flex-1">
                                    <p className="font-semibold text-theme">create new collection</p>
                                    <p className="text-sm text-primaryText">
                                        make a new collection and save this project
                                    </p>
                                </div>
                            </motion.button>
                        )}

                        {collections.length > 0 && (
                            <>
                                {/* Divider */}
                                <div className="flex items-center gap-3 py-2">
                                    <div className="flex-1 h-px bg-gray-600"></div>
                                    <span className="text-sm text-primaryText">existing collections</span>
                                    <div className="flex-1 h-px bg-gray-600"></div>
                                </div>

                                {/* Existing collections */}
                                {collections.map((collection) => {
                                    const isInCollection = projectCollections.has(collection.id);
                                    return (
                                        <motion.button
                                            key={collection.id}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleCollectionClick(collection.id)}
                                            disabled={isLoading}
                                            className={`w-full p-3 rounded-lg text-white text-left transition-colors flex items-center gap-3 ${
                                                isInCollection 
                                                    ? 'bg-theme hover:bg-themedark border border-theme' 
                                                    : 'bg-primary hover:bg-gray-700 border border-gray-700'
                                            }`}
                                        >
                                            {isInCollection ? (
                                                <MdRemove className="text-white" />
                                            ) : (
                                                <MdBookmark className="text-theme" />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-semibold">{collection.name}</p>
                                                <p className="text-sm text-primaryText">
                                                    {collection.projects?.length || 0} projects
                                                </p>
                                            </div>
                                            <span className="text-xs text-primaryText">
                                                {isInCollection ? 'click to remove' : 'click to add'}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </>
                        )}

                        {collections.length === 0 && !isCreatingNew && (
                            <div className="text-center py-4">
                                <p className="text-primaryText mb-3">no collections yet</p>
                                <p className="text-primaryText text-sm">create your first collection above to save projects</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SaveToCollection;