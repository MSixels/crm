import './Menu.css'
import { IoIosArrowDropleftCircle } from "react-icons/io";
import PropTypes from 'prop-types'
import { FaLock } from "react-icons/fa";
import ProgressBar from '../../ProgressBar/ProgressBar';
import { useEffect, useState } from 'react';
import { SiGoogleclassroom } from "react-icons/si";
import { FaUser } from "react-icons/fa";
import { MdOutlineErrorOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


function Menu({ modulo, conteudo, aulas, provas, progressAulas, progressProvas, userId }) {
    const navigate = useNavigate()
    const [selectOption, setSelectOption] = useState(1)

    const calculateProgress = (aulasCompletadas, aulasTotal, provasCompletadas, provasTotal) => {
        console.log(`Calculos de %: ${aulasCompletadas} / ${aulasTotal} && ${provasCompletadas} / ${provasTotal}`)
        const percentAulas = (aulasCompletadas / aulasTotal) * 100;
        const percentProvas = (provasCompletadas / provasTotal) * 100;

    
        const totalProgress = (percentAulas + percentProvas) / 2;
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

    const aulasCompletadas = aulas.filter(aula => {
        const progressoAula = progressAulas?.find(progress => progress.userId === userId && progress.aulaId === aula.id);
        return progressoAula && progressoAula.status === 'end';
    }).length;

    const provasCompletadas = provas.filter(prova => {
        const progressoProva = progressProvas?.find(progress => progress.userId === userId && progress.provaId === prova.id);
        return progressoProva && progressoProva.status === 'end';
    }).length;

    return (
        <div className='containerMenu'>
            <div className='divBtnBack'>
                <IoIosArrowDropleftCircle size={30} onClick={backHome}/>
            </div>
            {modulo && conteudo && aulas && (
                <div className='divContentMenu'>
                    <span className='ft14'>Disponível até {formatDate(modulo.validade)}</span>
                    <div className='divName'>
                        <h2>{modulo.name}</h2>
                        <span className='progressPorcent ft14'>{modulo.status !== 'block' ? `${calculateProgress(aulasCompletadas, aulas.length, provasCompletadas, provas.length) > 0 ? `${calculateProgress(aulasCompletadas, aulas.length, provasCompletadas, provas.length)}% Concluído` : 'Não iniciado'}` : (<> <FaLock /> Bloqueado</>)}</span>
                    </div>
                    <ProgressBar aulasCompletadas={aulasCompletadas} aulasTotal={aulas.length} provasCompletadas={provasCompletadas} provasTotal={provas.length} />
                    <div className='infos'>
                        <span>Aulas</span>
                        <span>{aulasCompletadas}/{aulas.length}</span> 
                    </div>
                    <div className='infos'>
                        <span>Provas</span>
                        <span>{provasCompletadas}/{provas.length}</span>
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
    );
}

Menu.propTypes = {
    modulo: PropTypes.array.isRequired,
    conteudo: PropTypes.array.isRequired,
    aulas: PropTypes.array.isRequired,
    provas: PropTypes.array.isRequired,
    progressAulas: PropTypes.array.isRequired,
    progressProvas: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
};

export default Menu