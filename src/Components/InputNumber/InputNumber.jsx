import { useState } from 'react'
import './InputNumber.css'
import PropTypes from 'prop-types'

function InputNumber({title, placeH, onSearchChange, mt }) {
    const [search, setSearch] = useState('');

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearch(newSearchTerm);
        onSearchChange(newSearchTerm);
    };

    return(
        <div className={`containerInputNumber ${mt === 'active' && 'mt-10'}`}>
            <div className='divInput'>
                <span htmlFor="busca">{title}</span>
                <input 
                    type="number" 
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
InputNumber.propTypes = {
    title: PropTypes.string.isRequired,
    placeH: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func,
    mt: PropTypes.string,
};

export default InputNumber