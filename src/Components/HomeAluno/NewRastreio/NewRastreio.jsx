import { useParams } from 'react-router-dom';
import './NewRastreio.css';
import { questsRestreio } from '../../../database';
import { useState } from 'react';
import { IoChevronBackSharp } from "react-icons/io5";
import { GrFormNext } from "react-icons/gr";

function NewRastreio() {
    const { page } = useParams();
    const [selectedOptions, setSelectedOptions] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const handleOptionSelect = (questId, optionId) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [questId]: optionId 
        }));
    };

    const pagesViews = [1, 2, 3, 4]

    const pagesBar = [
        {id: 1},
        {id: 2},
        {id: 3},
        {id: 4},
    ]

    const handleBack = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };
    
    const handleNext = () => {
        if (currentPage < pagesViews.length) {
            setCurrentPage(prev => prev + 1);
        }
    };

    return (
        <div className='containerNewRastreio'>
            <div className='divContent'>
                <div className='divHeader'>
                    <h2 style={{marginBottom: 32}}>
                        ESCALA DE RASTREAMENTO RADY E BORGES PARA CRIANÇAS{' '}
                        <span>
                            {page === 'novo-rastreio-tipo-1' 
                                ? 'ENTRE 3 E 6 ANOS' 
                                : page === 'novo-rastreio-tipo-2' 
                                ? 'ATÉ 8 ANOS' 
                                : page === 'novo-rastreio-tipo-3' 
                                ? 'ACIMA DE 8 ANOS' 
                                : ''}
                        </span>
                    </h2>
                    <p style={{marginBottom: 20, fontSize: 18}}>
                        <span style={{fontWeight: 'bold'}}>Objetivo:</span> Analisar o potencial de risco do Paciente para determinados transtornos, espectros e condições.
                    </p>
                    <p style={{marginBottom: 20, fontSize: 18}}>
                        <span style={{fontWeight: 'bold'}}>Tópicos de avaliação:</span>
                    </p>
                    <ul className='listTopicos'>
                        <li style={{fontSize: 18}}>Comportamentos Repetitivos e Estereotipados</li>
                        <li style={{fontSize: 18}}>Dificuldades de Comunicação</li>
                        <li style={{fontSize: 18}}>Habilidades Sociais e Interações</li>
                        <li style={{fontSize: 18}}>Sensibilidade Sensorial</li>
                        <li style={{fontSize: 18}}>Adaptabilidade e Flexibilidade Cognitiva</li>
                    </ul>
                    <div className='divBarPages'>
                        {pagesBar.map((p) => (
                            <div 
                                key={p.id} 
                                className={`bar ${p.id <= currentPage ? 'active' : ''}`} // Adiciona 'active' se p.id for menor ou igual a currentPage
                            ></div>
                        ))}
                    </div>
                </div>
                <div className='divOptions'>
                    {questsRestreio.map((qr) => (
                        <div key={qr.id} className='divOption'>
                            <p className='title'>{qr.id} {qr.quest}</p>
                            <div className='btns'>
                                {qr.options.map((op) => (
                                    <div 
                                        key={op.id} 
                                        className={`divBtn ${selectedOptions[qr.id] === op.id ? 'active' : ''}`} 
                                        onClick={() => handleOptionSelect(qr.id, op.id)} // Marca a opção para a questão específica
                                    >
                                        <div className='circle'>
                                            <div className={`${selectedOptions[qr.id] === op.id ? 'ball' : ''}`}></div>
                                        </div>
                                        <p>{op.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='footer'>
                    <div className='backNext'>
                        <div 
                            className={`divIcon ${currentPage === 1 ? 'blur' : ''}`} 
                            onClick={handleBack}
                        >
                            <IoChevronBackSharp size={20}/>
                        </div>
                        <p style={{fontSize: 18}}>{currentPage}/{pagesViews.length}</p>
                        <div 
                            className={`divIcon ${currentPage === pagesViews.length ? 'blur' : ''}`} 
                            onClick={handleNext}
                        >
                            <GrFormNext size={50}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewRastreio;
