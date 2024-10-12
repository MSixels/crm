import './Aulas.css';
import PropTypes from 'prop-types';
import { FaPlay, FaLock, FaVideo, FaBookOpen, FaCheckCircle, FaCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Aulas({ modulo, conteudo, aulas, provas }) {
    const navigate = useNavigate();
    const [todosConcluidos, setTodosConcluidos] = useState(false);
    const [conteudoDesbloqueado, setConteudoDesbloqueado] = useState([]);

    const handleStartContent = (moduloId, contentId) => {
        navigate(`/aluno/modulo/${moduloId}/${contentId}`);
    };

    const renderButton = (contentItem, moduloId) => {
        if (contentItem.status === "completed") {
            if (contentItem.type === "Aula" || contentItem.type === "Ao Vivo") {
                return <button className='btn-access' onClick={() => handleStartContent(moduloId, contentItem.id)}>Reassistir</button>;
            } else if (contentItem.type === "Teste" || contentItem.type === "Prova") {
                return <button className='btn-access' onClick={() => handleStartContent(moduloId, contentItem.id)}>Ver Respostas</button>;
            }
        } else if (contentItem.status === "blocked") {
            return <FaLock color='gray' />;
        } else {
            return <button className='btn-access' onClick={() => handleStartContent(moduloId, contentItem.id)}>Iniciar</button>;
        }
    };

    const renderIcon = (type) => {
        if (type === "Aula" || type === "Ao Vivo") {
            return <FaVideo color='#4A5E6D' />;
        } else if (type === "Teste" || type === "Prova") {
            return <FaBookOpen color='#4A5E6D' />;
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
                    .sort((a, b) => new Date(a.openDate) - new Date(b.openDate)) // Ordena da data mais antiga para a mais recente
                    .map((c) => (
                        <div key={c.id} className="weekSection">
                        <h3 className="titleContent">
                            {c.name} {formatDate(c.openDate)}
                        </h3>
                        {aulas.filter((aula) => aula.conteudoId === c.id).map((aula) => (
                            <div key={aula.id}>
                            <p>{aula.name}</p>
                            </div>
                        ))}
                        {provas.filter((prova) => prova.conteudoId === c.id).map((prova) => (
                            <div key={prova.id}>
                            <p>{prova.name}</p>
                            </div>
                        ))}
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
};

export default Aulas;
