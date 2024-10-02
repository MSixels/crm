import './Rastreios.css'
import ButtonBold from '../../ButtonBold/ButtonBold'
import { FaCirclePlus } from 'react-icons/fa6'
import { useEffect, useState } from 'react'
import ModalCreateRastreio from '../../ModalCreateRastreio/ModalCreateRastreio'
import PropTypes from 'prop-types'
import { FaCircleCheck } from "react-icons/fa6";
import InputText from '../../InputText/InputText'
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { deleteDoc, doc } from 'firebase/firestore'
import { firestore } from '../../../services/firebaseConfig'
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
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [activeModalIndex, setActiveModalIndex] = useState(null);
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

    useEffect(() => {
        if (data) {
            try{
                console.log('Data useEffect: ', data[0])
                const rastreiosArray = data[0];
                setPatients(rastreiosArray)
                const total = rastreiosArray.length;
                //console.log(total)
                const typeQuest1 = rastreiosArray.filter(rastreio => rastreio.typeQuest === 1).length;
                const typeQuest2 = rastreiosArray.filter(rastreio => rastreio.typeQuest === 2).length;
                const typeQuest3 = rastreiosArray.filter(rastreio => rastreio.typeQuest === 3).length;
        
                setRastreioCounts({
                    total,
                    typeQuest1,
                    typeQuest2,
                    typeQuest3,
                });
                
            }catch{
                console.log('deu erro')
            }
            
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

    const handleSearchChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm); 
    };

    const removeAccents = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const filteredPatients = patients.filter(patient => {
        const lowerCaseSearchTerm = removeAccents(searchTerm).toLowerCase();
        return removeAccents(patient.patient).toLowerCase().includes(lowerCaseSearchTerm);
    });

    const toggleSortOrder = () => {
        setSortOrder(prevSortOrder => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
    };

    const sortedPatients = [...filteredPatients].sort((a, b) => {
        const dateA = new Date(a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000);
        const dateB = new Date(b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000);

        if (sortOrder === 'asc') {
            return dateA - dateB; 
        } else {
            return dateB - dateA; 
        }
    });

    const clickBtn = (openModal) => {
        setShowModal(openModal);
    }

    const closeBtn = (close) => {
        setShowModal(close);
    }

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

    const openModalEdit = (index) => {
        setActiveModalIndex(prevIndex => prevIndex === index ? null : index);
    };  

    const openConfirmDeleteModal = (index) => {
        setConfirmDeleteIndex(index);
    };

    const handleDelete = async (index) => {
        try {
            const patientToDelete = sortedPatients[index];
            if (!patientToDelete || !patientToDelete.id) {
                throw new Error("ID do paciente não encontrado.");
            }
            const id = patientToDelete.id;  
            const patientDocRef = doc(firestore, "rastreios", id);
            await deleteDoc(patientDocRef);

            const updatedPatients = sortedPatients.filter((_, i) => i !== index);
            setPatients(updatedPatients)
            const total = updatedPatients.length;
            const typeQuest1 = updatedPatients.filter(rastreio => rastreio.typeQuest === 1).length;
            const typeQuest2 = updatedPatients.filter(rastreio => rastreio.typeQuest === 2).length;
            const typeQuest3 = updatedPatients.filter(rastreio => rastreio.typeQuest === 3).length;
        
            setRastreioCounts({
                total,
                typeQuest1,
                typeQuest2,
                typeQuest3,
            });
            

            setConfirmDeleteIndex(null);
        } catch (error) {
            console.error("Erro ao excluir o paciente:", error);
        }
    };


    const closeConfirmDeleteModal = () => {
        setActiveModalIndex(null)
        setConfirmDeleteIndex(null); 
    };

    const renderDataClean = () => {
        return(
            <div className='divRastreioClean'>
                <h3>Você ainda não tem nenhum rastreios cadastrado</h3>
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
                        <p className='value'>{c.icon} {c.value} {c.value > 1 ? 'rastreios' : 'rastreio'}</p>
                    </div>
                ))}
            </div>
            <h3 style={{fontSize: 20, marginTop: 64}}>Rastreios concluídos</h3>
            <div className='divConcluidosRastreio'>
                <div className='divContent'>
                    <header>
                        <InputText title='Pesquisar nome' placeH='' onSearchChange={handleSearchChange} />
                    </header>
                    <div className='divHeaderValues'>
                        {header.map((h) => (
                            <div key={h.id} className='divTitle'>
                                <p>{h.title}</p>
                                {h.title === 'DATA DO RASTRIEO' && 
                                    <div className='iconClick' onClick={toggleSortOrder}>
                                        {sortOrder === 'desc' ? <FaAngleDown /> : <FaAngleUp />}
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                    <div className='divValues'>
                    {sortedPatients.length === 0 ? (
                        renderDataClean()
                    ) : (
                        sortedPatients.map((patient, index) => {
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
                                <div key={index} className='divPatient'>
                                    <p className='divlineValue'>{patient.patient}</p>
                                    <p className='divlineValue'>
                                        {patient.typeQuest === 1 ? '3 a 6 anos' : patient.typeQuest === 2 ? 'Até 8 anos' : patient.typeQuest === 3 ? 'Acima de 8 anos' : ''}
                                    </p>
                                    <p className='divlineValue'>{formattedDate}</p> 

                                    {renderGrafic(tdahPotential)}
                                    {renderGrafic(teaPotential)}
                                    {renderGrafic(teapPotential)}
                                    {renderGrafic(tlPotential)}
                                    {renderGrafic(todPotential)}
                                    {renderGrafic(tdiPotential)}

                                    <div className='btnEditPatient' onClick={() => openModalEdit(index)}>
                                        <BsThreeDotsVertical />
                                    </div>

                                    {activeModalIndex === index && 
                                        <div className='modalEditPatient'>
                                            <p className='alert' onClick={() => openConfirmDeleteModal(index)}>Excluir Rastreio</p>
                                        </div>
                                    }

                                    {confirmDeleteIndex === index && (
                                        <div className='containerModalConfirmDelete'>
                                            <div className='modalConfirmDelete'>
                                                <p className='titleAlert'>Tem certeza que deseja excluir o rastreio?</p>
                                                <div className='divBtns'>
                                                    <button onClick={() => handleDelete(index)} className='delete'>Confirmar</button>
                                                    <button onClick={closeConfirmDeleteModal} className='close'>Cancelar</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                    </div>
                    <div className='legendas'>
                        <p>Legenda de diagnóstico</p>
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
            </div>
        </div>
    );
}

Rastreios.propTypes = {
    data: PropTypes.array.isRequired,
};

export default Rastreios;
