import DropDown from '../../DropDown/DropDown'
import InputText from '../../InputText/InputText'
import './Alunos.css'
import ButtonBold from '../../ButtonBold/ButtonBold'
import { FaCirclePlus } from "react-icons/fa6";
import { turmas } from '../../../database'
import { GoDotFill } from "react-icons/go";
import { useEffect, useState } from 'react';
import ModalCreateAluno from '../../ModalCreateAluno/ModalCreateAluno';
import { auth, firestore } from '../../../services/firebaseConfig';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Loading from '../../Loading/Loading';
import { onAuthStateChanged } from 'firebase/auth';
import PropTypes from 'prop-types'

function Alunos({ userType }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDrop, setSearchDrop] = useState('Selecione')
    const [showModal, setShowModal] = useState(false)
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
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
                                <span className='spanBox'><span className={`text ${a.isActive ? 'ativo' : 'pendente'}`}><GoDotFill size={40}/>{a.isActive ? 'Ativo' : 'Pendente'}</span></span>
                                <span className='spanBox'><span className={`${a.media < 50 ? 'ruim' : a.media >= 50 ? 'boa' : ''}`}>{a.media ? a.media : 'N'}</span> / {a.media ? '100' : 'A'}</span>
                                <span className='spanBox'>{turma ? turma.name : 'N / A'}</span>
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