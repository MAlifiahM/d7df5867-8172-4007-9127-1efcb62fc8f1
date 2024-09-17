import React from "react";

interface PaginationProps {
    currentPage: number;
    onPageChange: (page: number) => void;
    maxPage: number;
}

const Pagination:React.FC<PaginationProps> = ({currentPage, onPageChange, maxPage}) => {
    const handleNextPage = () => onPageChange(currentPage + 1);
    const handlePrevPage = () => onPageChange(currentPage - 1);

    return (
        <div className="flex justify-center items-center mt-4">
            <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200">
                <span
                    className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                    Previous
                </span>
            </button>
            <span className="mx-5 font-medium text-sm text-gray-900">{currentPage}</span>
            <button
                onClick={handleNextPage}
                disabled={currentPage >= maxPage}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200">
                <span
                    className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                    Next
                </span>
            </button>
        </div>
    );
}

export default Pagination;