import React, { useEffect, useState, useCallback } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { FaHtml5, FaCss3, FaJs, FaChevronDown } from "react-icons/fa6";
import { FcSettings } from "react-icons/fc";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import Logo from "../assets/img/logo.png";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { MdCheck, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { UserProfileDetails } from "../components";
import { db } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { Alert } from "../components";

const NewProject = () => {
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [js, setJs] = useState("");
    const [output, setOutput] = useState("");
    const [title, setTitle] = useState("Untitled");
    const user = useSelector((state) => state.user?.user);
    const [alert, setAlert] = useState(false);
    const [isTitle, setIsTitle] = useState(false);
    const navigate = useNavigate(); // Added navigate hook

    const updateOutput = useCallback(() => {
        const combinedOutput = `
            <html>
                <head>
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                    <script>${js}</script>
                </body>
            </html>
        `;
        setOutput(combinedOutput);
    }, [html, css, js]);

    useEffect(() => {
        updateOutput();
    }, [updateOutput]);

    const saveCard = async () => {
        const id = `${Date.now()}`;
        const _doc = {
            id: id,
            title: title,
            html: html,
            css: css,
            js: js,
            output: output,
            user: {
                ...user,
                uid: user.uid 
            },
        };
        
        try {
            await setDoc(doc(db, "Projects", id), _doc);
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
                navigate("/home/projects"); // Redirect to home after saving
            }, 2000);
        } catch (err) {
            console.log("Error saving project:", err);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col overflow-hidden bg-primary">
            <AnimatePresence>
                {alert && <Alert status={"Success"} alertMsg={"Project Saved..."} />}
            </AnimatePresence>
            
            {/* Header */}
            <header className="w-full flex items-center justify-between px-4 py-3 bg-secondary border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <Link to={"/home/projects"}>
                        <img
                            src={Logo}
                            alt="Logo"
                            className="w-32 h-auto object-contain"
                        />
                    </Link>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <AnimatePresence>
                                {isTitle ? (
                                    <motion.input
                                        key={"TitleInput"}
                                        type="text"
                                        placeholder="Your Title"
                                        className="px-3 py-2 rounded-md bg-transparent text-primaryText text-base outline-none border border-gray-600 focus:border-theme"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setIsTitle(false);
                                            }
                                        }}
                                    />
                                ) : (
                                    <motion.p
                                        key={"TitleLabel"}
                                        className="px-3 py-2 text-white text-lg font-semibold"
                                    >
                                        {title}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                            <AnimatePresence>
                                {isTitle ? (
                                    <motion.div
                                        key={"MdCheck"}
                                        whileTap={{ scale: 0.9 }}
                                        className="cursor-pointer"
                                        onClick={() => setIsTitle(false)}
                                    >
                                        <MdCheck className="text-2xl text-theme" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={"MdEdit"}
                                        whileTap={{ scale: 0.9 }}
                                        className="cursor-pointer"
                                        onClick={() => setIsTitle(true)}
                                    >
                                        <MdEdit className="text-2xl text-primaryText hover:text-theme" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="flex items-center gap-2 px-3">
                            <p className="text-primaryText text-sm">
                                {user?.displayName || `${user?.email?.split("@")[0]}`}
                            </p>
                            {/* Removed the Follow button since it's the user's own project */}
                        </div>
                    </div>
                </div>

                {user && (
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={saveCard}
                            className="px-6 py-3 bg-theme hover:bg-themedark text-white rounded-md font-semibold transition-colors"
                        >
                            Save
                        </motion.button>
                        <UserProfileDetails />
                    </div>
                )}
            </header>

            {/* Main Editor Area */}
            <div className="flex-1 overflow-hidden">
                <PanelGroup direction="vertical" className="h-full">
                    {/* Code Editors */}
                    <Panel defaultSize={60} minSize={30}>
                        <PanelGroup direction="horizontal" className="h-full">
                            {/* HTML Panel */}
                            <Panel className="bg-secondary" collapsible={true} collapsedSize={5} minSize={20}>
                                <div className="h-full flex flex-col">
                                    <div className="flex items-center justify-between bg-secondary border-b border-gray-600 px-4 py-2 flex-shrink-0">
                                        <div className="flex items-center gap-2">
                                            <FaHtml5 className="text-lg text-red-500" />
                                            <span className="text-primaryText font-medium">HTML</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FcSettings className="text-lg cursor-pointer" />
                                            <FaChevronDown className="text-lg text-primaryText cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <CodeMirror
                                            value={html}
                                            height="100%"
                                            theme="dark"
                                            extensions={[javascript({ jsx: true })]}
                                            onChange={(value) => setHtml(value)}
                                            className="h-full"
                                        />
                                    </div>
                                </div>
                            </Panel>

                            <PanelResizeHandle className="w-1 bg-gray-600 hover:bg-theme transition-colors" />

                            {/* CSS Panel */}
                            <Panel className="bg-secondary" collapsible={true} collapsedSize={5} minSize={20}>
                                <div className="h-full flex flex-col">
                                    <div className="flex items-center justify-between bg-secondary border-b border-gray-600 px-4 py-2 flex-shrink-0">
                                        <div className="flex items-center gap-2">
                                            <FaCss3 className="text-lg text-sky-500" />
                                            <span className="text-primaryText font-medium">CSS</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FcSettings className="text-lg cursor-pointer" />
                                            <FaChevronDown className="text-lg text-primaryText cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <CodeMirror
                                            value={css}
                                            height="100%"
                                            theme="dark"
                                            extensions={[javascript({ jsx: true })]}
                                            onChange={(value) => setCss(value)}
                                            className="h-full"
                                        />
                                    </div>
                                </div>
                            </Panel>

                            <PanelResizeHandle className="w-1 bg-gray-600 hover:bg-theme transition-colors" />

                            {/* JavaScript Panel */}
                            <Panel className="bg-secondary" collapsible={true} collapsedSize={5} minSize={20}>
                                <div className="h-full flex flex-col">
                                    <div className="flex items-center justify-between bg-secondary border-b border-gray-600 px-4 py-2 flex-shrink-0">
                                        <div className="flex items-center gap-2">
                                            <FaJs className="text-lg text-yellow-500" />
                                            <span className="text-primaryText font-medium">JS</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FcSettings className="text-lg cursor-pointer" />
                                            <FaChevronDown className="text-lg text-primaryText cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <CodeMirror
                                            value={js}
                                            height="100%"
                                            theme="dark"
                                            extensions={[javascript({ jsx: true })]}
                                            onChange={(value) => setJs(value)}
                                            className="h-full"
                                        />
                                    </div>
                                </div>
                            </Panel>
                        </PanelGroup>
                    </Panel>

                    <PanelResizeHandle className="h-1 bg-gray-600 hover:bg-theme transition-colors" />

                    {/* Output Panel */}
                    <Panel defaultSize={40} minSize={20}>
                        <div className="h-full bg-white">
                            <iframe
                                title="Output"
                                srcDoc={output}
                                className="w-full h-full border-none"
                                sandbox="allow-scripts"
                            />
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
};

export default NewProject;