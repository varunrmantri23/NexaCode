import React , {useEffect, useState} from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { FaHtml5, FaCss3 ,FaJs , FaChevronDown } from "react-icons/fa6";
import { FcSettings } from "react-icons/fc";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import Logo from "../assets/img/logo.png";
import { AnimatePresence, motion } from "framer-motion";
import { Link} from "react-router-dom";
import { MdCheck, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { UserProfileDetails } from "../components";
import {db } from "../config/firebase.config"
import { doc, setDoc } from "firebase/firestore";
import {Alert} from "../components";


const NewProject = () => {
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [js, setJs] = useState("");
    const [output, setOutput] = useState("");
    const [title, setTitle] = useState("Untitled");
    const user = useSelector((state)=> state.user.user);
    const [alert, setAlert] = useState(false);


    const [isTitle, setIsTitle] = useState(false);
      useEffect(()=>{
        updateOutput();
      },[html,css,js])
      const updateOutput = () => {
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
      }
      const saveCard = async () => {
        const id = `${Date.now()}`
        const _doc = {
            id: id,
            title: title,
            html: html, 
            css: css, 
            js: js, 
            output: output,
            user :  user
        }
        await setDoc(doc(db,"Projects",id),_doc).then((res) =>{
            setAlert(true)
        }).catch((err)=>{
            console.log(err)
        })
        setInterval(() => {
            setAlert(false)
        }, 2000);
      }
    return (
        <>
            <div className="w-screen h-screen flex flex-col gap-4 items-start justify-start overflow-hidden my-6 mx-3 ">
                <AnimatePresence>
                    {alert && <Alert status={"Success"} alertMsg = {"Project Saved..."}/>}
                </AnimatePresence>
                <header className="w-full flex items-center justify-between px-8 py-4">
                    <div className="flex items-center gap-3 justify-center ">
                        <Link to={"/home/projects"}>
                            <img
                                src={Logo}
                                alt="Logo"
                                className="w-40 left-0 h-fit-content object-contain"
                            ></img>
                        </Link>
                        <div className="flex flex-col items-start justify-start">
                            <div className="flex items-center gap-3 justify-center">
                                <AnimatePresence>
                                    {isTitle ? (
                                        <>
                                            <motion.input
                                                key={"TitleInput"}
                                                type="text"
                                                placeholder="Your Title"
                                                className="px-3 py-2 rounded-md bg-transparent text-primaryText text-base outline-none border-none"
                                                value={title}
                                                onChange={(e) => {
                                                    setTitle(e.target.value);
                                                }}
                                            ></motion.input>
                                        </>
                                    ) : (
                                        <>
                                            <motion.p
                                                key={"TitleLabel"}
                                                className="px-3 py-2 text-white text-lg"
                                            >
                                                {title}
                                            </motion.p>
                                        </>
                                    )}
                                </AnimatePresence>
                                <AnimatePresence>
                                    {isTitle ? (
                                        <>
                                            <motion.div
                                                key={"MdCheck"}
                                                whileTap={{ scale: 0.9 }}
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setIsTitle(false);
                                                }}
                                            >
                                                <MdCheck className="text-2xl text-theme" />
                                            </motion.div>
                                        </>
                                    ) : (
                                        <>
                                            <motion.div
                                                key={"MdEdit"}
                                                whileTap={{ scale: 0.9 }}
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setIsTitle(true);
                                                }}
                                            >
                                                <MdEdit className="text-2xl text-primaryText" />
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="flex items-center justify-center px-3 -mt-2 gap-2 ">
                                <p className="text-primaryText text-sm">
                                    {user?.displayName
                                        ? user?.displayName
                                        : `${user.email.split("@")[0]}`}
                                </p>
                                <motion.p
                                    whileTap={{ scale: 0.9 }}
                                    className="text-[10px] bg-theme rounded-sm px-2 py-[1px] text-primary font-semibold cursor-pointer"
                                >
                                    + Follow
                                </motion.p>
                            </div>
                        </div>
                    </div>
                    {user && (
                        <div className="flex items-center justify-center gap-4 ">
                            <motion.button whileTap={{scale: 0.9}} onClick={saveCard} className="px-6 py-4 bg-primaryText cursor-pointer text-base text-primary rounded-md font-semibold">
                                Save
                            </motion.button>
                            <UserProfileDetails/>
                        </div>
                    )}
                </header>
                <PanelGroup direction="vertical" className="gap-2">
                    <PanelGroup
                        id="horizontalpanel"
                        autoSaveId="persistence"
                        direction="horizontal"
                        className="gap-3 w-full"
                    >
                        <Panel
                            className="w-full bg-gray-800 text-xl text-white"
                            collapsible={true}
                            collapsedSize={5}
                            minSize={10}
                        >
                            <div className="w-full h-full flex-col flex items-start justify-start">
                                <div className="w-full flex items-center justify-between">
                                    <div className="bg-secondary px-4 py-4 border-t-4 flex items-center justify-center gap-3 border-t-gray-500">
                                        <FaHtml5 className="text-xl text-red-500 " />
                                        <p className="text-primaryText font-semibold ">
                                            Html
                                        </p>
                                    </div>
                                    <div className="cursor-pointer flex items-center justify-center gap-3 px-4">
                                        <FcSettings className="text-xl " />
                                        <FaChevronDown className="text-xl text-primaryText" />
                                    </div>
                                </div>
                                <div className="w-full px-2">
                                    <CodeMirror
                                        value={html}
                                        height="600px"
                                        theme={"dark"}
                                        extensions={[javascript({ jsx: true })]}
                                        onChange={(value, viewUpdate) => {
                                            setHtml(value);
                                        }}
                                    />
                                </div>
                            </div>
                        </Panel>
                        <PanelResizeHandle />
                        <Panel
                            className="w-full bg-gray-800 text-xl text-white"
                            collapsible={true}
                            collapsedSize={5}
                            minSize={10}
                        >
                            <div className="w-full h-full flex-col flex items-start justify-start">
                                <div className="w-full flex items-center justify-between">
                                    <div className="bg-secondary px-4 py-4 border-t-4 flex items-center justify-center gap-3 border-t-gray-500">
                                        <FaCss3 className="text-xl text-sky-500" />
                                        <p className="text-primaryText font-semibold ">
                                            Css
                                        </p>
                                    </div>
                                    <div className="cursor-pointer flex items-center justify-center gap-4 px-4">
                                        <FcSettings className="text-xl " />
                                        <FaChevronDown className="text-xl text-primaryText" />
                                    </div>
                                </div>
                                <div className="w-full px-2">
                                    <CodeMirror
                                        value={css}
                                        height="600px"
                                        theme={"dark"}
                                        extensions={[javascript({ jsx: true })]}
                                        onChange={(value, viewUpdate) => {
                                            setCss(value);
                                        }}
                                    />
                                </div>
                            </div>
                        </Panel>
                        <PanelResizeHandle />
                        <Panel
                            className="w-full bg-gray-800 text-xl text-white"
                            collapsible={true}
                            collapsedSize={5}
                            minSize={10}
                        >
                            <div className="w-full h-full flex-col flex items-start justify-start">
                                <div className="w-full flex items-center justify-between">
                                    <div className="bg-secondary px-4 py-4 border-t-4 flex items-center justify-center gap-3 border-t-gray-500">
                                        <FaJs className="text-xl text-yellow-500" />
                                        <p className="text-primaryText font-semibold ">
                                            Js
                                        </p>
                                    </div>
                                    <div className="cursor-pointer flex items-center justify-center gap-4 px-4">
                                        <FcSettings className="text-xl " />
                                        <FaChevronDown className="text-xl text-primaryText" />
                                    </div>
                                </div>
                                <div className="w-full px-2">
                                    <CodeMirror
                                        value={js}
                                        height="600px"
                                        theme={"dark"}
                                        extensions={[javascript({ jsx: true })]}
                                        onChange={(value, viewUpdate) => {
                                            setJs(value);
                                        }}
                                    />
                                </div>
                            </div>
                        </Panel>
                    </PanelGroup>
                    <PanelGroup direction="vertical">
                        <Panel defaultSize={100}>
                            <div
                                className="bg-white"
                                style={{ overflow: "hidden", height: "100%" }}
                            >
                                <iframe
                                    title="Result"
                                    srcDoc={output}
                                    style={{
                                        border: "none",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                ></iframe>
                            </div>
                        </Panel>
                    </PanelGroup>
                </PanelGroup>
            </div>
        </>
    );
};

export default NewProject;
