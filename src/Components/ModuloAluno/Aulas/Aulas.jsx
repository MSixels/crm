import './Aulas.css';
import PropTypes from 'prop-types';
import { FaPlay, FaLock, FaVideo, FaBookOpen, FaCheckCircle, FaCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MdEdit } from "react-icons/md";
import { FaGamepad } from "react-icons/fa6";
import ResultadoProva from '../Prova/Prova';


function Aulas({ modulo, conteudo, aulas, provas, progressAulas, progressProvas, userId }) {
    const navigate = useNavigate();
    const { moduloId } = useParams()
    const [todosConcluidos, setTodosConcluidos] = useState(false);
    const [conteudoDesbloqueado, setConteudoDesbloqueado] = useState([]);
    const [provasBloqueadas, setProvasBloqueadas] = useState({});

    const handleStartContent = (moduloId, conteudoId, type, materialId) => {
        navigate(`/aluno/modulo/${moduloId}/${conteudoId}/${type}/${materialId}`);
    };

    useEffect(() => {
        console.log('Dados de progressProvas:', progressProvas);
    }, [progressProvas]);
    
    const handleViewResponses = (moduloId, conteudoId, materialId) => {
        navigate(`/aluno/modulo/${moduloId}/prova/${conteudoId}/respostas`);
    };

    const renderButton = (status, moduloId, conteudoId, materialId, type, score) => {
        console.log(`${type}: ${status}, Score: ${score}`);
        if (status === "end") {
            if (type === "aula" || type === "aovivo") {
                return (
                    <button className='btn-access' onClick={() => handleStartContent(moduloId, conteudoId, type, materialId)}>
                        Reassistir
                    </button>
                );
            } else if (type === "storyTelling" || type === "game" || type === "teste" || type === "prova") {
                if (type === "prova" && score !== null) {
                    return (
                        <button className='btn-access' onClick={() => handleViewResponses(moduloId, conteudoId, materialId)}>
                            Ver Respostas
                        </button>
                    );
                }
                return <button className='btn-access-disable' disabled>Concluído</button>;
            }
        } else if (status === "blocked") {
            return <button className='btn-access-disable' disabled>Bloqueado</button>;
        } else {
            return (
                <button className='btn-first-access' onClick={() => handleStartContent(moduloId, conteudoId, type, materialId)}>
                    Iniciar
                </button>
            );
        }
    };
    

    const continuarDeOndeParou = () => {
        const conteudoInacabado = conteudo.find((c) => {
            const progresso = progressAulas.find((progress) => progress.conteudoId === c.id && progress.status !== 'end');
            return progresso ? c : null;
        });
        if (conteudoInacabado) {
            handleStartContent(moduloId, conteudoInacabado.id, 'aula', conteudoInacabado.materialId);
        }
    };

    const statusProva = (isBlocked, provasBloqueadas, progressoProva) => {
        if (isBlocked || provasBloqueadas) {
            return 'blocked';
        } else if (progressoProva?.status === 'end') {
            return 'end';
        }
        return 'active';
    };

    const renderIcon = (type) => {
        if (type === "Aula" || type === "Ao Vivo") {
            return <div className='divIconAula'>
            <FaVideo />
        </div>;
        } else if (type === "Teste" || type === "Prova") {
            return <div className='divIconAula'>
            <FaBookOpen />
        </div>;
        } else if (type === "Story") {
            return <div className='divIconAula'>
            <MdEdit />
        </div>;
        } else if (type === "Game") {
            return <div className='divIconAula'>
            <FaGamepad />
        </div>;
        }
    };

    const renderScore = (contentItem) => {
        if (contentItem.type === "Prova" && contentItem.status === "completed" && contentItem.score !== null) {
            const scoreColor = contentItem.score >= 50 ? 'green' : 'red';
            return <span className={`score ${scoreColor}`}>{contentItem.score}</span>;
        }
        return null;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate() + 1).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        if (conteudo.length > 0) {
            setConteudoDesbloqueado(conteudo);
            const todosConcluidos = conteudo.every(item => item.status === 'completed');
            setTodosConcluidos(todosConcluidos);
        }
    }, [conteudo]);

    useEffect(() => {
        const novasProvasBloqueadas = {};
        conteudo.forEach((conteudoItem) => {
            const aulasDoConteudo = aulas.filter(aula => aula.conteudoId === conteudoItem.id && aula.type === 'aula');
            console.log('aulasDoConteudo: ', aulasDoConteudo)
            const progressosCorrespondentes = progressAulas.filter(progress => 
                progress.userId === userId && 
                aulasDoConteudo.some(aula => aula.id === progress.aulaId)
            );

            progressosCorrespondentes.forEach(progress => {
                console.log('Progresso encontrado:', { aulaId: progress.aulaId, status: progress.status });
            });

            const todasAulasConcluidas = aulasDoConteudo.every(aula => 
                progressosCorrespondentes.some(progress => {
                    return progress.aulaId === aula.id && progress.status === 'end';
                })
            );
    
            novasProvasBloqueadas[conteudoItem.id] = !todasAulasConcluidas;
        });
        setProvasBloqueadas(novasProvasBloqueadas);
    }, [aulas, conteudo, progressAulas, userId]);

    return (   
        <div className='containerAulas'>
            {modulo && conteudo && aulas && provas && (
                <div className='divContent'>
                    <div className='divHeadLine'>
                        <div className='textHeadLine'>
                            <h2 className='moduleName'>{modulo.name}</h2>
                            <span className='moduleDescription'>{modulo.description}</span>
                        </div>
                        <button className='btn-continue' onClick={continuarDeOndeParou}>Continuar de onde parou <FaPlay /></button>
                    </div>

                    {conteudo
                    .sort((a, b) => new Date(a.openDate) - new Date(b.openDate))
                    .map((c) => {
                        const isBlocked = c.status === 'blocked' || new Date() < new Date(c.openDate);
                        return(
                            <div key={c.id} className={`weekSection ${isBlocked ? 'blocked' : ''}`}>
                                <h3 className="titleContent">{c.name} {formatDate(c.openDate)}</h3>
                                
                                {aulas
                                    .filter((aula) => aula.conteudoId === c.id && aula.type === 'aula')
                                    .sort((aula1, aula2) => {
                                        const dateAula1 = aula1.createdAt.seconds * 1000 + aula1.createdAt.nanoseconds / 1000000;  
                                        const dateAula2 = aula2.createdAt.seconds * 1000 + aula2.createdAt.nanoseconds / 1000000;  
                                        return dateAula1 - dateAula2;
                                    })
                                    .map((aula) => {
                                        const progressoAula = progressAulas.find(
                                            (progress) => progress.userId === userId && progress.aulaId === aula.id
                                        );

                                        const aulaCompletada = progressoAula && progressoAula.status === 'end';

                                        return (
                                            <div key={aula.id} className="contentRow">
                                                <div className="contentInfo">
                                                    {isBlocked ? (
                                                        <FaLock color='gray' size={24}/>
                                                    ) : (
                                                        aulaCompletada ? (
                                                            <FaCheckCircle color='#1BA284' size={24}/>
                                                        ) : (
                                                            <div className='Circle'>
                                                                <FaCircle />
                                                            </div>
                                                        )
                                                    )}
                                                    {renderIcon('Aula')}
                                                    <span>{aula.name}</span>
                                                </div>
                                                {renderButton(progressoAula?.status, moduloId, c.id, aula.id, 'aula')}
                                            </div>
                                        );
                                    })
                                }
                                {provas
                                    .filter((provas) => provas.conteudoId === c.id && provas.type === 'prova')
                                    .map((prova) => {
                                        const progressoProva = progressProvas.find(
                                            (progress) => progress.userId === userId && progress.provaId === prova.id
                                        );

                                        const score = progressoProva ? progressoProva.score : null;
                                        const provaCompletada = progressoProva && progressoProva.status === 'end';

                                        return (
                                            <div key={prova.id} className="contentRow">
                                                <div className="contentInfo">
                                                    {isBlocked || provasBloqueadas[c.id] ? (
                                                        <FaLock color='gray' size={24}/>
                                                    ) : (
                                                        provaCompletada ? (
                                                            score >= 50 ? (
                                                                <FaCheckCircle color='#1BA284' size={24} /> 
                                                            ) : (
                                                                <FaTimesCircle color='#D32F2F' size={24} /> 
                                                            )
                                                        ) : (
                                                            <div className='Circle'>
                                                                <FaCircle />
                                                            </div>
                                                        )
                                                    )}
                                                    {renderIcon('Prova')}
                                                    <span>{prova.name}</span>
                                                    {provaCompletada && score !== null && (
                                                        <span className={`score ${score >= 50 ? 'green' : 'red'}`}>{score}</span> 
                                                    )}
                                                </div>
                                                {renderButton(statusProva(isBlocked, provasBloqueadas[c.id], progressoProva?.status), moduloId, c.id, prova.id, 'prova', score)}
                                            </div>
                                        );
                                    })
}
                                {provas
                                    .filter((provas) => provas.conteudoId === c.id && provas.type === 'storyTelling')
                                    .sort((a, b) => {
                                    const dateProvaA = a.createdAt ? (a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000) : 0;
                                    const dateProvaB = b.createdAt ? (b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000) : 0;
                                    return dateProvaA - dateProvaB;
                                    })
                                    .map((prova) => {
                                    const progressoProva = progressProvas.find(
                                        (progress) => progress.userId === userId && progress.provaId === prova.id
                                    );

                                    const provaCompletada = progressoProva && progressoProva.status === 'end';

                                    const stausProva = (isBlocked, provasBloqueadas, progressoProva) => {
                                        if(isBlocked || provasBloqueadas){
                                            return 'blocked'
                                        }else {
                                            return progressoProva
                                        }
                                    }

                                    return (
                                        <div key={prova.id} className="contentRow">
                                        <div className="contentInfo">
                                            {isBlocked || provasBloqueadas[c.id] ? (
                                                <FaLock color='gray' size={24}/>
                                            ) : (
                                                provaCompletada ? (
                                                    <FaCheckCircle color='#1BA284' size={24} />
                                                ) : (
                                                    <div className='Circle'>
                                                    <FaCircle />
                                                    </div>
                                                )
                                            )}
                                            {renderIcon('Story')}
                                            <span >{prova.name}</span>
                                        </div>
                                        {renderButton(stausProva(isBlocked, provasBloqueadas[c.id], progressoProva?.status), moduloId, c.id, prova.id, 'storyTelling')}
                                        </div>
                                    );
                                    })
                                }
                                {aulas
                                    .filter((aula) => aula.conteudoId === c.id && aula.type === 'game')
                                    .sort((aula1, aula2) => {
                                        const dateAula1 = aula1.createdAt.seconds * 1000 + aula1.createdAt.nanoseconds / 1000000;  
                                        const dateAula2 = aula2.createdAt.seconds * 1000 + aula2.createdAt.nanoseconds / 1000000;  
                                        return dateAula1 - dateAula2;
                                    })
                                    .map((aula) => {
                                        const progressoAula = progressAulas.find(
                                            (progress) => progress.userId === userId && progress.aulaId === aula.id
                                        );

                                        const aulaCompletada = progressoAula && progressoAula.status === 'end';

                                        return (
                                            <div key={aula.id} className="contentRow">
                                                <div className="contentInfo">
                                                    {isBlocked ? (
                                                        <FaLock color='gray' size={24}/>
                                                    ) : (
                                                        aulaCompletada ? (
                                                            <FaCheckCircle color='#1BA284' size={24}/>
                                                        ) : (
                                                            <div className='Circle'>
                                                                <FaCircle />
                                                            </div>
                                                        )
                                                    )}
                                                    {renderIcon('Game')}
                                                    <span>{aula.name}</span>
                                                </div>
                                                {renderButton(progressoAula?.status, moduloId, c.id, aula.id, 'game')}
                                            </div>
                                        );
                                    })
                                }

                            </div>
                        )
                        
                    })}
                    <button
                        className={`nextModuleButton ${todosConcluidos ? 'enabled' : 'disabled'}`}
                        disabled={!todosConcluidos}
                    >
                        Próximo Módulo &gt;
                    </button>
                </div>
            )}
        </div>
    );
}

Aulas.propTypes = {
    modulo: PropTypes.array.isRequired,
    conteudo: PropTypes.array.isRequired,
    aulas: PropTypes.array.isRequired,
    provas: PropTypes.array.isRequired,
    progressAulas: PropTypes.array.isRequired,
    progressProvas: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
};

export default Aulas;