import './Rastreios.css'
import ButtonBold from '../../ButtonBold/ButtonBold'
import { FaCirclePlus } from 'react-icons/fa6'
import { useEffect, useState } from 'react'
import ModalCreateRastreio from '../../ModalCreateRastreio/ModalCreateRastreio'
import PropTypes from 'prop-types'
import { FaCircleCheck } from "react-icons/fa6";
import InputText from '../../InputText/InputText'
import { 
    evaluateTDAHPotential, 
    evaluateTEAPotential, 
    evaluateTEAPPotential, 
    evaluateTLPotential, 
    evaluateTODPotential, 
    evaluateTDIPotential 
} from '../../../functions/functions'

function Rastreios({ data }) {
    const [showModal, setShowModal] = useState(false)
    const [rastreioCounts, setRastreioCounts] = useState({
        total: 0,
        typeQuest1: 0,
        typeQuest2: 0,
        typeQuest3: 0,
    });
    const [patients, setPatients] = useState([])

    useEffect(() => {
        if (data) {
            console.log(data[0])
            const rastreiosArray = data[0];
            setPatients(data[0])
            const total = rastreiosArray.length;
            console.log(total)
            const typeQuest1 = rastreiosArray.filter(rastreio => rastreio.typeQuest === 1).length;
            const typeQuest2 = rastreiosArray.filter(rastreio => rastreio.typeQuest === 2).length;
            const typeQuest3 = rastreiosArray.filter(rastreio => rastreio.typeQuest === 3).length;
    
            setRastreioCounts({
                total,
                typeQuest1,
                typeQuest2,
                typeQuest3,
            });
        } else {
            console.error('Expected data to be an array or an object, but got:', data);
            setRastreioCounts({
                total: 0,
                typeQuest1: 0,
                typeQuest2: 0,
                typeQuest3: 0,
            });
        }
    }, [data]);


    const clickBtn = (openModal) => {
        setShowModal(openModal);
    }

    const closeBtn = (close) => {
        setShowModal(close);
    }

    const cards = [
        { id: 1, icon: <FaCircleCheck color='#1BA284' size={32}/>, title: 'Concluídos', value: rastreioCounts.total },
        { id: 2, icon: '', title: '3 a 6 anos', value: rastreioCounts.typeQuest1 },
        { id: 3, icon: '', title: 'Até 8 anos', value: rastreioCounts.typeQuest2 },
        { id: 4, icon: '', title: 'Acima de 8 anos', value: rastreioCounts.typeQuest3 },
    ];

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
            <div className='containerGraficMini divlineValue'>
                <div className={`bar bar-1 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-2 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-3 ${value === 'pp' ? '' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-4 ${value === 'pp' ? '' : value === 'p' ? '' : value === 'mp' ? 'red' : ''}`}></div>
            </div>
        )
    }

    return (
        <div className='containerRastreios'>
            {showModal && <ModalCreateRastreio title='Novo rastreio' close={closeBtn}/> }
            <header>
                <div>
                    <h1>Rastreios</h1>
                    <span className='subtitle'>Inicie um novo rastreio ou veja os que já foram concluídos</span>
                </div>
                <ButtonBold title='Iniciar novo rastreio' icon={<FaCirclePlus size={20}/>} action={clickBtn} />
            </header>
            <div className='divCrads'>
                {cards.map((c) => (
                    <div key={c.id} className='divCard'>
                        <p className='title'>{c.title}</p>
                        <p className='value'>{c.icon} {c.value} rastreios</p>
                    </div>
                ))}
            </div>
            <h3 style={{fontSize: 20, marginTop: 64}}>Rastreios concluídos</h3>
            <div className='divConcluidos'>

                <div className='divContent'>
                    <header>
                        <InputText title='Pesquisar nome' placeH='' />
                    </header>
                    <div className='divHeaderValues'>
                        {header.map((h) => (
                            <div key={h.id} className='divTitle'>
                                <p style={{fontSize: 14, fontWeight: 500}}>{h.title}</p>
                            </div>
                        ))}
                    </div>
                    <div className='divValues'>
                        {patients.map((patient, index) => {
                            const createdAtDate = new Date(patient.createdAt.seconds * 1000 + patient.createdAt.nanoseconds / 1000000);
                            
                            const day = String(createdAtDate.getDate()).padStart(2, '0'); // Add leading zero
                            const month = String(createdAtDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                            const year = createdAtDate.getFullYear();
                            
                            const formattedDate = `${day}/${month}/${year}`;

                            const { tdahPotential } = evaluateTDAHPotential(patient.responses);
                            const { teaPotential } = evaluateTEAPotential(patient.responses);
                            const { teapPotential } = evaluateTEAPPotential(patient.responses);
                            const { tlPotential } = evaluateTLPotential(patient.responses);
                            const { todPotential } = evaluateTODPotential(patient.responses);
                            const { tdiPotential } = evaluateTDIPotential(patient.responses);
                            
                            return (
                                <div key={index} className='divPatient'>
                                    <p className='divlineValue'>{patient.patient}</p>
                                    <p className='divlineValue'>{patient.typeQuest === 1 ? '3 a 6 anos' : patient.typeQuest === 2 ? 'Até 8 anos' : patient.typeQuest === 3 ? 'Acima de 8 anos' : ''}</p>
                                    <p className='divlineValue'>{formattedDate}</p> 
                                    
                                    {renderGrafic(tdahPotential)}
                                    {renderGrafic(teaPotential)}
                                    {renderGrafic(teapPotential)}
                                    {renderGrafic(tlPotential)}
                                    {renderGrafic(todPotential)}
                                    {renderGrafic(tdiPotential)}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

Rastreios.propTypes = {
    data: PropTypes.array.isRequired,
};

export default Rastreios;
