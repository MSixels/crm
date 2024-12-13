import { useState } from 'react';
import './InputCPF.css';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';

function InputCPF({ title, placeH, onSearchChange, mt }) {
    const [search, setSearch] = useState('');

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearch(newSearchTerm); 
        if (onSearchChange) {
            onSearchChange(newSearchTerm); 
        }
    };

    return (
        <div className={`containerInputCPF ${mt === 'active' && 'mt-10'}`}>
            <div className="divInput">
                <span htmlFor="busca">{title}</span>
                <InputMask
                    mask="999.999.999-99"
                    id="cpf"
                    value={search} 
                    onChange={handleSearchChange} 
                    required
                    placeholder={placeH} 
                    style={{
                        outline: 'none',
                        paddingBlock: 16,
                        borderRadius: 4,
                        borderColor: '#DAE1E7',
                    }}
                />
            </div>
        </div>
    );
}

InputCPF.propTypes = {
    title: PropTypes.string.isRequired,
    placeH: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func,
    mt: PropTypes.string,
};

export default InputCPF;
