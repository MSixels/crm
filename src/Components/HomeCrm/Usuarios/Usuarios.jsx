import { useEffect, useState } from 'react'
import './Usuarios.css'
import ModalCreateUser from '../../ModalCreateUser/ModalCreateUser'
import ButtonBold from '../../ButtonBold/ButtonBold'
import { FaCirclePlus } from 'react-icons/fa6'
import InputText from '../../InputText/InputText'
import DropDown from '../../DropDown/DropDown'
import { GoDotFill } from 'react-icons/go'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../../../services/firebaseConfig'
import Loading from '../../Loading/Loading'

function Usuarios() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDrop, setSearchDrop] = useState('Selecione')
    const [showModal, setShowModal] = useState(false)
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const header = [
        { title: 'Nome' },
        { title: 'E-mail' },
        { title: 'Status' },
        { title: 'Cargo' },
    ]
    const removeAccents = (text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const handleSearchChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);
    };

    const handleDropChange = (option) => {
        if (option.id) {
            setSearchDrop(option.id); 
        } else {
            setSearchDrop('Selecione');
        }
    };

    const clickBtn = (openModal) => {
        setShowModal(openModal)
    }
    const closeBtn = (close) => {
        setShowModal(close)
    }

    const fetchUsersFromFirestore = async () => {
        try {
            const q = query(collection(firestore, 'users'), where('type', 'in', [1, 2])); 
            const querySnapshot = await getDocs(q);
            const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            setLoading(false);
        }
    };

    const dropDownOptions = [
        { id: 1, name: 'Adm' },
        { id: 2, name: 'Professor' },
    ];

    useEffect(() => {
        fetchUsersFromFirestore(); 
    }, []);

    const filtered = users.filter(a => {
        const lowerCaseSearchTerm = removeAccents(searchTerm).toLowerCase();
        const matchesSearchTerm = removeAccents(a.name).toLowerCase().includes(lowerCaseSearchTerm);
        const matchesTurma = searchDrop === 'Selecione' || a.type === parseInt(searchDrop);
    
        return matchesSearchTerm && matchesTurma;
    }).sort((a, b) => {
        return removeAccents(a.name).localeCompare(removeAccents(b.name), 'pt', { sensitivity: 'base' });
    });

    if (loading) {
        return <Loading />; 
    }

    return (
        <div className='containerUsuarios'>
            {showModal && <ModalCreateUser title='Novo Usuário' close={closeBtn}/> }
            <h1>Usuários</h1>
            <div className='divContent'>
                <div className='header'>
                    <div className='divInputs'>
                        <InputText title='Pesquisa na lista' placeH='Nome do usuário' onSearchChange={handleSearchChange}/>
                        <DropDown title='Cargo' type='Selecione' options={dropDownOptions} onTurmaChange={handleDropChange} />
                    </div>
                    <ButtonBold title='Novo usuário' icon={<FaCirclePlus size={20}/>} action={clickBtn}/>
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
                        return (
                            <div key={a.id} className='divAlunos'>
                                <span className='spanBox'>{a.name}</span>
                                <span className='spanBox'>{a.email}</span>
                                <span className='spanBox'>
                                    <span className={`text ${a.isActive ? 'ativo' : 'pendente'}`}>
                                        <GoDotFill size={40} />
                                        {a.isActive ? 'Ativo' : 'Pendente'}
                                    </span>
                                </span>
                                <span className={`textAdm ${a.type === 1 ? 'adm' : 'prof'}`}>{a.type === 1 ? 'Adm' : 'Professor'}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Usuarios