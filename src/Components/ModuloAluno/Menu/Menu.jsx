import './Menu.css'
import { IoIosArrowDropleftCircle } from "react-icons/io";
import PropTypes from 'prop-types'
import { FaLock } from "react-icons/fa";
import ProgressBar from '../../ProgressBar/ProgressBar';
import { useState } from 'react';
import { SiGoogleclassroom } from "react-icons/si";
import { FaUser } from "react-icons/fa";
import { MdOutlineErrorOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


function Menu({ modulo, aulas, provas }) {
    
    const navigate = useNavigate()
    const [selectOption, setSelectOption] = useState(1)
    const calculateProgress = (module) => {
        const percentAulas = (module.aulasFeitas / module.aulasTotal) * 100;
        const percentProvas = (module.provasFeitas / module.provasTotal) * 100;
        const percentWorkCampo = (module.workCampoFeitas / module.workCampoTotal) * 100;
    
        const totalProgress = (percentAulas + percentProvas + percentWorkCampo) / 3;
        return totalProgress.toFixed(0);
    };

    


    const options = [
        {
            id: 1,
            icon: <SiGoogleclassroom size={20}/>,
            text: 'Aulas',
        },
        {
            id: 2,
            icon: <FaUser size={20}/>,
            text: 'Professor',
        },
        {
            id: 3,
            icon: <MdOutlineErrorOutline size={20}/>,
            text: 'Reportar problema',
        },
    ]

    const backHome = () => {
        navigate('/aluno/home')
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate() + 1).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Lembre-se que os meses começam do 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className='containerMenu'>
            <div className='divBtnBack'>
                <IoIosArrowDropleftCircle size={30} onClick={backHome}/>
            </div>
            {modulo && (
                <div className='divContentMenu'>
                    <span className='ft14'>Disponível até {formatDate(modulo.validade)}</span>
                    <div className='divName'>
                        <h2>{modulo.name}</h2>
                        <span className='progressPorcent ft14'>{modulo.status !== 'block' ? `${calculateProgress(modulo) > 0 ? `${calculateProgress(modulo)}% Concluído` : 'Não iniciado'}` : (<> <FaLock /> Bloqueado</>)}</span>
                    </div>
                    <ProgressBar modulo={modulo}/>
                    <div className='infos'>
                        <span>Aulas</span>
                        <span>0/{aulas.length}</span>
                    </div>
                    <div className='infos'>
                        <span>Provas</span>
                        <span>0/{provas.length}</span>
                    </div>
                    <div className='infos'>
                        <span>Prontos</span>
                        <span>130/600</span>
                    </div>
                    <div className='infos'>
                        <span>Trabalho de campo</span>
                        <span>{modulo.workCampoFeitas}/{modulo.workCampoTotal}</span>
                    </div>
                </div>
            )}
            <div className='divOptions'>
                {options.map((o) => (
                    <div key={o.id} className={`option ${selectOption === o.id ? 'active' : ''}`} onClick={() => setSelectOption(o.id)}>
                        <div className='divIcon'>
                            {o.icon}
                        </div>
                        <span className='optionText'>{o.text}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

Menu.propTypes = {
    modulo: PropTypes.array.isRequired,
    conteudo: PropTypes.array.isRequired,
    aulas: PropTypes.array.isRequired,
    provas: PropTypes.array.isRequired,
};

export default Menu