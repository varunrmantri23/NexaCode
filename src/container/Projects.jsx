import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from 'framer-motion';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import {ProjectCard} from "../components";

const Projects = () => {
    const projects = useSelector((state) => state.projects?.projects);
    const searchterm = useSelector((state) => state.searchterm?.searchterm || "");
    const [filtered, setFiltered] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 6;

    useEffect(() => {
        if (searchterm?.length > 0) {
            setFiltered(
                projects?.filter((project) => {
                    const lowerCase = project?.title.toLowerCase();
                    return lowerCase.includes(searchterm.toLowerCase());
                })
            );
        } else {
            setFiltered(null);
        }
        setCurrentPage(1);
    }, [searchterm, projects]);

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filtered 
        ? filtered.slice(indexOfFirstProject, indexOfLastProject)
        : projects?.slice(indexOfFirstProject, indexOfLastProject);

    const totalProjects = filtered ? filtered.length : projects?.length || 0;
    const totalPages = Math.ceil(totalProjects / projectsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full py-6 flex flex-col items-center">
            <div className="w-full flex items-center gap-6 flex-wrap justify-center mb-8">
                {currentProjects && currentProjects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center gap-2 mt-6">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg transition-colors ${
                            currentPage === 1
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-secondary text-primaryText hover:bg-theme hover:text-white'
                        }`}
                    >
                        <MdChevronLeft className="text-xl" />
                    </motion.button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <motion.button
                            key={pageNumber}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
                                currentPage === pageNumber
                                    ? 'bg-theme text-white'
                                    : 'bg-secondary text-primaryText hover:bg-theme hover:text-white'
                            }`}
                        >
                            {pageNumber}
                        </motion.button>
                    ))}

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg transition-colors ${
                            currentPage === totalPages
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-secondary text-primaryText hover:bg-theme hover:text-white'
                        }`}
                    >
                        <MdChevronRight className="text-xl" />
                    </motion.button>
                </div>
            )}

            <div className="text-primaryText text-sm mt-4">
                showing {indexOfFirstProject + 1}-{Math.min(indexOfLastProject, totalProjects)} of {totalProjects} projects
            </div>
        </div>
    );
};

export default Projects;