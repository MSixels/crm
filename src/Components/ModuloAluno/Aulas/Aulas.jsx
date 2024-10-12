import './Aulas.css';
import PropTypes from 'prop-types';
import { FaPlay, FaLock, FaVideo, FaBookOpen, FaCheckCircle, FaCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { moduloContent } from '../../../database';

function Aulas({ modulo, conteudo, aulas, provas }) {
    const navigate = useNavigate();
    const [todosConcluidos, setTodosConcluidos] = useState(false);

    const handleStartContent = (moduloId) => {
        navigate(`/aluno/modulo/${moduloId}`);
    };

    const renderButton = (contentItem, moduloId) => {
        if (contentItem.status === "completed") {
            if (contentItem.type === "Aula" || contentItem.type === "Ao Vivo") {
                return <button className='btn-access' onClick={() => handleStartContent(moduloId)}>Reassistir</button>;
            } else if (contentItem.type === "Teste" || contentItem.type === "Prova") {
                return <button className='btn-access' onClick={() => handleStartContent(moduloId)}>Ver Respostas</button>;
            }
        } else if (contentItem.status === "blocked") {
            return <FaLock color='gray' />;
        } else {
            return <button onClick={() => handleStartContent(moduloId)}>Iniciar</button>;
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
            return <FaVideo color='#4A5E6D'/>;
        } else if (type === "Teste" || type === "Prova") {
            return <FaBookOpen color='#4A5E6D'/>;
        }
    };

    const renderScore = (score) => {
        if (score !== null) {
            const scoreColor = score >= 70 ? 'green' : 'red';
            return <span className={`score ${scoreColor}`}>{score}</span>;
        }
        return null;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate() + 1).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Lembre-se que os meses começam do 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className='containerAulas'>
            {modulo && (
                <div className='divContent'>
                    <div className='divHeadLine'>
                        <div className='textHeadLine'>
                            <h2 className='moduleName'>{modulo.name}</h2>
                            <span className='moduleDescription'>{modulo.description}</span>
                        </div>
                        <button className='btn-continue'>Continuar de onde parou <FaPlay /></button>
                    </div>

                    {moduloContent.map((weekItem, index) => (
                        <div key={index} className='weekSection'>
                            <h3 className='titleContent'>{weekItem.week}: {weekItem.title} ({weekItem.date})</h3>

                            {weekItem.content.map((contentItem, idx) => (
                                <div
                                    key={idx}
                                    className={`contentRow ${contentItem.status === 'blocked' ? 'blocked' : ''}`}
                                >
                                    <div className="contentInfo">
                                        {contentItem.status === 'blocked' ? (
                                            <FaLock color='gray' />
                                        ) : (
                                            contentItem.status === 'completed' ? (
                                                <FaCheckCircle color='#1BA284' />
                                            ) : (
                                                <FaCircle color='#222D7E' />
                                            )
                                        )}
                                        {renderIcon(contentItem.type)}
                                        <span>{contentItem.type} - {contentItem.title} ({contentItem.duration})</span>
                                        {renderScore(contentItem.score)}
                                    </div>
                                    {renderButton(contentItem, modulo.id, idx)}
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
            {/*======= Vamos utilizar esse de baixo Pois está lincado com o banco de dados ===== */}
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
                               <p>{aula.name} </p>
                               <button onClick={() => navigate(`/aluno/modulo/${modulo.id}/${c.id}/${aula.id}`)}>Abrir Aula</button>
                            </div>
                        ))}
                        {provas.filter((prova) => prova.conteudoId === c.id).map((prova) => (
                            <div key={prova.id}>
                            <p>{prova.name}</p>
                            <button onClick={() => navigate(`/aluno/modulo/${modulo.id}/${c.id}/${prova.id}`)}>Abrir Prova</button>
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
