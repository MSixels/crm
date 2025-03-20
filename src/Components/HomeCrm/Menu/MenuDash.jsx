import './MenuDash.css'
import PropTypes from 'prop-types'
import { GoHomeFill } from "react-icons/go";
import { FaBookOpen, FaUsers, FaUserAlt } from "react-icons/fa"; 
import { useEffect, useState } from 'react';
import { PiStudentBold } from "react-icons/pi";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function MenuDash({ page, conteudoId, moduloId }) {
    const [selectedOption, setSelectedOption] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        if (page === 'dashboard') {
            setSelectedOption(1);
        } else if (page === 'alunos') {
            setSelectedOption(2);
        } else if (page === 'turmas') {
            setSelectedOption(3);
        } else if (page === 'modulos') {
            setSelectedOption(4);
        } else if (page === 'usuarios') {
            setSelectedOption(5);
        } else if (page === 'storytelling') {
            setSelectedOption(6);
        } else if (page === 'rastreios') {
            setSelectedOption(7);
        } else if (conteudoId) {
            setSelectedOption(6);
        } else if (moduloId) {
            setSelectedOption(4);
        } else {
            setSelectedOption(1);
        }
    }, [page, conteudoId, moduloId]);

    const options = [
        { id: 1, icon: <GoHomeFill size={20} />, name: 'Dashboard', status: 'active' },
        { id: 2, icon: <PiStudentBold size={20} />, name: 'Alunos', status: 'active' },
        { id: 3, icon: <FaUsers size={20} />, name: 'Turmas', status: 'active' },
        { id: 4, icon: <FaBookOpen size={20} />, name: 'Módulos', status: 'active' },
        { id: 5, icon: <FaUserAlt size={20} />, name: 'Usuários', status: 'active' },
        { id: 6, icon: <IoChatbubbleEllipsesSharp size={20} />, name: 'StoryTelling', status: 'active' },
        //{ id: 7, icon: <FaListCheck size={20} />, name: 'Rastreios', status: 'active' } 
    ];

    const openPage = (id, status) => {
        if (status === 'active') {
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
            } else if (id === 6) {
                navigate('/professor/storytelling');
            } else if (id === 7) {
                navigate('/professor/rastreios');
            } else {
                navigate('/professor/dashboard');
            }
        }
    };

    return (
        <div className='containerMenuDash'>
            <div className='divOptions'>
                {options.map((o) => (
                    <div
                        key={o.id}
                        className={`divOption ${selectedOption === o.id ? 'active' : ''} ${o.status === 'block' && 'block'}`}
                        onClick={() => openPage(o.id, o.status)}
                    >
                        <div className='divIcon'>{o.icon}</div>
                        <span>{o.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

MenuDash.propTypes = {
    page: PropTypes.string.isRequired,
    conteudoId: PropTypes.string,
    moduloId: PropTypes.string
};

export default MenuDash;
