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

function Menu({modulo}) {
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
            icon: <SiGoogleclassroom size={40}/>,
            text: 'Aulas',
        },
        {
            id: 2,
            icon: <FaUser size={30}/>,
            text: 'Professor',
        },
        {
            id: 3,
            icon: <MdOutlineErrorOutline size={30}/>,
            text: 'Reportar problema',
        },
    ]

    const backHome = () => {
        navigate('/aluno/home')
    }

    return (
        <div className='containerMenu'>
            <div className='divBtnBack'>
                <IoIosArrowDropleftCircle size={30} onClick={backHome}/>
            </div>
           
            {modulo && (
                <div className='divContentMenu'>
                    <span>Disponível até {modulo.timesEnd}</span>
                    <div className='divName'>
                        <h2>{modulo.name}</h2>
                        <span className='progressPorcent'>{modulo.status !== 'block' ? `${calculateProgress(modulo) > 0 ? `${calculateProgress(modulo)}% Concluído` : 'Não iniciado'}` : (<> <FaLock /> Bloqueado</>)}</span>
                    </div>
                    <ProgressBar modulo={modulo}/>
                    <div className='infos'>
                        <span>Aulas</span>
                        <span>{modulo.aulasFeitas}/{modulo.aulasTotal}</span>
                    </div>
                    <div className='infos'>
                        <span>Provas</span>
                        <span>{modulo.provasFeitas}/{modulo.provasTotal}</span>
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
    modulo: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        prof: PropTypes.string.isRequired,
        timesEnd: PropTypes.string.isRequired,
        aulasTotal: PropTypes.number.isRequired,
        aulasFeitas: PropTypes.number.isRequired,
        provasTotal: PropTypes.number.isRequired,
        provasFeitas: PropTypes.number.isRequired,
        workCampoTotal: PropTypes.number.isRequired,
        workCampoFeitas: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
    })
};

export default Menu