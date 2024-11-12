import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './DropDown.css'
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { FaXmark } from 'react-icons/fa6';

function DropDown({ title, type, options, onTurmaChange }) {
    const [selected, setSelected] = useState(type);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        setSelected(type);
    }, [type]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSelectTurma = (option) => {
        if(option.name){
            setSelected(option.name);
        } else{
            setSelected(option);
        }
        
        onTurmaChange(option);
        setIsDropdownOpen(false);
    };

    return (
        <div className='containerDropDown'>
            <div className='dropdownInput' onClick={toggleDropdown}>
                <span className='label'>{title}</span>
                <span>{selected}</span>
                <span>{selected != 'Selecione' ? <span onClick={() => handleSelectTurma('Selecione')}><FaXmark /></span> : isDropdownOpen ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}</span>
            </div>
            {isDropdownOpen && (
                <div className='dropdownList'>
                    {options.map((o) => (
                        <span key={o.id} onClick={() => handleSelectTurma(o)} className='optionDrop'>
                            {o.name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

DropDown.propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.any.isRequired,
        name: PropTypes.string.isRequired,
    })),
    onTurmaChange: PropTypes.func.isRequired,
};

export default DropDown