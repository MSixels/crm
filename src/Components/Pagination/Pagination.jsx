import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { MdArrowBackIosNew } from 'react-icons/md';
import { GrNext } from 'react-icons/gr';
import { useState } from "react";
import PropTypes from 'prop-types';
import './Pagination.css'

function Pagination({ currentPage, setCurrentPage, itemsPerPage, setItemsPerPage, totalItems }) {
    const [showModalNumberPages, setShowModalNumberPages] = useState(false);

    const renderModalNumberLiner = () => {
        const options = [100, 40, 20, 10, 5];

        return (
            <div className='containerRenderModalNumberLiner'>
                {options.map((value, index) => (
                    <div key={index} className='option' onClick={() => setItemsPerPage(value)}>
                        {value}
                    </div>
                ))}
            </div>
        );
    };

    const handleNextPage = () => {
        if ((currentPage + 1) * itemsPerPage < totalItems) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className='legendas'>
            <div className='divNumberLines'>
                <p>Linhas por página <span className='bold'>{itemsPerPage}</span></p>
                <div onClick={() => setShowModalNumberPages(!showModalNumberPages)} className='divIcon'>
                    {showModalNumberPages ? <FaAngleDown /> : <FaAngleUp />}
                    {showModalNumberPages && renderModalNumberLiner()}
                </div>
            </div>

            <p className='bold'>{currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, totalItems)} de {totalItems}</p>

            <div className='btnNextPage'>
                <div className='divBtnBackNext' onClick={handlePreviousPage}>
                    <MdArrowBackIosNew />
                </div>
                <div className='divBtnBackNext' onClick={handleNextPage}>
                    <GrNext />
                </div>
            </div>
        </div>
    );
}

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    setItemsPerPage: PropTypes.func.isRequired,
    totalItems: PropTypes.number.isRequired
};

export default Pagination;
