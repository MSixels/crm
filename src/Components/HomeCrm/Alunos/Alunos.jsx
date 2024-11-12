import InputText from '../../InputText/InputText'
import './Alunos.css'
import ButtonBold from '../../ButtonBold/ButtonBold'
import { FaAngleDown, FaAngleUp, FaCirclePlus } from "react-icons/fa6";
import { turmas } from '../../../database'
import { GoDotFill } from "react-icons/go";
import { useEffect, useState } from 'react';
import ModalCreateAluno from '../../ModalCreateAluno/ModalCreateAluno';
import { firestore } from '../../../services/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Loading from '../../Loading/Loading';
import PropTypes from 'prop-types'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { disableUserInFirestore, reactivateUserInFirestore, deleteUserFromFireBaseAuth } from '../../../functions/functions';
import { MdArrowBackIosNew } from 'react-icons/md';
import { GrNext } from 'react-icons/gr';

function Alunos({ userType }) {
    const [searchTerm, setSearchTerm] = useState('');
    
    const [showModal, setShowModal] = useState(false)
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModalId, setActiveModalId] = useState(null)
    const [confirmId, setConfirmId] = useState(null)
    const [actionType, setActionType] = useState('')
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [showModalNumberPages, setShowModalNumberPages] = useState(false)
    const [usersScore, setUsersScore] = useState([])
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

    const fetchProgressProvas = async () => {
        try {
            const q = query(
                collection(firestore, 'progressProvas'),
                where('score', '!=', null)
            );
    
            const querySnapshot = await getDocs(q);
    
            const progressProvasList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                score: doc.data().score,
                userId: doc.data().userId
            }));
            console.log('progressProvasList: ', progressProvasList);
            setUsersScore(progressProvasList);
        } catch (error) {
            console.error("Erro ao carregar progressProvas:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const clickBtn = (openModal) => {
        setShowModal(openModal)
    }

    const closeBtn = (close) => {
        setShowModal(close)
        fetchAlunosFromFirestore()
    }

    const renderModalNumberLiner = () => {
        const options = [
            {value: 100},
            {value: 40},
            {value: 20},
            {value: 10},
            {value: 5},
        ]

        return(
            <div className='containerRenderModalNumberLiner'>
                {options.map((o, index) => (
                    <div key={index} className='option' onClick={() => setItemsPerPage(o.value)}>
                        {o.value}
                    </div>
                ))}
            </div>
        )
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
        fetchProgressProvas()
    }, [])

    const filtered = alunos
    .filter(a => {
        const lowerCaseSearchTerm = removeAccents(searchTerm).toLowerCase();
        const matchesSearchTerm = removeAccents(a.name).toLowerCase().includes(lowerCaseSearchTerm) ||
        (a.email && removeAccents(a.email).toLowerCase().includes(lowerCaseSearchTerm));
        

        return matchesSearchTerm;
    })
    .map(a => {
        const alunoScores = usersScore.filter(score => score.userId === a.id);
        const totalScore = alunoScores.reduce((acc, score) => acc + score.score, 0);
        const averageScore = alunoScores.length ? (totalScore / alunoScores.length).toFixed(0) : "0";

        return { ...a, averageScore: Number(averageScore) }; 
    })
    .sort((a, b) => {
        return removeAccents(a.name).localeCompare(removeAccents(b.name), 'pt', { sensitivity: 'base' });
    });

    const slicedAlunos = filtered.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

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

    const handleNextPage = () => {
        if ((currentPage + 1) * itemsPerPage < filtered.length) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
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

    const handleDeleteUser = async (id) => {
        try {
          await deleteUserFromFireBaseAuth(id);
        } catch (error) {
          console.error("Erro ao deletar o usuário:", error);
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
                        <InputText title='Pesquisa na lista' placeH='Nome ou email' onSearchChange={handleSearchChange}/>
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
                    <div className='divValues'>
                        {slicedAlunos.map((a) => {
                            const turma = turmas.find(t => t.id === a.turma)
                            return(
                                <div key={a.id} className='divAlunos'>
                                    <span className='spanBox'>{a.name ? a.name : 'Sem nome'}</span>
                                    <span className='spanBox'>{a.email}</span>
                                    <span className='spanBox'><span className={`text ${a.disable ? 'inativo' : a.isActive ? 'ativo' : 'pendente'}`}><GoDotFill size={40}/>{a.disable ? 'Inativo' : a.isActive ? 'Ativo' : 'Pendente'}</span></span>
                                    <span className='spanBox'><span className={`${a.averageScore < 50 ? 'ruim' : a.averageScore >= 50 ? 'boa' : ''}`}>{a.averageScore ? a.averageScore : 'N'}</span> / {a.averageScore ? '100' : 'A'}</span>
                                    <span className='spanBox'>{turma ? turma.name : 'N / A'}</span>
                                    {userType === 1 && 
                                    <div className='btnEditUser' onClick={() => openEditModal(a.id)}>
                                        <BsThreeDotsVertical />
                                    </div>
                                    }
                                    
                                    {activeModalId === a.id && 
                                        <div className='modalEditUser'>
                                            {a.disable ? <p className='text' onClick={() => openConfirmModal(a.id, 'active')}>Reativar Usuário</p> : <p className='alert' onClick={() => openConfirmModal(a.id, 'disable')}>Desativar Usuário</p>}
                                            {/*<p className='alert' onClick={() => handleDeleteUser(a.id)}>Excluir usuário</p>*/}
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
                <div className='legendas'>
                    <div className='divNumberLines'>
                        <p>Linhas por página <span className='bold'>{itemsPerPage}</span></p>
                        <div onClick={() => setShowModalNumberPages(!showModalNumberPages)} className='divIcon'>
                            {showModalNumberPages ? <FaAngleDown /> : <FaAngleUp />}
                            {showModalNumberPages && renderModalNumberLiner()}
                        </div>
                        
                    </div>
                    
                    <p className='bold'>{currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, filtered.length)} de {filtered.length}</p>
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
    )
}

Alunos.propTypes = {
    userType: PropTypes.number.isRequired,
};

export default Alunos