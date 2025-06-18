import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from 'framer-motion';
import { MdBookmark, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { Link } from "react-router-dom";

const Projects = () => {
    const projects = useSelector((state) =>
        state.projects?.projects
    );
    const searchterm = useSelector((state) =>
        state.searchterm?.searchterm ? state.searchterm?.searchterm 
        : ""
    );
    const [filtered, setFiltered] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 6; // Number of projects per page

    useEffect(() => {
        if (searchterm?.length > 0) {
            setFiltered(
                projects?.filter((project) => {
                    const lowerCase = project?.title.toLowerCase();
                    return searchterm.split("").every((letter) =>
                        lowerCase.includes(letter)
                    );
                })
            );
        } else {
            setFiltered(null);
        }
        setCurrentPage(1); // Reset to first page when search changes
    }, [searchterm, projects]);

    // Get current projects for pagination
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filtered 
        ? filtered.slice(indexOfFirstProject, indexOfLastProject)
        : projects?.slice(indexOfFirstProject, indexOfLastProject);

    // Calculate total pages
    const totalProjects = filtered ? filtered.length : projects?.length || 0;
    const totalPages = Math.ceil(totalProjects / projectsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full py-6 flex flex-col items-center">
            {/* Projects Grid */}
            <div className="w-full flex items-center gap-6 flex-wrap justify-center mb-8">
                {currentProjects && currentProjects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center gap-2 mt-6">
                    {/* Previous Button */}
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

                    {/* Page Numbers */}
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

                    {/* Next Button */}
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

            {/* Projects Info */}
            <div className="text-primaryText text-sm mt-4">
                Showing {indexOfFirstProject + 1}-{Math.min(indexOfLastProject, totalProjects)} of {totalProjects} projects
            </div>
        </div>
    );
};

const ProjectCard = ({ project, index }) => {
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
};

export default Projects;