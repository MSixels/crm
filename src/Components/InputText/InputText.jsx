import { useState } from 'react';
import './InputText.css';
import PropTypes from 'prop-types';

function InputText({ title, placeH, onSearchChange, onChange, mt, value }) {
    const [search, setSearch] = useState(value || '');

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearch(newSearchTerm);
        
        if (onSearchChange) {
            onSearchChange(newSearchTerm);
        }

        if (onChange) { 
            onChange(e); 
        }
    };

    return (
        <div className={`containerInputText ${mt === 'active' && 'mt-10'}`}>
            <div className='divInput'>
                <span htmlFor="busca">{title}</span>
                <input 
                    type="text" 
                    name="busca" 
                    id="busca" 
                    className="input" 
                    value={value || search} 
                    placeholder={placeH} 
                    onChange={handleSearchChange} 
                />
            </div>
        </div>
    );
}

InputText.propTypes = {
    title: PropTypes.string.isRequired,
    placeH: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func,
    onChange: PropTypes.func,  
    mt: PropTypes.string,
    value: PropTypes.string,   
};

export default InputText;
