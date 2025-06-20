import React, { useEffect, useState, useCallback, useMemo } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { FaHtml5, FaCss3, FaJs, FaChevronDown } from "react-icons/fa6";
import { FcSettings } from "react-icons/fc";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import Logo from "../assets/img/logo.png";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MdCheck, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { Alert } from "../components";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase.config";

// debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const ProjectPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const projects = useSelector((state) => state.projects?.projects);
    const user = useSelector((state) => state.user?.user);
    const foundProject = projects?.find((proj) => proj.id === projectId);

    const [htmlCode, setHtmlCode] = useState("");
    const [cssCode, setCssCode] = useState("");
    const [jsCode, setJsCode] = useState("");
    const [output, setOutput] = useState("");
    const [title, setTitle] = useState("Untitled");
    const [alert, setAlert] = useState(false);
    const [isTitle, setIsTitle] = useState(false);

    // debounce code changes for better performance
    const debouncedHtml = useDebounce(htmlCode, 300);
    const debouncedCss = useDebounce(cssCode, 300);
    const debouncedJs = useDebounce(jsCode, 300);

    const isOwner = user && foundProject && user.uid === foundProject.user?.uid;

    useEffect(() => {
        if (foundProject) {
            setHtmlCode(foundProject.html || "");
            setCssCode(foundProject.css || "");
            setJsCode(foundProject.js || "");
            setTitle(foundProject.title || "Untitled");
        }
    }, [foundProject]);

    // memoized output update - only runs when debounced values change
    const combinedOutput = useMemo(() => {
        return `
            <html>
                <head>
                    <style>${debouncedCss}</style>
                </head>
                <body>
                    ${debouncedHtml}
                    <script>${debouncedJs}</script>
                </body>
            </html>
        `;
    }, [debouncedHtml, debouncedCss, debouncedJs]);

    useEffect(() => {
        setOutput(combinedOutput);
    }, [combinedOutput]);

    // memoized change handlers to prevent unnecessary re-renders
    const handleHtmlChange = useCallback((value) => {
        if (isOwner) {
            setHtmlCode(value);
        }
    }, [isOwner]);

    const handleCssChange = useCallback((value) => {
        if (isOwner) {
            setCssCode(value);
        }
    }, [isOwner]);

    const handleJsChange = useCallback((value) => {
        if (isOwner) {
            setJsCode(value);
        }
    }, [isOwner]);

    const handleTitleChange = useCallback((e) => {
        setTitle(e.target.value);
    }, []);

    if (!foundProject) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-primary">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
                    <p className="text-primaryText mb-6">The project you're looking for doesn't exist.</p>
                    <Link 
                        to="/home/projects"
                        className="bg-theme hover:bg-themedark px-6 py-3 rounded-lg text-white font-semibold transition-colors"
                    >
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    const saveProject = async () => {
        if (!isOwner || !foundProject || !user) {
            console.log("Cannot save: not owner or missing data");
            return;
        }
        
        const updatedProject = {
            ...foundProject,
            title: title,
            html: htmlCode,
            css: cssCode,
            js: jsCode,
            output: output,
            user: {
                ...foundProject.user,
                uid: foundProject.user.uid
            }
        };
        
        try {
            console.log("Saving project with data:", updatedProject);
            await setDoc(doc(db, "Projects", foundProject.id), updatedProject);
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 2000);
        } catch (err) {
            console.log("Error updating project:", err);
        }
    };

    return (
        <div className="w-full h-screen max-h-screen flex flex-col overflow-hidden bg-primary">
            <AnimatePresence>
                {alert && <Alert status={"Success"} alertMsg={"Project Updated..."} />}
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
                                {isTitle && isOwner ? (
                                    <motion.input
                                        key={"TitleInput"}
                                        type="text"
                                        placeholder="Your Title"
                                        className="px-3 py-2 rounded-md bg-transparent text-primaryText text-base outline-none border border-gray-600 focus:border-theme"
                                        value={title}
                                        onChange={handleTitleChange}
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
                                {isOwner && (
                                    isTitle ? (
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
                                    )
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="flex items-center gap-2 px-3">
                            <p className="text-primaryText text-sm">
                                {foundProject?.user?.displayName || `${foundProject?.user?.email?.split("@")[0]}`}
                            </p>
                            {!isOwner && (
                                <motion.p
                                    whileTap={{ scale: 0.9 }}
                                    className="text-xs bg-theme hover:bg-themedark rounded-sm px-2 py-1 text-primary font-semibold cursor-pointer transition-colors"
                                >
                                    + Follow
                                </motion.p>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    {isOwner && (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={saveProject}
                            className="px-6 py-3 bg-theme hover:bg-themedark text-white rounded-md font-semibold transition-colors"
                        >
                            Save
                        </motion.button>
                    )}
                    <Link
                        to="/home/projects"
                        className="px-4 py-2 bg-secondary hover:bg-gray-700 text-primaryText rounded-md font-semibold transition-colors border border-gray-600"
                    >
                        ← Back
                    </Link>
                </div>
            </header>

            {/* Main Editor Area */}
            <div className="flex-1 overflow-hidden">
                <PanelGroup direction="vertical" className="h-full">
                    <Panel defaultSize={60} minSize={30}>
                        <PanelGroup direction="horizontal" className="h-full">
                            {/* HTML Panel */}
                            <Panel className="bg-primary" collapsible={true} collapsedSize={5} minSize={20}>
                                <div className="h-full flex flex-col">
                                    <div className="bg-secondary px-4 py-3 border-t-4 border-t-red-500 flex items-center justify-between shadow-md">
                                        <div className="flex items-center gap-3">
                                            <FaHtml5 className="text-xl text-red-500" />
                                            <p className="text-primaryText font-semibold">HTML</p>
                                        </div>
                                        <div className="cursor-pointer flex items-center justify-center gap-3">
                                            <FcSettings className="text-xl" />
                                            <FaChevronDown className="text-xl text-primaryText" />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-hidden bg-primary">
                                        <CodeMirror
                                            value={htmlCode}
                                            height="100%"
                                            theme="dark"
                                            extensions={[html()]}
                                            onChange={handleHtmlChange}
                                            editable={isOwner}
                                            className="h-full"
                                            basicSetup={{
                                                lineNumbers: true,
                                                foldGutter: true,
                                                dropCursor: false,
                                                allowMultipleSelections: false,
                                            }}
                                        />
                                    </div>
                                </div>
                            </Panel>

                            <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-theme transition-colors" />

                            {/* CSS Panel */}
                            <Panel className="bg-primary" collapsible={true} collapsedSize={5} minSize={20}>
                                <div className="h-full flex flex-col">
                                    <div className="bg-secondary px-4 py-3 border-t-4 border-t-sky-500 flex items-center justify-between shadow-md">
                                        <div className="flex items-center gap-3">
                                            <FaCss3 className="text-xl text-sky-500" />
                                            <p className="text-primaryText font-semibold">CSS</p>
                                        </div>
                                        <div className="cursor-pointer flex items-center justify-center gap-3">
                                            <FcSettings className="text-xl" />
                                            <FaChevronDown className="text-xl text-primaryText" />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-hidden bg-primary">
                                        <CodeMirror
                                            value={cssCode}
                                            height="100%"
                                            theme="dark"
                                            extensions={[css()]}
                                            onChange={handleCssChange}
                                            editable={isOwner}
                                            className="h-full"
                                            basicSetup={{
                                                lineNumbers: true,
                                                foldGutter: true,
                                                dropCursor: false,
                                                allowMultipleSelections: false,
                                            }}
                                        />
                                    </div>
                                </div>
                            </Panel>

                            <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-theme transition-colors" />

                            {/* JavaScript Panel */}
                            <Panel className="bg-primary" collapsible={true} collapsedSize={5} minSize={20}>
                                <div className="h-full flex flex-col">
                                    <div className="bg-secondary px-4 py-3 border-t-4 border-t-yellow-500 flex items-center justify-between shadow-md">
                                        <div className="flex items-center gap-3">
                                            <FaJs className="text-xl text-yellow-500" />
                                            <p className="text-primaryText font-semibold">JS</p>
                                        </div>
                                        <div className="cursor-pointer flex items-center justify-center gap-3">
                                            <FcSettings className="text-xl" />
                                            <FaChevronDown className="text-xl text-primaryText" />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-hidden bg-primary">
                                        <CodeMirror
                                            value={jsCode}
                                            height="100%"
                                            theme="dark"
                                            extensions={[javascript()]}
                                            onChange={handleJsChange}
                                            editable={isOwner}
                                            className="h-full"
                                            basicSetup={{
                                                lineNumbers: true,
                                                foldGutter: true,
                                                dropCursor: false,
                                                allowMultipleSelections: false,
                                            }}
                                        />
                                    </div>
                                </div>
                            </Panel>
                        </PanelGroup>
                    </Panel>

                    <PanelResizeHandle className="h-1 bg-gray-700 hover:bg-theme transition-colors" />

                    {/* Output Panel */}
                    <Panel defaultSize={40} minSize={20}>
                        <div className="h-full bg-white">
                            <iframe
                                title="Output"
                                srcDoc={output}
                                className="w-full h-full border-none"
                                sandbox="allow-scripts allow-same-origin"
                            />
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
};

export default ProjectPage;
