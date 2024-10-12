import './Aulas.css';
import PropTypes from 'prop-types';
import { FaPlay, FaLock, FaVideo, FaBookOpen, FaCheckCircle, FaCircle } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Aulas({ modulo, conteudo, aulas, provas, progressAulas, userId }) {
    const navigate = useNavigate();
    const { moduloId } = useParams()
    const [todosConcluidos, setTodosConcluidos] = useState(false);
    const [conteudoDesbloqueado, setConteudoDesbloqueado] = useState([]);

    const handleStartContent = (moduloId, conteudoId, materialId) => {
        navigate(`/aluno/modulo/${moduloId}/${conteudoId}/${materialId}`);
    };

    const renderButton = (contentItem, moduloId, conteudoId, materialId) => {
        if (contentItem.status === "completed") {
            if (contentItem.type === "Aula" || contentItem.type === "Ao Vivo") {
                return <button className='btn-access' onClick={() => handleStartContent(moduloId, conteudoId, materialId)}>Reassistir</button>;
            } else if (contentItem.type === "Teste" || contentItem.type === "Prova") {
                return <button className='btn-access' onClick={() => handleStartContent(moduloId, conteudoId, materialId)}>Ver Respostas</button>;
            }
        } else if (contentItem.status === "blocked") {
            return <FaLock color='gray' />;
        } else {
            return <button className='btn-access' onClick={() => handleStartContent(moduloId, conteudoId, materialId)}>Iniciar</button>;
        }
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
    
    

    return (   
        <div className='containerAulas'>
            {modulo && conteudo && aulas && provas && (
                <div className='divContent'>
                    <div className='divHeadLine'>
                        <div className='textHeadLine'>
                            <h2 className='moduleName'>{modulo.name}</h2>
                            <span className='moduleDescription'>{modulo.description}</span>
                        </div>
                        <button className='btn-continue'>Continuar de onde parou <FaPlay /></button>
                    </div>

                    {conteudo
                    .sort((a, b) => new Date(a.openDate) - new Date(b.openDate))
                    .map((c) => (
                        <div key={c.id} className={`weekSection ${c.status === 'blocked' ? 'blocked' : ''}`}>
                        <h3 className="titleContent">{c.name} {formatDate(c.openDate)}</h3>
                        
                        {aulas.filter((aula) => aula.conteudoId === c.id).map((aula) => {
                            // Verifique o progresso da aula
                            const progressoAula = progressAulas.find(
                                (progress) => progress.userId === userId && progress.aulaId === aula.id
                            );

                            // Determine se a aula foi completada
                            const aulaCompletada = progressoAula && progressoAula.status === 'end';

                            return (
                            <div key={aula.id} className="contentRow">
                                <div className="contentInfo">
                                {c.status === 'blocked' ? (
                                    <FaLock color='gray' />
                                ) : (
                                    aulaCompletada ? (  // Verificação se a aula foi completada
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
                                {renderButton(c, moduloId, c.id, aula.id)}
                            </div>
                            );
                        })}

                        {provas.filter((prova) => prova.conteudoId === c.id).map((prova) => {
                            const progressoProva = progressAulas.find(
                            (progress) => progress.userId === userId && progress.aulaId === prova.id
                            );

                            const provaCompletada = progressoProva && progressoProva.status === 'end';

                            return (
                            <div key={prova.id} className="contentRow">
                                <div className="contentInfo">
                                {c.status === 'blocked' ? (
                                    <FaLock color='gray' />
                                ) : (
                                    provaCompletada ? (  
                                    <FaCheckCircle color='#1BA284' size={24}/>
                                    ) : (
                                    <div className='Circle'>
                                        <FaCircle />
                                    </div>
                                    )
                                )}
                                {renderIcon('Prova')}
                                <span>{prova.name}</span>
                                {renderScore(c)}
                                </div>
                                {renderButton(c, moduloId, c.id, prova.id)}
                            </div>
                            );
                        })}
                        </div>
                    ))}
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
    userId: PropTypes.string.isRequired,
};

export default Aulas;