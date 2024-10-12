import './MenuConteudo.css'
import { IoIosArrowDropleftCircle } from "react-icons/io";
import PropTypes from 'prop-types'
import { FaBookOpen, FaLock, FaVideo } from "react-icons/fa";
import ProgressBar from '../../ProgressBar/ProgressBar';
import { useNavigate, useParams } from 'react-router-dom';


function MenuConteudo({ modulo, conteudo, aulas, provas }) {
    const { moduloId } = useParams()
    const { materialId } = useParams()
    const { conteudoId } = useParams()
    
    const navigate = useNavigate()
    const calculateProgress = (module) => {
        const percentAulas = (module.aulasFeitas / module.aulasTotal) * 100;
        const percentProvas = (module.provasFeitas / module.provasTotal) * 100;
        const percentWorkCampo = (module.workCampoFeitas / module.workCampoTotal) * 100;
    
        const totalProgress = (percentAulas + percentProvas + percentWorkCampo) / 3;
        return totalProgress.toFixed(0);
    };

    const backHome = () => {
        navigate(`/aluno/modulo/${moduloId}`)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate() + 1).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Lembre-se que os meses começam do 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const navigateMaterial = (id) => {
        navigate(`/aluno/modulo/${moduloId}/${conteudoId}/${id}`)
    }

    return (
        <div className='containerMenuConteudo'>
            <div className='divBtnBack'>
                <IoIosArrowDropleftCircle size={30} onClick={backHome}/>
            </div>
            {modulo && (
                <div className='divContentMenuConteudo'>
                    <span className='ft14'>Disponível até {formatDate(modulo.validade)}</span>
                    <div className='divName'>
                        <h2>{modulo.name}</h2>
                        <span className='progressPorcent ft14'>{modulo.status !== 'block' ? `${calculateProgress(modulo) > 0 ? `${calculateProgress(modulo)}% Concluído` : 'Não iniciado'}` : (<> <FaLock /> Bloqueado</>)}</span>
                    </div>
                    <ProgressBar modulo={modulo}/>
                    
                </div>
            )}
            {conteudo.map((c) => (
                <div key={c.id} className='divConteudos'>
                    <p className='titleConteudo'>{conteudo[0].name}</p>
                    {aulas && aulas
                    .filter((a) => a.conteudoId === c.id) 
                    .map((a) => (
                        <div key={a.id} className={`divAulas ${materialId === a.id ? 'active' : ''}`} onClick={() => navigateMaterial(a.id)}>
                            <div className='divCheck'>
                                <div className='divCircle'>
                                    <div className='divBall'></div>
                                </div>
                            </div>
                            <div className='divIcon'>
                                <FaVideo />
                            </div>
                            <p className='aulaTitle'>{a.name}</p>
                        </div>
                    ))}
                    {provas && provas
                    .filter((p) => p.conteudoId === c.id) 
                    .map((p) => (
                        <div key={p.id} className={`divAulas ${materialId === p.id ? 'active' : ''}`} onClick={() => navigateMaterial(p.id)}>
                            <div className='divCheck'>
                                <div className='divCircle'>
                                    <div className='divBall'></div>
                                </div>
                            </div>
                            <div className='divIcon'>
                                <FaBookOpen />
                            </div>
                            <p className='aulaTitle'>{p.name}</p>
                        </div>
                    ))}
                </div>
            ))}
            
        </div>
    )
}

MenuConteudo.propTypes = {
    modulo: PropTypes.array.isRequired,
    conteudo: PropTypes.array.isRequired,
    aulas: PropTypes.array.isRequired,
    provas: PropTypes.array.isRequired,
};

export default MenuConteudo