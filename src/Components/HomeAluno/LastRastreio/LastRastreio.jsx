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
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../services/firebaseConfig';

function LastRastreio({ data, close, alunoName, comentarioAtt }) {
    const [patients, setPatients] = useState([])
    const searchTerm = '';
    const sortOrder = 'desc';
    const [comentario, setComentario] = useState('')

    useEffect(() => {
        if (data) {
            try{
                //console.log('Data useEffect: ', data[0])
                const rastreiosArray = data[0];
                setPatients(rastreiosArray)
            }catch{
                //console.log('deu erro')
            }
            
        } else {
            //console.error('Expected data to be an array or an object, but got:', data);
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

    const ConfirmBtn = async () => {
        await saveComent()
        close(true)
    }

    function formatDateToDDMMYYYY(date) {
        const createdAtDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
        const day = String(createdAtDate.getDate()).padStart(2, '0'); 
        const month = String(createdAtDate.getMonth() + 1).padStart(2, '0'); 
        const year = createdAtDate.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const saveComent = async () => {
        if (sortedPatients.length > 0 && comentario !== '') {
            const documentId = sortedPatients[0].id; // ID do documento a ser atualizado
            const comentarioRef = doc(firestore, "rastreios", documentId);
    
            try {
                await updateDoc(comentarioRef, {
                    comentario: comentario 
                });
                //console.log("Comentário atualizado com sucesso!");
                comentarioAtt(true)
            } catch (error) {
                //console.error("Erro ao atualizar o comentário:", error);
            }
        } else {
            //console.log("Comentário Vazio");
        }
    };

    return (
        <>
            <div className='divLastRastreio'>
                <div className='divContent'>
                    <header className='headerLastRastreio'>
                        <h2>Rastreio concluído! <span className='icon'><FaCircleCheck size={20}/></span></h2>
                        <p>Veja os resultados abaixo!</p>
                    </header>
                    <div className='infos'>
                        <p>Nome do aluno: <span className='bold'>{sortedPatients.length > 0 ? sortedPatients[0].patient : ''}</span></p>
                        <p>Nome do professor: <span className='bold'>{alunoName}</span></p>
                        <p>Escola: <span className='bold'>{sortedPatients.length > 0 ? sortedPatients[0].school : ''}</span></p>
                        <p style={{display: 'flex', alignItems: 'center', gap: 8}}>Data: <p style={{fontWeight: 500}}>{formatDateToDDMMYYYY(sortedPatients.length > 0 ? sortedPatients[0].createdAt : '')}</p></p>
                    </div>
                    <div className='divValues caracter'>
                        <p>Caracterização de risco: </p>
                        {sortedPatients.map((patient, index) => {
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
                                        {renderGrafic(statusCrianca)}
                                        <p style={{width: '100%', fontSize: 14}}>{statusCrianca === 'pp' ? 'Baixo risco potencial de transtorno do neurodesenvolvimento' : statusCrianca === 'p' ? 'Médio risco potencial de transtorno do neurodesenvolvimento' : statusCrianca === 'mp' ? 'Alto risco potencial de transtorno do neurodesenvolvimento' : ''}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                   
                        <div style={{display: 'flex', flexDirection: 'column', position: 'relative', borderBottom: 'solid 1px #ccc', paddingBottom: 12}}>
                            <label htmlFor="coment" style={{position: 'absolute', top: -10, fontSize: 12, left: 12, backgroundColor: '#FFF', paddingInline: 4}}>Observações</label>
                            <textarea
                                name="coment"
                                id="coment"
                                maxLength="200"
                                style={{ height: 150, outline: 'none', padding: 8, border: 'solid 1px #ccc', borderRadius: 4 }}
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                            ></textarea>
                            <p style={{marginLeft: 8, fontSize: 12}}>{comentario.length}/200</p>
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
    alunoName: PropTypes.string.isRequired,
    comentarioAtt: PropTypes.bool.isRequired,
};

export default LastRastreio;
