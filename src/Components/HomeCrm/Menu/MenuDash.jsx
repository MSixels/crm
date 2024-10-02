import './MenuDash.css'
import PropTypes from 'prop-types'
import { GoHomeFill } from "react-icons/go";
import { FaUsers } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { PiStudentBold } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';

function MenuDash({page}) {
    const [selectedOption, setSelectedOption] = useState(1)
    const navigate = useNavigate()

    useEffect(() => {
        if(page === 'dashboard'){
            setSelectedOption(1)
        } else if(page === 'alunos'){
            setSelectedOption(2)
        } else if(page === 'turmas'){
            setSelectedOption(3)
        } else if(page === 'modulos'){
            setSelectedOption(4)
        } else if(page === 'usuarios'){
            setSelectedOption(5)
        } else {
            setSelectedOption(1)
        }
    }, [page])

    const options = [
        {
            id: 1,
            icon: <GoHomeFill size={20}/>, 
            name: 'Dashboard'
        },
        {
            id: 2,
            icon: <PiStudentBold size={20}/>, 
            name: 'Alunos'
        },
        {
            id: 3,
            icon: <FaUsers size={20}/>, 
            name: 'Turmas'
        },
        {
            id: 4,
            icon: <FaBookOpen size={20}/>, 
            name: 'Módulos'
        },
        {
            id: 5,
            icon: <FaUserAlt size={20}/>, 
            name: 'Usuários'
        },
    ]

    const openPage = (id) => {
        setSelectedOption(id);
        if (id === 1) {
            navigate('/professor/dashboard');
        } else if (id === 2) {
            navigate('/professor/alunos');
        } else if (id === 3) {
            navigate('/professor/turmas');
        } else if (id === 4) {
            navigate('/professor/modulos');
        } else if (id === 5) {
            navigate('/professor/usuarios');
        } else {
            navigate('/professor/dashboard');
        }
    };
    return (
        <div className='containerMenuDash'>
            <div className='divOptions'>
                {options.map((o) => (
                    <div key={o.id} className={`divOption ${selectedOption === o.id ? 'active' : ''}`} onClick={() => openPage(o.id)}>
                        <div className='divIcon'>
                            {o.icon}
                        </div>
                        <span>{o.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
MenuDash.propTypes = {
    page: PropTypes.string.isRequired,
};

export default MenuDash