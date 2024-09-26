import DropDown from '../../DropDown/DropDown'
import InputText from '../../InputText/InputText'
import './Alunos.css'
import ButtonBold from '../../ButtonBold/ButtonBold'
import { FaCirclePlus } from "react-icons/fa6";
import { alunos, turmas } from '../../../database'
import { GoDotFill } from "react-icons/go";
import { useState } from 'react';
import ModalCreateAluno from '../../ModalCreateAluno/ModalCreateAluno';

function Alunos() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDrop, setSearchDrop] = useState('Selecione')
    const [showModal, setShowModal] = useState(false)
    const header = [
        {
            id: 1,
            title: 'Nome'
        },
        {
            id: 2,
            title: 'E-mail'
        },
        {
            id: 3,
            title: 'Status'
        },
        {
            id: 4,
            title: 'Média'
        },
        {
            id: 5,
            title: 'Turma'
        },
    ]

    const removeAccents = (text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const handleSearchChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);
    };

    const handleDropChange = (newDrop) => {
        setSearchDrop(newDrop);
    };

    const clickBtn = (openModal) => {
        setShowModal(openModal)
    }

    const closeBtn = (close) => {
        setShowModal(close)
    }

    const filtered = alunos.filter(a => {
        const lowerCaseSearchTerm = removeAccents(searchTerm).toLowerCase();
        const matchesSearchTerm = removeAccents(a.name).toLowerCase().includes(lowerCaseSearchTerm);
        const matchesTurma = searchDrop === 'Selecione' || turmas.find(t => t.id === a.turma)?.name === searchDrop;
        
        return matchesSearchTerm && matchesTurma;
    });
    
    return(
        <div className='containerAlunos'>
            {showModal && <ModalCreateAluno title='Novo Aluno' close={closeBtn}/> }
            <h1>Alunos</h1>
            <div className='divContent'>
                <div className='header'>
                    <div className='divInputs'>
                        <InputText title='Pesquisa na lista' placeH='Nome do aluno' onSearchChange={handleSearchChange}/>
                        <DropDown title='Turma(s)' type='Selecione' options={turmas} onTurmaChange={handleDropChange} />
                    </div>
                    <ButtonBold title='Novo aluno' icon={<FaCirclePlus size={20}/>} action={clickBtn}/>
                </div>
                <div className='divInfos'>
                    <div className='divHeader'>
                        {header.map((h) => (
                            <div key={h.id} className='title'>
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
                                <span className='spanBox'><span className={`text ${a.status === 'active' ? 'ativo' : 'pendente'}`}><GoDotFill size={40}/>{a.status === 'active' ? 'Ativo' : 'Pendente'}</span></span>
                                <span className='spanBox'><span className={`bold ${a.media < 60 ? 'ruim' : 'boa'}`}>{a.media}</span> / 100</span>
                                <span className='spanBox'>{turma ? turma.name : 'N/A'}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Alunos