import { useState } from 'react'
import './InputDate.css'
import PropTypes from 'prop-types'
import { FaXmark } from 'react-icons/fa6';

function InputDate({ title, placeH, onSearchChange, inputError }) {
    const [search, setSearch] = useState('');

    const handleSearchChange = (e, type) => {
        if (type === 'select') {
            const newSearchTerm = e.target.value;
            setSearch(newSearchTerm);
            onSearchChange(newSearchTerm);
        } else if (type === 'clean') {
            setSearch(''); 
            onSearchChange(''); 
        }
    };

    return (
        <div className='containerInputDate'>
            <div className='divInput'>
                <label htmlFor="busca">{title}</label>
                <input 
                    type="date" 
                    name='busca' 
                    id='busca' 
                    className='input' 
                    value={search}
                    placeholder={placeH}
                    onChange={(e) => handleSearchChange(e, 'select')} 
                    style={{ borderColor: inputError ? 'red' : '' }}
                />
                {search != '' && <span onClick={() => handleSearchChange(null, 'clean')}><FaXmark /></span> }
            </div>
        </div>
    );
}

InputDate.propTypes = {
    title: PropTypes.string.isRequired,
    placeH: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    inputError: PropTypes.bool.isRequired
};

export default InputDate;
