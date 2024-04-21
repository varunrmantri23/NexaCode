import React , {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import {motion} from 'framer-motion'
import { MdBookmark } from "react-icons/md";
import { Link } from "react-router-dom";
const Projects = () => {
    const projects = useSelector((state)=>
        state.projects?.projects
    )
    const searchterm = useSelector((state)=>
        state.searchterm?.searchterm ? state.searchterm?.searchterm 
        : ""
    )
    const [filtered, setFiltered] = useState(null)

    useEffect(()=>{
        if(searchterm?.length > 0 ){
            setFiltered(
                projects?.filter((project) => {
                    const lowerCase = project?.title.toLowerCase();
                    return searchterm.split("").every((letter) =>
                        lowerCase.includes(letter)
                    );
                })
            );
           
        } else setFiltered(null)

    },[searchterm])
    return (
        <div className="w-full py-6 flex items-center gap-6 flex-wrap justify-center">
            {filtered ? (
                <>
                    {filtered && filtered.map((project,index)=>(
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                    />
                    ))}
                </>
            ) : (
                projects &&
                projects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                    />
                ))
            )}
        </div>
    );
};

const ProjectCard = ({project, index }) =>{

    return (
        <Link to={`/home/projectPage/${project.id}`}>
            <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="w-full cursor-pointer md:w-[450px] h-[375px] bg-secondary rounded-md p-4 flex flex-col items-center justify-center gap-4"
            >
                <div
                    className="bg-primary w-full h-full overflow-hidden rounded-md"
                    style={{ overflow: "hidden", height: "100%" }}
                >
                    <iframe
                        title="Result"
                        srcDoc={project.output}
                        style={{
                            border: "none",
                            width: "100%",
                            height: "100%",
                        }}
                    ></iframe>
                </div>
                <div className="flex items-center justify-start gap-3 w-full">
                    <div className="w-14 h-14 flex items-center justify-center rounded-xl overflow-hidden cursor-pointer bg-theme">
                        {project?.user?.photoURL ? (
                            <motion.img
                                whileHover={{ scale: 1.3 }}
                                src={project?.user?.photoURL}
                                alt={project?.user?.displayName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <p className="text-xl text-white font-semibold capitalize">
                                {project?.user?.email[0]}
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="text-white text-lg capitalize ">
                            {project?.title}
                        </p>
                        <p className="text-primaryText text-sm capitalize">
                            {project?.user?.displayName
                                ? project?.user?.displayName
                                : `${project?.user.email.split("@")[0]}`}
                        </p>
                    </div>
                    <motion.div
                        className="cursor-pointer ml-auto"
                        whileTap={{ scale: 0.9 }}
                    >
                        <MdBookmark className="text-primaryText text-3xl" />
                    </motion.div>
                </div>
            </motion.div>
        </Link>
    );
}
export default Projects;
