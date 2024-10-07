import './LastRastreio.css'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FaCircleCheck } from "react-icons/fa6";
import { 
    evaluateTDAHPotential, 
    evaluateTEAPotential, 
    evaluateTEAPPotential, 
    evaluateTLPotential, 
    evaluateTODPotential, 
    evaluateTDIPotential 
} from '../../../functions/functions'
import ButtonBold from '../../ButtonBold/ButtonBold';

function LastRastreio({ data, close }) {
    const [patients, setPatients] = useState([])
    const searchTerm = '';
    const sortOrder = 'desc';

    useEffect(() => {
        if (data) {
            try{
                //console.log('Data useEffect: ', data[0])
                const rastreiosArray = data[0];
                setPatients(rastreiosArray)
            }catch{
                console.log('deu erro')
            }
            
        } else {
            console.error('Expected data to be an array or an object, but got:', data);
        }
    }, [data]);

    const removeAccents = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const filteredPatients = patients.filter(patient => {
        const lowerCaseSearchTerm = removeAccents(searchTerm).toLowerCase();
        return removeAccents(patient.patient).toLowerCase().includes(lowerCaseSearchTerm);
    });

    const sortedPatients = [...filteredPatients].sort((a, b) => {
        const dateA = new Date(a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000);
        const dateB = new Date(b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000);

        if (sortOrder === 'asc') {
            
            return dateA - dateB; 
        } else {
            return dateB - dateA; 
        }
    }).slice(0, 1);

    const renderGrafic = (value) => {
        return(
            <div className='containerGraficMini divlineValue'>
                <div className={`bar bar-1 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-2 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-3 ${value === 'pp' ? '' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-4 ${value === 'pp' ? '' : value === 'p' ? '' : value === 'mp' ? 'red' : ''}`}></div>
            </div>
        )
    }

    const renderMiniGrafic = (value) => {
        return(
            <div className='mini divlineValue'>
                <div className={`bar bar-1 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-2 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-3 ${value === 'pp' ? '' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-4 ${value === 'pp' ? '' : value === 'p' ? '' : value === 'mp' ? 'red' : ''}`}></div>
            </div>
        )
    }

    const header = [
        {id: 1, title: 'TDAH'},
        {id: 2, title: 'TEA'},
        {id: 3, title: 'TEAP'},
        {id: 4, title: 'TL'},
        {id: 5, title: 'TOD'},
        {id: 6, title: 'TDI'},
    ]

    const ConfirmBtn = () => {
        close(true)
    }

    return (
        <>
            <div className='divLastRastreio'>
                <div className='divContent'>
                    <header className='headerLastRastreio'>
                        <h2>Rastreio concluído! <span className='icon'><FaCircleCheck size={20}/></span></h2>
                        <p>Veja os resultados abaixo!</p>
                    </header>
                    <div className='infos'>
                        <p>Nome: <span className='bold'>{sortedPatients.length > 0 ? sortedPatients[0].patient : ''}</span></p>
                        <p>Faixa etária: <span className='bold'>{sortedPatients.length > 0 ? 
                            (sortedPatients[0].typeQuest === 1 ? '3 a 6 anos' :
                            sortedPatients[0].typeQuest === 2 ? 'até 8 anos' :
                            sortedPatients[0].typeQuest === 3 ? 'acima de 8 anos' : '')
                        : ''}</span></p>
                    </div>
                    <div className='divTextResults'>
                        <p>Resultados</p>
                    </div>
                    <div className='divHeaderValues'>
                        {header.map((h) => (
                            <div key={h.id} className='divTitle'>
                                <p>{h.title}</p>
                            </div>
                        ))}
                    </div>
                    <div className='divValues'>
                        {sortedPatients.map((patient, index) => {
                                const { tdahPotential } = evaluateTDAHPotential(patient.responses);
                                const { teaPotential } = evaluateTEAPotential(patient.responses);
                                const { teapPotential } = evaluateTEAPPotential(patient.responses);
                                const { tlPotential } = evaluateTLPotential(patient.responses);
                                const { todPotential } = evaluateTODPotential(patient.responses);
                                const { tdiPotential } = evaluateTDIPotential(patient.responses);

                                return (
                                    <div key={index} className='divPatient'>
                                        {renderGrafic(tdahPotential)}
                                        {renderGrafic(teaPotential)}
                                        {renderGrafic(teapPotential)}
                                        {renderGrafic(tlPotential)}
                                        {renderGrafic(todPotential)}
                                        {renderGrafic(tdiPotential)}
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className='footer'>
                        <div className='legendas'>
                            <div className='l_graficos'>
                                <p>Pouco provável</p>
                                {renderMiniGrafic('pp')}
                            </div>
                            <div className='l_graficos'>
                                <p>Provável</p>
                                {renderMiniGrafic('p')}
                            </div>
                            <div className='l_graficos'>
                                <p>Muito provável</p>
                                {renderMiniGrafic('mp')}
                            </div>
                        </div>
                    </div>
                    <div className='divBtns'>
                        <ButtonBold title='Continuar' action={ConfirmBtn}/>
                    </div>
                </div>
            </div>
        </>
    );
}

LastRastreio.propTypes = {
    data: PropTypes.array.isRequired,
    close: PropTypes.bool.isRequired,
};

export default LastRastreio;
