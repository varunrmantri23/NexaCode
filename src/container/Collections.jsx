// src/container/Collections.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { setDoc, doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.config";

const Collections = () => {
    const user = useSelector((state) => state.user?.user);
    const [collections, setCollections] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");

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
                    New Collection
                </motion.button>
            </div>

            {/* create new collection */}
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
                            Create
                        </button>
                        <button
                            onClick={() => {
                                setIsCreating(false);
                                setNewCollectionName("");
                            }}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* collections grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                    <motion.div
                        key={collection.id}
                        className="bg-secondary p-4 rounded-lg border border-gray-700 hover:border-theme transition-colors"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
                            <button
                                onClick={() => deleteCollection(collection.id)}
                                className="text-red-400 hover:text-red-300"
                            >
                                <MdDelete className="text-xl" />
                            </button>
                        </div>
                        <p className="text-primaryText text-sm">
                            {collection.projects?.length || 0} projects
                        </p>
                    </motion.div>
                ))}
            </div>

            {collections.length === 0 && !isCreating && (
                <div className="text-center py-12">
                    <p className="text-primaryText text-lg">no collections yet</p>
                    <p className="text-primaryText text-sm mt-2">create your first collection to organize projects</p>
                </div>
            )}
        </div>
    );
};

export default Collections;