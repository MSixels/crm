import { useState } from 'react'
import './InputSend.css'
import PropTypes from 'prop-types'

function InputSend({title, placeH, onSearchChange, inputError, type }) {
    const [search, setSearch] = useState('');

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearch(newSearchTerm);
        onSearchChange(newSearchTerm);
    };

    return(
        <div className='containerInputSend'>
            <div className='divInput'>
                <label htmlFor="busca">{title}</label>
                <input 
                    type={type} 
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
InputSend.propTypes = {
    title: PropTypes.string.isRequired,
    placeH: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    inputError: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
};

export default InputSend