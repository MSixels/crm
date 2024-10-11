import './RastreioPDF.css'
import PropTypes from 'prop-types'
import { 
    evaluateTDAHPotential, 
    evaluateTDIPotential, 
    evaluateTEAPotential, 
    evaluateTEAPPotential, 
    evaluateTLPotential, 
    evaluateTODPotential 
} from '../../../functions/functions';
import { useEffect } from 'react';
import { FaCircleCheck } from 'react-icons/fa6';

function RastreioPDF({ alunoName, dataCards, dataValues }) {

    useEffect(() => {
        console.log('dataCards: ', dataCards); // Isso deve sempre mostrar um array, mesmo que vazio
    }, [dataCards]);
    
    const header = [
        {id: 1, title: 'NOME'},
        {id: 2, title: 'FAIXA ETÁRIA'},
        {id: 3, title: 'DATA DO RASTRIEO'}, 
        {id: 4, title: 'TDAH'},
        {id: 5, title: 'TEA'},
        {id: 6, title: 'TEAP'},
        {id: 7, title: 'TL'},
        {id: 8, title: 'TOD'},
        {id: 9, title: 'TDI'},
    ]

    const renderGrafic = (value) => {
        return(
            <div className='containerGraficMiniPDF divlineValuePDF'>
                <div className={`bar bar-1 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-2 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-3 ${value === 'pp' ? '' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-4 ${value === 'pp' ? '' : value === 'p' ? '' : value === 'mp' ? 'red' : ''}`}></div>
            </div>
        )
    }

    const renderHighGrafic = (value) => {
        return(
            <div className='high divlineValue'>
                <div className={`bar bar-1 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-2 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-3 ${value === 'pp' ? '' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-4 ${value === 'pp' ? '' : value === 'p' ? '' : value === 'mp' ? 'red' : ''}`}></div>
            </div>
        )
    }

    return (
        <div className='containerRastreioPDF'>
            <h1 className='title'>Relatório de rastreios</h1>
            <p className='subtitle'>{alunoName}</p>
            <div className='divContentCardsPDF'>
                <div className='divCradsPDF'>
                {dataCards && dataCards.length > 0 ? (
                    dataCards.map((c) => (
                        <div key={c.id} className='divCardPDF'>
                            <p className='title'>{c.title}</p>
                            <p className='value'>
                                <span style={{color: c.value === 0 ? '#7991a4' : '#1BA284'}}>{c.icon === 'active' ? <FaCircleCheck size={20}/> : ''}</span> 
                                {c.value} rastreios
                            </p>
                        </div>
                    ))
                ) : (
                    <p>Nenhum dado disponível</p> // Ou algum fallback caso o array esteja vazio
                )}
                </div>
            </div>
            <div className='divValuesPDF'>
                <p className='titleValues'>Todos os rastreios</p>
                <div className='divContentValuesPDF'>
                    <div className='divHeaderValues'>
                        {header.map((h) => (
                            <div key={h.id} className='divTitle'>
                                <p className='headerTitlePDF'>{h.title}</p>
                            </div>
                        ))}
                    </div>
                    <div className='divPatientsPDF'>
                        {dataValues.map((patient, index) => {
                                const createdAtDate = new Date(patient.createdAt.seconds * 1000 + patient.createdAt.nanoseconds / 1000000);
                                const day = String(createdAtDate.getDate()).padStart(2, '0'); 
                                const month = String(createdAtDate.getMonth() + 1).padStart(2, '0'); 
                                const year = createdAtDate.getFullYear();
                                const formattedDate = `${day}/${month}/${year}`;

                                const { tdahPotential } = evaluateTDAHPotential(patient.responses);
                                const { teaPotential } = evaluateTEAPotential(patient.responses);
                                const { teapPotential } = evaluateTEAPPotential(patient.responses);
                                const { tlPotential } = evaluateTLPotential(patient.responses);
                                const { todPotential } = evaluateTODPotential(patient.responses);
                                const { tdiPotential } = evaluateTDIPotential(patient.responses);

                                return (
                                    <div key={index} className='divPatientPDF'>
                                        <p className='divlineValuePDF'>{patient.patient}</p>
                                        <p className='divlineValuePDF'>
                                            {patient.typeQuest === 1 ? '3 a 6 anos' : patient.typeQuest === 2 ? 'Até 8 anos' : patient.typeQuest === 3 ? 'Acima de 8 anos' : ''}
                                        </p>
                                        <p className='divlineValuePDF'>{formattedDate}</p> 

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
                    
                </div>
            </div>
            <div className='footer'>
                <div className='legendas'>
                    <div className='l_graficos'>
                        <p>Pouco provável</p>
                        {renderHighGrafic('pp')}
                    </div>
                    <div className='l_graficos'>
                        <p>Provável</p>
                        {renderHighGrafic('p')}
                    </div>
                    <div className='l_graficos'>
                        <p>Muito provável</p>
                        {renderHighGrafic('mp')}
                    </div>
                </div>
            </div>
        </div>
    )
}
RastreioPDF.propTypes = {
    alunoName: PropTypes.string.isRequired,
    dataCards: PropTypes.array.isRequired,
    dataValues: PropTypes.array.isRequired,
};

export default RastreioPDF