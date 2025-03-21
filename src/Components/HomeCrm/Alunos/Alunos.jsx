import InputText from '../../InputText/InputText'
import './Alunos.css'
import ButtonBold from '../../ButtonBold/ButtonBold'
import { FaCirclePlus } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { useEffect, useState } from 'react';
import ModalCreateAluno from '../../ModalCreateAluno/ModalCreateAluno';
import { firestore } from '../../../services/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Loading from '../../Loading/Loading';
import PropTypes from 'prop-types'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { disableUserInFirestore, reactivateUserInFirestore, deleteUserFromFireBaseAuth } from '../../../functions/functions';
import DropDown from '../../DropDown/DropDown'
import Pagination from '../../Pagination/Pagination';
import { useToast } from '../../../Contexts/ToastContext'

function Alunos({ userType }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDrop, setSearchDrop] = useState('Selecione');
    const [showModal, setShowModal] = useState(false)
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModalId, setActiveModalId] = useState(null)
    const [confirmId, setConfirmId] = useState(null)
    const [actionType, setActionType] = useState('')
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [usersScore, setUsersScore] = useState([])
    const header = [
        { title: 'Nome' },
        { title: 'CPF' },
        { title: 'E-mail' },
        { title: 'Status' },
        { title: 'Média' },
    ]
    //const componentRef = useRef();
    //const showPdf = true
    const { showToast } = useToast();

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
            //console.log('progressProvasList: ', progressProvasList);
            setUsersScore(progressProvasList);
        } catch (error) {
            //console.error("Erro ao carregar progressProvas:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const clickBtn = (openModal) => {
        setShowModal(openModal)
    }

    const closeBtn = (close, name, email, success) => {
        const toastInfos = {
            title: 'Aluno cadastrado',
            infos: [email, name],
            footer: 'Veja mais detalhes na listagem.',
            type: 'success'
        }

        if(!success) {
            toastInfos.title = 'Erro ao cadastrar aluno';
            toastInfos.infos = [email, name];
            toastInfos.footer = "Tente novamente mais tarde ou acione o suporte."
            toastInfos.type = 'error'
        }

        showToast(toastInfos.title, toastInfos.infos, toastInfos.footer, toastInfos.type)
        setShowModal(close)
        fetchAlunosFromFirestore()
    }


    const fetchAlunosFromFirestore = async () => {
        try {
            const q = query(collection(firestore, 'users'), where('type', '==', 3)); // Buscar usuários com type 3
            const querySnapshot = await getDocs(q);
            const alunosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapear os dados
            setAlunos(alunosList);
            //console.log(alunosList)
            setLoading(false);
        } catch (error) {
            //console.error("Erro ao buscar alunos:", error);
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

        if (searchDrop === null || searchDrop === 'Selecione') {
            return matchesSearchTerm; 
        }
        
        if (searchDrop === 1 && (!a.isActive || a.disable)) return false; 
        if (searchDrop === 2 && (a.isActive || a.disable)) return false;  
        if (searchDrop === 3 && !a.disable) return false;                 

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
    const handleDisable = async (id) => {
        try {
            //console.log('Iniciando desativação do usuário com ID:', id);
            
            await disableUserInFirestore(id); 
            //console.log('Usuário desativado do Firestore com sucesso');
            
            await fetchAlunosFromFirestore(); 
            setActiveModalId(null);
            setConfirmId(null);
        } catch (error) {
            //console.error('Erro ao desativar o usuário:', error);
            alert('Erro ao desativar o usuário.');
        }
    };

    const handleReactivate = async (id) => {
        try {
            //console.log('Iniciando reativação do usuário com ID:', id);
            
            await reactivateUserInFirestore(id); 
            //console.log('Usuário reativado do Firestore com sucesso');
            
            await fetchAlunosFromFirestore(); 
            setActiveModalId(null);
            setConfirmId(null);
        } catch (error) {
            //console.error('Erro ao reativar o usuário:', error);
            alert('Erro ao reativar o usuário.');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
          await deleteUserFromFireBaseAuth(id, fetchAlunosFromFirestore);
          
        } catch (error) {
          //console.error("Erro ao deletar o usuário:", error);
        }
    };

    const stausType = [
        {id: 1, name: 'Ativo'},
        {id: 2, name: 'Pendente'},
        {id: 3, name: 'Inativo'},
    ]

    const handleDropChange = (option) => {
        if (option.id) {
            setSearchDrop(option.id);
        } else {
            setSearchDrop('Selecione');
        }
    };
    /*
    const baixarPDF = (confirm) => {
        if (confirm) {
            const element = componentRef.current;

            const opt = {
                margin: 0.15,
                filename: 'relatorio_alunos.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().from(element).set(opt).save();
        }
    };
    */

    if (loading) {
        return <Loading />
    }

    /*
    if(showPdf){
        return (
            <div>
                <div ref={componentRef}>
                   
                    <h1>Relatório do alunos - total({filtered.length})</h1>
                    <div style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
                        <div style={{ width: '400' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: 12 }}>
                                <p style={{ fontWeight: 'bold' }}>Email</p>
                                <p style={{ fontWeight: 'bold' }}>Média</p>
                            </div>
                        </div>
                        <div>
                            {filtered.map((aluno, index) => (
                                <div key={index} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: 8, borderBottom: 'solid 1px #ccc', pageBreakInside: 'avoid' }}>
                                    <p>{aluno.email || "N/A"}</p>
                                    <p>{aluno.averageScore || 0}/100</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={() => baixarPDF(true)}>Baixar PDF</button>
            </div>
        );
    }
    */
    
    return(
        <div className='containerAlunos'>
            {showModal && <ModalCreateAluno title='Novo Aluno' close={closeBtn}/> }
            <h1>Alunos</h1>
            <div className='divContent'>
                <div className='header'>
                    <div className='divInputs'>
                        <InputText title='Pesquisa na lista' placeH='Nome ou email' onSearchChange={handleSearchChange}/>
                        <div style={{marginTop: 10}}>
                            <DropDown title='Turma(s)' type='Selecione' options={stausType} onTurmaChange={handleDropChange}/>
                        </div>
                        
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
                            return(
                                <div key={a.id} className='divAlunos'>
                                    <span className='spanBox'>{a.name ? a.name : 'Sem nome'}</span>
                                    <span className='spanBox'>{a.cpf ? a.cpf : 'N/A'}</span>
                                    <span className='spanBox'>{a.email}</span>
                                    <span className='spanBox'><span className={`text ${a.disable ? 'inativo' : a.isActive ? 'ativo' : 'pendente'}`}><GoDotFill size={40}/>{a.disable ? 'Inativo' : a.isActive ? 'Ativo' : 'Pendente'}</span></span>
                                    <span className='spanBox'><span className={`${a.averageScore < 50 ? 'ruim' : a.averageScore >= 50 ? 'boa' : ''}`}>{a.averageScore ? a.averageScore : 'N'}</span> / {a.averageScore ? '100' : 'A'}</span>
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
                <Pagination
    currentPage={currentPage}
    setCurrentPage={setCurrentPage}
    itemsPerPage={itemsPerPage}
    setItemsPerPage={setItemsPerPage}
    totalItems={filtered.length}
/>

            </div>
        </div>
    )
}

Alunos.propTypes = {
    userType: PropTypes.number.isRequired,
};

export default Alunos