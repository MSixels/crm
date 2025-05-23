import { FaCirclePlus } from 'react-icons/fa6'
import ButtonBold from '../../ButtonBold/ButtonBold'
import InputText from '../../InputText/InputText'
import './Modulos.css'
import { useEffect, useState } from 'react'
import ModalCreateModulo from '../../ModalCreateModulo/ModalCreateModulo'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../../../services/firebaseConfig'
import Loading from '../../Loading/Loading'
import PropTypes from 'prop-types'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import ModalDeleteItem from '../../ModalDeleteItem/ModalDeleteItem'
import { MdEdit } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import { deleteModulo } from '../../../functions/functions'

function Modulos({ userType }) {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [modulos, setModulos] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [alunos, setAlunos] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeModalId, setActiveModalId] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [moduloDelete, setModuloDelete] = useState('')
    const [searchTerm, setSearchTerm] = useState('');

    const clickBtn = (openModal) => {
        setShowModal(openModal)
    }

    const closeBtn = (close) => {
        setShowModal(close)
    }
    const header = [
        { title: 'Nome' },
        { title: 'Alunos' },
        { title: 'Professor' },
        { title: 'Data liberação' },
    ]

    const fetchModulos = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'modulos'));
            const modulosList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setModulos(modulosList);
        } catch (error) {
            //console.error("Erro ao carregar os módulos:", error);
        }
    };

    const fetchProfessores = async (modulos) => {
        try {
            const professorIds = Array.from(new Set(modulos.map(modulo => modulo.professorId)));

            if (professorIds.length === 0) {
                setProfessores([]); 
                return;
            }

            const q = query(
                collection(firestore, 'users'),
                where('userId', 'in', professorIds) 
            );

            const querySnapshot = await getDocs(q);

            const professoresList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setProfessores(professoresList); 
        } catch (error) {
            //console.error("Erro ao carregar os professores:", error);
        }
    };

    const fetchUsersType3 = async () => {
        try {
            const q = query(
                collection(firestore, 'users'),
                where('type', '==', 3)
            );
    
            const querySnapshot = await getDocs(q);
    
            const usersType3List = querySnapshot.docs.map(doc => ({
                id: doc.id,
                type: doc.data().type
            }));

            setAlunos(usersType3List);
        } catch (error) {
            //console.error("Erro ao carregar os usuários do tipo 3:", error);
        }
    };

    useEffect(() => {
        fetchModulos()
    }, [])

    useEffect(() => {
        try{
            if(modulos){
                fetchProfessores(modulos)
                fetchUsersType3()
            }
        } catch(error){
            //console.log(error)
        }
        
    }, [modulos])

    const updateElemnts = async () => {
        try {
            await fetchModulos();     
            if (modulos && modulos.length > 0) {
                await fetchProfessores(modulos);
                await fetchUsersType3();
            }
        } catch (error) {
            //console.log('Error no update', error);
        }
    };

    useEffect(() => {
        if(modulos.length > 0 && professores.length > 0 && alunos.length > 0){
            setLoading(false)
        }
    }, [modulos, professores, alunos])

    if(loading){
        return <Loading />
    }
   
    const formatDate = (date) => {
        const d = new Date(date); 
        const day = d.getDate().toString().padStart(2, '0'); 
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); 
        const year = d.getFullYear(); 
        
        return `${day}/${month}/${year}`;
    }

    const checkDates = (liberacao, validade) => {
        const currentDate = new Date();
        const liberacaoDate = new Date(liberacao);
        const validadeDate = new Date(validade);
      
        if (liberacaoDate > currentDate && validadeDate > currentDate) {
          return { liberacaoClass: 'block', validadeClass: 'block' };
        }
      
        if (liberacaoDate <= currentDate && validadeDate >= currentDate) {
          return { liberacaoClass: 'active', validadeClass: 'active' };
        }
      
        if (validadeDate < currentDate) {
          return { liberacaoClass: 'end', validadeClass: 'end' };
        }
      
        return { liberacaoClass: 'block', validadeClass: 'block' };
    };

    const openEditModal = (id) => {
        setActiveModalId(previd => previd === id ? null : id);
    }

    const itemDelete = (id) => {
        setModuloDelete(id)
        setShowDeleteModal(true)
    }

    const handleDeleteModulo = () => {
        deleteModulo(moduloDelete)
        setShowDeleteModal(false);
        fetchModulos();
    }

    const cancelarDelete = () => {
        setShowDeleteModal(false)
        setModuloDelete('')
    }  

    const sortedModulos = modulos
    .filter(m => m.liberacao) 
    .sort((a, b) => new Date(a.liberacao) - new Date(b.liberacao)); 

    const filtered = sortedModulos.filter(m => 
        m.name.toLowerCase().replace(/\s/g, '').includes(searchTerm.toLowerCase().replace(/\s/g, ''))
    );

    const handleSearchChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);
    };

    return(
        <div className='containerModulos'>
            {showModal && <ModalCreateModulo title='Novo Módulo' close={closeBtn} updateDocs={updateElemnts}/> }
            {showDeleteModal && <ModalDeleteItem confirm={handleDeleteModulo} cancel={cancelarDelete} text='Tem certeza que deseja excluir esse módulo?'/>}
            <h1>Módulos</h1>
            <div className='divContent'>
                <div className='header'>
                    <div className='divInputs'>
                        <InputText title='Pesquisa pora' placeH='Nome do módulo' onSearchChange={handleSearchChange}/>
                    </div>
                    <ButtonBold title='Novo módulo' icon={<FaCirclePlus size={20}/>} action={clickBtn}/>
                </div>
                <div className='divInfos'>
                    <div className='divHeader'>
                        {header.map((h, index) => (
                            <div key={index} className='title'>
                                <span className='bold'>{h.title}</span>
                            </div>
                        ))}
                    </div>
                    <div>
                        {filtered.map((m) => {
                            if(professores.length > 0){
                                const professor = professores.find(p => p.id === m.professorId);
                                const professorName = professor ? professor.name : ''; 
                                const countAlunos = alunos.length
                                return (
                                    <div key={m.id} className='divValuesPai'>
                                        <div className='divValues' onClick={() => navigate(`/professor/modulos/${m.id}/conteudo`)}>
                                            <p className='spanBox'>{m.name}</p>
                                            <p className='spanBox'>{countAlunos}</p>
                                            <p className='spanBox'>{professorName}</p>
                                            <p className={`spanBox ${m.liberacao ? checkDates(m.liberacao, m.validade).liberacaoClass : 'active'}`}>
                                                {m.liberacao ? formatDate(m.liberacao) : 'N / A'}
                                            </p>
                                        </div>
                                        {userType === 1 && 
                                            <div className='btnEdit' onClick={() => openEditModal(m.id)}>
                                                <BsThreeDotsVertical />
                                            </div>
                                        }
                                        {activeModalId === m.id && 
                                            <div className='modalEditUser'>
                                                <div className='text' style={{display: 'flex', alignItems: 'center'}}>
                                                    <div className='divIcon'>
                                                        <MdEdit size={8}/>
                                                    </div>
                                                    <p onClick={() => navigate(`/professor/modulos/${m.id}/configuracoes`)}>Editar módulo</p>
                                                </div>
                                                <div className='text alert' style={{display: 'flex', alignItems: 'center'}}>
                                                    <div className='divIcon alert'>
                                                        <FaXmark size={8}/>
                                                    </div>
                                                    <p onClick={() => itemDelete(m.id)}>Excluir módulo</p>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
                
            </div>
        </div>
    )
}
Modulos.propTypes = {
    userType: PropTypes.number.isRequired,
};

export default Modulos