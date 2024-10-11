import './Aulas.css';
import PropTypes from 'prop-types';
import { FaPlay, FaCheckCircle, FaLock, FaChalkboardTeacher, FaClipboardList } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { moduloContent } from '../../../database';

function Aulas({ modulo }) {
    const navigate = useNavigate();
    
    const [todosConcluidos, setTodosConcluidos] = useState(false);

    const handleStartContent = (moduloId, contentId) => {
        navigate(`/aluno/modulo/${moduloId}/aula/${contentId}`);
    };

    const renderButton = (contentItem, moduloId, contentId) => {
        if (contentItem.status === "completed") {
            if (contentItem.type === "Aula" || contentItem.type === "Ao Vivo") {
                return <button className='btn-access' onClick={() => handleStartContent(moduloId, contentId)}>Reassistir</button>;
            } else if (contentItem.type === "Teste" || contentItem.type === "Prova") {
                return <button className='btn-access'>Ver Respostas</button>;
            }
        } else if (contentItem.status === "blocked") {
            return <FaLock color='gray' />;
        } else {
            return <button onClick={() => handleStartContent(moduloId, contentId)}>Iniciar</button>;
        }
    };

    useEffect(() => {
        if (modulo) {
            const conteudos = moduloContent.flatMap(week => week.content);
            const concluidos = conteudos.every(content => content.status === 'completed');
            setTodosConcluidos(concluidos);
        }
    }, [modulo]);

    const renderIcon = (type) => {
        if (type === "Aula" || type === "Ao Vivo") {
            return <FaChalkboardTeacher />;
        } else if (type === "Teste" || type === "Prova") {
            return <FaClipboardList />;
        }
    };

    const renderScore = (score) => {
        if (score !== null) {
            const scoreColor = score >= 70 ? 'green' : 'red';
            return <span className={`score ${scoreColor}`}>{score}</span>;
        }
        return null;
    };

    return (
        <div className='containerAulas'>
            {modulo && (
                <div className='divContent'>
                    <div className='divHeadLine'>
                        <div className='textHeadLine'>
                            <h2>{modulo.name}</h2>
                            <span>{modulo.description}</span>
                        </div>
                        <button className='btn-continue'>Continuar de onde parou <FaPlay /></button>
                    </div>

                    {moduloContent.map((weekItem, index) => (
                        <div key={index} className='weekSection'>
                            <h3 className='titleContent'>{weekItem.week}: {weekItem.title} ({weekItem.date})</h3>

                            {weekItem.content.map((contentItem, idx) => (
                                <div key={idx} className={`contentRow ${contentItem.status}`}>
                                    <div className="contentInfo">
                                        {contentItem.status === 'completed' ? (
                                            <FaCheckCircle color='green' />
                                        ) : (
                                            <FaLock color='gray' />
                                        )}
                                        {renderIcon(contentItem.type)}
                                        <span>{contentItem.type} - {contentItem.title} ({contentItem.duration})</span>
                                        {renderScore(contentItem.score)}
                                    </div>
                                    {renderButton(contentItem)}
                                </div>
                            ))}
                        </div>
                    ))}

                    <button
                        className={`nextModuleButton ${todosConcluidos ? 'enabled' : 'disabled'}`}
                        disabled={!todosConcluidos}
                    >
                        Próximo Módulo
                    </button>
                </div>
            )}
        </div>
    );
}

Aulas.propTypes = {
    modulo: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
    })
};

export default Aulas;
