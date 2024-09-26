import { useState } from 'react'
import './InputDate.css'
import PropTypes from 'prop-types'

function InputDate({title, placeH, onSearchChange, inputError }) {
    const [search, setSearch] = useState('');

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearch(newSearchTerm);
        onSearchChange(newSearchTerm);
    };

    return(
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
                    onChange={handleSearchChange}
                    style={{borderColor: inputError ? 'red' : ''}}
                />
            </div>
        </div>
    )
}
InputDate.propTypes = {
    title: PropTypes.string.isRequired,
    placeH: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    inputError: PropTypes.bool.isRequired
};

export default InputDate