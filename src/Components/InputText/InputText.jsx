import { useState } from 'react'
import './InputText.css'
import PropTypes from 'prop-types'

function InputText({title, placeH, onSearchChange, mt }) {
    const [search, setSearch] = useState('');

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearch(newSearchTerm);
        onSearchChange(newSearchTerm);
    };

    return(
        <div className={`containerInputText ${mt === 'active' && 'mt-10'}`}>
            <div className='divInput'>
                <span htmlFor="busca">{title}</span>
                <input 
                    type="text" 
                    name='busca' 
                    id='busca' 
                    className='input' 
                    value={search}
                    placeholder={placeH}
                    onChange={handleSearchChange}
                />
            </div>
        </div>
    )
}
InputText.propTypes = {
    title: PropTypes.string.isRequired,
    placeH: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    mt: PropTypes.string.isRequired,
};

export default InputText