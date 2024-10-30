import './RastreiosConcluidos.css'
import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import InputText from '../../InputText/InputText'
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { deleteDoc, doc } from 'firebase/firestore'
import { firestore } from '../../../services/firebaseConfig'
import { GrNext } from "react-icons/gr";
import { MdArrowBackIosNew } from "react-icons/md";
import DropDown from '../../DropDown/DropDown'
import { 
    evaluateTDAHPotential, 
    evaluateTEAPotential, 
    evaluateTEAPPotential, 
    evaluateTLPotential, 
    evaluateTODPotential, 
    evaluateTDIPotential 
} from '../../../functions/functions'
import InputDate from '../../InputDate/InputDate';
import ButtonBold from '../../ButtonBold/ButtonBold';
import { FaDownLong } from "react-icons/fa6";

function RastreiosConcluidos({ data, confirmPDF, valuesPDF }) {
    const [patients, setPatients] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [activeModalIndex, setActiveModalIndex] = useState(null);
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [showModalNumberPages, setShowModalNumberPages] = useState(false)
    const [searchDrop, setSearchDrop] = useState('Selecione')
    const [searchDate, setSearchDate] = useState('')
    const [isBtnPDFUnicoCalled, setIsBtnPDFUnicoCalled] = useState(false);

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

    const handleSearchChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm); 
    };

    const removeAccents = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    function formatDateToDDMMYYYY(date) {
        const createdAtDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
        const day = String(createdAtDate.getDate()).padStart(2, '0'); 
        const month = String(createdAtDate.getMonth() + 1).padStart(2, '0'); 
        const year = createdAtDate.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function formatSearchDate(searchDate) {
        const [year, month, day] = searchDate.split('-');
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }

    const filteredPatients = patients.filter(patient => {
        const lowerCaseSearchTerm = removeAccents(searchTerm).toLowerCase();
        const matchesSearchTerm = removeAccents(patient.patient).toLowerCase().includes(lowerCaseSearchTerm);
        const matchesAgeRange = searchDrop === 'Selecione' || patient.typeQuest === parseInt(searchDrop);
        if (!patient.createdAt) {
            return false; 
        }
        const formattedPatientDate = formatDateToDDMMYYYY(patient.createdAt);
        const formattedSearchDate = searchDate ? formatSearchDate(searchDate) : '';
        const matchesDate = formattedSearchDate === '' || formattedPatientDate === formattedSearchDate;
    
        return matchesSearchTerm && matchesAgeRange && matchesDate;
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
    }).slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    useEffect(() => {
        if (filteredPatients.length > 0 && !isBtnPDFUnicoCalled) {
            valuesPDF(filteredPatients);  
            //console.log(filteredPatients);
        }
    }, [filteredPatients, valuesPDF, isBtnPDFUnicoCalled]);

    const btnPDFUnico = (index) => {
        setIsBtnPDFUnicoCalled(true); 
        //console.log(index);
        //console.log(patient);

        //console.log('Valor função: ', [sortedPatients[index]])
        
        valuesPDF([sortedPatients[index]]);
        btnGerarPDFUnico()
    };

    const handleNextPage = () => {
        if ((currentPage + 1) * itemsPerPage < filteredPatients.length) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const renderGrafic = (value) => {
        return(
            <div className='containerGraficMini divlineValue'>
                <div className={`bar bar-1 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-2 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-3 ${value === 'pp' ? '' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-4 ${value === 'pp' ? '' : value === 'p' ? '' : value === 'mp' ? 'red' : ''}`}></div>
                <div>
                    <p style={{marginLeft: 12}}>{value === 'pp' ? 'Baixo risco potencial' : value === 'p' ? 'Médio risco potencial' : value === 'mp' ? 'Alto risco potencial' : ''}</p>
                </div>
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
        {id: 1, title: 'NOME'},
        {id: 2, title: 'FAIXA ETÁRIA'},
        {id: 3, title: 'DATA DO RASTRIEO'}, 
        {id: 4, title: 'CARACTERIZAÇÃO DE RISCO'},
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
            setConfirmDeleteIndex(null);
            setActiveModalIndex(null)
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

    const renderModalNumberLiner = () => {
        const options = [
            {id: 1, value: 40},
            {id: 1, value: 20},
            {id: 1, value: 10},
            {id: 1, value: 5},
        ]

        return(
            <div className='containerRenderModalNumberLiner'>
                {options.map((o) => (
                    <div key={o.id} className='option' onClick={() => setItemsPerPage(o.value)}>
                        {o.value}
                    </div>
                ))}
            </div>
        )
    }

    const dropDownOptions = [
        { id: 1, name: '3 a 6 anos' },
        { id: 2, name: 'Até 8 anos' },
        { id: 3, name: 'Acima de 8 anos' },
    ];

    const handleDropChange = (option) => {
        if (option.id) {
            setSearchDrop(option.id); 
        } else {
            setSearchDrop('Selecione');
        }
    };

    useEffect(() => {
        console.log(searchDate)
    }, [searchDate])

    const btnGerarPDF = () => {
        setIsBtnPDFUnicoCalled(false)
        confirmPDF(true)
    }

    const btnGerarPDFUnico = () => {
        confirmPDF(true)
    }

    return (
        <>
            <h3 style={{fontSize: 20, marginTop: 64}}>Rastreios concluídos</h3>
            
            <div className='divConcluidosRastreio'>
                <div className='divContent'>
                    <header>
                        <div className='contentHeader'>
                            <InputText title='Pesquisar nome' placeH='' onSearchChange={handleSearchChange} />
                            <div className='divInput'>
                                <DropDown title='Faixa Etária' type='Selecione' options={dropDownOptions} onTurmaChange={handleDropChange} />
                            </div>
                            <div className='divInput'>
                                <InputDate title='Data' placeH='Selecione' onSearchChange={setSearchDate}/>
                            </div>
                        </div>
                        <ButtonBold title='Gerar PDF' icon={<FaDownLong />} action={btnGerarPDF}/>
                    </header>
                    <div className='divLimitHeaderValues'>
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

                                    const potentials = [
                                        tdahPotential, teaPotential, teapPotential, tlPotential, todPotential, tdiPotential
                                    ];
                                    let statusCrianca = '';
                                    
                                    if (potentials.includes('mp')) {
                                        statusCrianca = 'mp';
                                    } else if (potentials.includes('p')) {
                                        statusCrianca = 'p';
                                    } else {
                                        statusCrianca = 'pp';
                                    }

                                    return (
                                        <div key={index} className='divPatient'>
                                            <p className='divlineValue'>{patient.patient}</p>
                                            <p className='divlineValue'>
                                                {patient.typeQuest === 1 ? '3 a 6 anos' : patient.typeQuest === 2 ? 'Até 8 anos' : patient.typeQuest === 3 ? 'Acima de 8 anos' : ''}
                                            </p>
                                            <p className='divlineValue'>{formattedDate}</p> 

                                            {renderGrafic(statusCrianca)}
                                            

                                            <div className='btnEditPatient' onClick={() => openModalEdit(index)}>
                                                <BsThreeDotsVertical />
                                            </div>

                                            {activeModalIndex === index && 
                                                <div className='modalEditPatient'>
                                                    <p className='alert' onClick={() => openConfirmDeleteModal(index)}>Excluir Rastreio</p>
                                                    <p className='' onClick={() => btnPDFUnico(index)}>Baixar PDF</p>
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
                    </div>
                    
                    <div className='footer'>
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
                        <div className='legendas'>
                            <div className='divNumberLines'>
                                <p>Linhas por página <span className='bold'>{itemsPerPage}</span></p>
                                <div onClick={() => setShowModalNumberPages(!showModalNumberPages)} className='divIcon'>
                                    {showModalNumberPages ? <FaAngleDown /> : <FaAngleUp />}
                                    {showModalNumberPages && renderModalNumberLiner()}
                                </div>
                                
                            </div>
                            
                            <p className='bold'>{currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, filteredPatients.length)} de {filteredPatients.length}</p>
                            <div className='btnNextPage'>
                                <div className='divBtnBackNext' onClick={handlePreviousPage}>
                                    <MdArrowBackIosNew />
                                </div>
                                <div className='divBtnBackNext' onClick={handleNextPage}>
                                    <GrNext />
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

RastreiosConcluidos.propTypes = {
    data: PropTypes.array.isRequired,
    confirmPDF: PropTypes.bool.isRequired,
    valuesPDF: PropTypes.array.isRequired,
};

export default RastreiosConcluidos;
