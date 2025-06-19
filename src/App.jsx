import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Home, NewProject } from "./container";
import { auth, db } from "./config/firebase.config";
import { collection, onSnapshot, orderBy, query, setDoc, doc } from "firebase/firestore";
import { Spinner } from "./components";
import Logo from "./assets/img/logo.png";
import { useDispatch } from "react-redux";
import { SET_USER } from "./context/actions/userActions";
import { SET_PROJECTS } from "./context/actions/projectActions";

const App = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();

    // auth state listener
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (userCred) => {
            if (userCred) {
                try {
                    await setDoc(
                        doc(db, "users", userCred.uid),
                        userCred.providerData[0],
                        { merge: true }
                    );
                    
                    dispatch(SET_USER(userCred.providerData[0]));
                    setUser(userCred.providerData[0]);
                    
                } catch (error) {
                    console.log("error saving user:", error);
                }
            } else {
                dispatch(SET_USER(null));
                setUser(null);
            }
            
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [dispatch]);

    // projects listener
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

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center overflow-hidden bg-primary">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="w-screen h-screen flex items-start justify-start overflow-hidden">
            <Routes>
                <Route path="/home/*" element={<Home />} />
                <Route path="/newProject" element={<NewProject />} />
                <Route path="*" element={<Navigate to={user ? "/home/projects" : "/home/auth"} />} />
            </Routes>
        </div>
    );
};

export default App;
