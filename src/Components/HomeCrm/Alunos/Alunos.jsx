import DropDown from '../../DropDown/DropDown'
import InputText from '../../InputText/InputText'
import './Alunos.css'
import ButtonBold from '../../ButtonBold/ButtonBold'
import { FaCirclePlus } from "react-icons/fa6";
import { turmas } from '../../../database'
import { GoDotFill } from "react-icons/go";
import { useEffect, useState } from 'react';
import ModalCreateAluno from '../../ModalCreateAluno/ModalCreateAluno';
import { firestore } from '../../../services/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Loading from '../../Loading/Loading';
import PropTypes from 'prop-types'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { disableUserInFirestore, reactivateUserInFirestore } from '../../../functions/functions';

function Alunos({ userType }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDrop, setSearchDrop] = useState('Selecione')
    const [showModal, setShowModal] = useState(false)
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModalId, setActiveModalId] = useState(null)
    const [confirmId, setConfirmId] = useState(null)
    const [actionType, setActionType] = useState('')
    const header = [
        { title: 'Nome' },
        { title: 'E-mail' },
        { title: 'Status' },
        { title: 'Média' },
        { title: 'Turma' },
    ]

    const removeAccents = (text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const handleSearchChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);
    };

    /*
    const handleDropChange = (newDrop) => {
        setSearchDrop(newDrop);
    };
    */
    
    const clickBtn = (openModal) => {
        setShowModal(openModal)
    }

    const closeBtn = (close) => {
        setShowModal(close)
        fetchAlunosFromFirestore()
    }

    const fetchAlunosFromFirestore = async () => {
        try {
            const q = query(collection(firestore, 'users'), where('type', '==', 3)); // Buscar usuários com type 3
            const querySnapshot = await getDocs(q);
            const alunosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapear os dados
            setAlunos(alunosList);
            console.log(alunosList)
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlunosFromFirestore()
        
    }, [])

    const filtered = alunos.filter(a => {
        const lowerCaseSearchTerm = removeAccents(searchTerm).toLowerCase();
        const matchesSearchTerm = removeAccents(a.name).toLowerCase().includes(lowerCaseSearchTerm);
        const matchesTurma = searchDrop === 'Selecione' || turmas.find(t => t.id === a.turma)?.name === searchDrop;
    
        return matchesSearchTerm && matchesTurma;
    }).sort((a, b) => {
        return removeAccents(a.name).localeCompare(removeAccents(b.name), 'pt', { sensitivity: 'base' });
    });
    
    const openEditModal = (id) => {
        setActiveModalId(previd => previd === id ? null : id);
    }

    const openConfirmModal = (id, actionType) => {
        setConfirmId(id);
        setActionType(actionType); 
    };

    const closeConfirmModal = () => {
        setActiveModalId(null)
        setConfirmId(null); 
    };

    const handleDisable = async (id) => {
        try {
            console.log('Iniciando desativação do usuário com ID:', id);
            
            await disableUserInFirestore(id); 
            console.log('Usuário desativado do Firestore com sucesso');
            
            await fetchAlunosFromFirestore(); 
            setActiveModalId(null);
            setConfirmId(null);
        } catch (error) {
            console.error('Erro ao desativar o usuário:', error);
            alert('Erro ao desativar o usuário.');
        }
    };

    const handleReactivate = async (id) => {
        try {
            console.log('Iniciando reativação do usuário com ID:', id);
            
            await reactivateUserInFirestore(id); 
            console.log('Usuário reativado do Firestore com sucesso');
            
            await fetchAlunosFromFirestore(); 
            setActiveModalId(null);
            setConfirmId(null);
        } catch (error) {
            console.error('Erro ao reativar o usuário:', error);
            alert('Erro ao reativar o usuário.');
        }
    };

    if (loading) {
        return <Loading />
    }
    
    return(
        <div className='containerAlunos'>
            {showModal && <ModalCreateAluno title='Novo Aluno' close={closeBtn}/> }
            <h1>Alunos</h1>
            <div className='divContent'>
                <div className='header'>
                    <div className='divInputs'>
                        <InputText title='Pesquisa na lista' placeH='Nome do aluno' onSearchChange={handleSearchChange}/>
                        {/*<DropDown title='Turma(s)' type='Selecione' options={turmas} onTurmaChange={handleDropChange} />*/}
                    </div>
                    {userType === 1 && <ButtonBold title='Novo aluno' icon={<FaCirclePlus size={20}/>} action={clickBtn}/>}
                </div>
                <div className='divInfos'>
                    <div className='divHeader'>
                        {header.map((h, index) => (
                            <div key={index} className='title'>
                                <span className='bold'>{h.title}</span>
                            </div>
                        ))}
                    </div>
                    {filtered.map((a) => {
                        const turma = turmas.find(t => t.id === a.turma)
                        return(
                            <div key={a.id} className='divAlunos'>
                                <span className='spanBox'>{a.name}</span>
                                <span className='spanBox'>{a.email}</span>
                                <span className='spanBox'><span className={`text ${a.disable ? 'inativo' : a.isActive ? 'ativo' : 'pendente'}`}><GoDotFill size={40}/>{a.disable ? 'Inativo' : a.isActive ? 'Ativo' : 'Pendente'}</span></span>
                                <span className='spanBox'><span className={`${a.media < 50 ? 'ruim' : a.media >= 50 ? 'boa' : ''}`}>{a.media ? a.media : 'N'}</span> / {a.media ? '100' : 'A'}</span>
                                <span className='spanBox'>{turma ? turma.name : 'N / A'}</span>
                                {userType === 1 && 
                                <div className='btnEditUser' onClick={() => openEditModal(a.id)}>
                                    <BsThreeDotsVertical />
                                </div>
                                }
                                
                                {activeModalId === a.id && 
                                    <div className='modalEditUser'>
                                        {a.disable ? <p className='text' onClick={() => openConfirmModal(a.id, 'active')}>Reativar Usuário</p> : <p className='alert' onClick={() => openConfirmModal(a.id, 'disable')}>Desativar Usuário</p>}
                                    </div>
                                }
                                {confirmId === a.id && (
                                    <div className='containerModalConfirmDelete'>
                                        <div className='modalConfirmDelete'>
                                            <p className='titleAlert'>Tem certeza que deseja {actionType === 'active' ? 'reativar' : 'desativar'} esse usuário?</p>
                                            <div className='divBtns'>
                                                <button onClick={() => actionType === 'active' ? handleReactivate(a.id) : handleDisable(a.id)} className='delete'>
                                                    Confirmar
                                                </button>
                                                <button onClick={closeConfirmModal} className='close'>Cancelar</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

Alunos.propTypes = {
    userType: PropTypes.number.isRequired,
};

export default Alunos