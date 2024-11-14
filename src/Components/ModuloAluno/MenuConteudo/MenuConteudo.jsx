import './MenuConteudo.css'
import { IoIosArrowDropleftCircle } from "react-icons/io";
import PropTypes from 'prop-types'
import { FaBookOpen, FaCheckCircle, FaLock, FaVideo } from "react-icons/fa";
import ProgressBar from '../../ProgressBar/ProgressBar';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';


function MenuConteudo({ modulo, conteudo, aulas, provas, progressAulas, progressProvas, userId }) {
    const { moduloId } = useParams()
    const { materialId } = useParams()
    const { conteudoId } = useParams()
    const [provasBloqueadas, setProvasBloqueadas] = useState({});
    
    const navigate = useNavigate()
    const calculateProgress = (aulasCompletadas, aulasTotal, provasCompletadas, provasTotal) => {
        //console.log(`Calculos de %: ${aulasCompletadas} / ${aulasTotal} && ${provasCompletadas} / ${provasTotal}`)
        const percentAulas = (aulasCompletadas / aulasTotal) * 100;
        const percentProvas = (provasCompletadas / provasTotal) * 100;

    
        const totalProgress = (percentAulas + percentProvas) / 2;
        return totalProgress.toFixed(0);
    };

    const backHome = () => {
        navigate(`/aluno/modulo/${moduloId}/aulas`)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate() + 1).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const navigateMaterial = (id, type) => {
        //console.log('dados nome menu: ', aulas)
        //console.log('dados nome menu: ',provas)
        navigate(`/aluno/modulo/${moduloId}/${conteudoId}/${type}/${id}`)
    }

    const aulasCompletadas = aulas.filter(aula => {
        const progressoAula = progressAulas?.find(progress => progress.userId === userId && progress.aulaId === aula.id);
        return progressoAula && progressoAula.status === 'end';
    }).length;

    const provasCompletadas = provas.filter(prova => {
        const progressoProva = progressProvas?.find(progress => progress.userId === userId && progress.provaId === prova.id);
        return progressoProva && progressoProva.status === 'end';
    }).length;

    useEffect(() => {
        const novasProvasBloqueadas = {};
        conteudo.forEach((conteudoItem) => {
            const aulasDoConteudo = aulas.filter(aula => aula.conteudoId === conteudoItem.id);
            const todasAulasConcluidas = aulasDoConteudo.every(aula => {
                const progressoAula = progressAulas.find(progress => progress.userId === userId && progress.aulaId === aula.id);
                return progressoAula && progressoAula.status === 'end';
            });
    
            novasProvasBloqueadas[conteudoItem.id] = !todasAulasConcluidas;
        });
        setProvasBloqueadas(novasProvasBloqueadas);
    }, [aulas, conteudo, progressAulas, userId]);

    return (
        <div className='containerMenuConteudo'>
            <div className='divBtnBack'>
                <IoIosArrowDropleftCircle size={30} onClick={backHome}/>
            </div>
            {modulo && conteudo && aulas && provas && (
                <div className='divContentMenuConteudo'>
                    <span className='ft14'>Disponível até {formatDate(modulo.validade)}</span>
                    <div className='divName'>
                        <h2>{modulo.name}</h2>
                        <span className='progressPorcent ft14'>{modulo.status !== 'block' ? `${calculateProgress(aulasCompletadas, aulas.length, provasCompletadas, provas.length) > 0 ? `${calculateProgress(aulasCompletadas, aulas.length, provasCompletadas, provas.length)}% Concluído` : 'Não iniciado'}` : (<> <FaLock /> Bloqueado</>)}</span>
                    </div>
                    <ProgressBar aulasCompletadas={aulasCompletadas} aulasTotal={aulas.length} provasCompletadas={provasCompletadas} provasTotal={provas.length} />
                    
                </div>
            )}
            {conteudo.map((c) => {
                const isBlocked = c.status === 'blocked' || new Date() < new Date(c.openDate);
                return(
                    <div key={c.id} className='divConteudos'>
                        <p className='titleConteudo'>{conteudo[0].name}</p>
                        {aulas && aulas
                        .filter((a) => a.conteudoId === c.id && a.type === 'aula')
                        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)) 
                        .map((a) => {
                            const progressoAula = progressAulas?.find(
                                (progress) => progress.userId === userId && progress.aulaId === a.id
                            );

                            const aulaCompletada = progressoAula && progressoAula.status === 'end';
                            return (
                                <div 
                                    key={a.id} 
                                    className={`divAulas ${materialId === a.id ? 'active' : ''}`} 
                                    onClick={() => {isBlocked ? '' : navigateMaterial(a.id, a.type)}}
                                >
                                    <div className='divCheck'>
                                        {isBlocked ? (
                                            <FaLock color='gray' size={24}/>
                                        ) : (
                                            aulaCompletada ? (
                                                <FaCheckCircle color='#1BA284' size={24} />
                                            ) : (
                                                <div className='divCircle'>
                                                    <div className='divBall'></div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className='divIcon'>
                                        <FaVideo />
                                    </div>
                                    <p className='aulaTitle'>{a.name}</p>
                                </div>
                            );
                        })}
                        {provas && provas
                        .filter((p) => p.conteudoId === c.id && p.type === 'prova') 
                        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
                        .map((p) => {
                            const progressoProva = progressProvas?.find(
                                (progress) => progress.userId === userId && progress.provaId === p.id
                            );

                            const provaCompletada = progressoProva && progressoProva.status === 'end';
                            const statusProva = (isBlocked, provasBloqueadas, progressoProva) => {
                                if (isBlocked || provasBloqueadas) {
                                    return 'blocked';
                                } else {
                                    return progressoProva;
                                }
                            };
                            return(
                                <div 
                                    key={p.id} 
                                    className={`divAulas ${materialId === p.id ? 'active' : ''}`} 
                                    onClick={() => {isBlocked || provasBloqueadas[c.id]? '' : navigateMaterial(p.id, p.type)}}
                                >
                                    <div className='divCheck'>
                                        {isBlocked || provasBloqueadas[c.id] ? (
                                            <FaLock color='gray' size={24}/>
                                        ) : (
                                            provaCompletada ? (
                                                <FaCheckCircle color='#1BA284' size={24} />
                                            ) : (
                                                <div className='divCircle'>
                                                    <div className='divBall'></div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className='divIcon'>
                                        <FaBookOpen />
                                    </div>
                                    <p className='aulaTitle'>{p.name}</p>
                                </div>
                            )
                        })}
                        {provas && provas
                        .filter((p) => p.conteudoId === c.id && p.type === 'storyTelling') 
                        .map((p) => {
                            const progressoProva = progressProvas?.find(
                                (progress) => progress.userId === userId && progress.provaId === p.id
                            );

                            const provaCompletada = progressoProva && progressoProva.status === 'end';
                            return(
                                <div 
                                    key={p.id} 
                                    className={`divAulas ${materialId === p.id ? 'active' : ''}`} 
                                    onClick={() => {isBlocked || provasBloqueadas[c.id] ? '' : navigateMaterial(p.id, p.type)}}
                                >
                                    <div className='divCheck'>
                                    {isBlocked || provasBloqueadas[c.id] ? (
                                            <FaLock color='gray' size={24}/>
                                        ) : (
                                            provaCompletada ? (
                                                <FaCheckCircle color='#1BA284' size={24} />
                                            ) : (
                                                <div className='divCircle'>
                                                    <div className='divBall'></div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className='divIcon'>
                                        <FaBookOpen />
                                    </div>
                                    <p className='aulaTitle'>{p.name}</p>
                                </div>
                            )
                        })}
                        {aulas && aulas
                        .filter((a) => a.conteudoId === c.id && a.type === 'game')
                        .map((a) => {
                            const progressoAula = progressAulas?.find(
                                (progress) => progress.userId === userId && progress.aulaId === a.id
                            );

                            const aulaCompletada = progressoAula && progressoAula.status === 'end';
                            return (
                                <div 
                                    key={a.id} 
                                    className={`divAulas ${materialId === a.id ? 'active' : ''}`} 
                                    onClick={() => {isBlocked ? '' : navigateMaterial(a.id, a.type)}}
                                >
                                    <div className='divCheck'>
                                        {isBlocked ? (
                                            <FaLock color='gray' size={24}/>
                                        ) : (
                                            aulaCompletada ? (
                                                <FaCheckCircle color='#1BA284' size={24} />
                                            ) : (
                                                <div className='divCircle'>
                                                    <div className='divBall'></div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className='divIcon'>
                                        <FaVideo />
                                    </div>
                                    <p className='aulaTitle'>{a.name}</p>
                                </div>
                            );
                        })}
                    </div>
                )
            })}
            
        </div>
    )
}

MenuConteudo.propTypes = {
    modulo: PropTypes.array.isRequired,
    conteudo: PropTypes.array.isRequired,
    aulas: PropTypes.array.isRequired,
    provas: PropTypes.array.isRequired,
    progressAulas: PropTypes.array.isRequired,
    progressProvas: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
};

export default MenuConteudo