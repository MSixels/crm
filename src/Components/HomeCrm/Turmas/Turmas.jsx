import { useState } from 'react';
import { FaCirclePlus, FaArrowLeft, FaTrash } from 'react-icons/fa6';
import ButtonBold from '../../ButtonBold/ButtonBold';
import InputText from '../../InputText/InputText';
import './Turmas.css';

function Turmas() {
    const [novaTurma, setNovaTurma] = useState(false);
    const [activeTab, setActiveTab] = useState('config');


    const header = [
        { id: 1, title: 'Nome' },
        { id: 2, title: 'Alunos' },
        { id: 3, title: 'Início' },
        { id: 4, title: 'Fim' },
    ];

    return (
        <div className='containerTurmas'>
            {!novaTurma ? (
                <>
                    <h1>Turmas</h1>
                    <div className='divContent'>
                        <div className='header'>
                            <div className='divInputs'>
                                <InputText title='Pesquisar na lista' placeH='Nome da turma'/>
                            </div>
                            <ButtonBold 
                            title='Nova turma' 
                            icon={<FaCirclePlus size={20}/>} 
                            action={() => setNovaTurma(true)} 
                            />
                        </div>
                        <div className='divInfos'>
                            <div className='divHeader'>
                                {header.map((h) => (
                                    <div key={h.id} className='title'>
                                        <span className='bold'>{h.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
    <div className="novaTurmaHeader">
        <ButtonBold 
            title="Voltar" 
            icon={<FaArrowLeft size={20} />} 
            action={() => setNovaTurma(false)} 
        />
        <h1>Nova Turma</h1>
    </div>

    <div className="tabs">
        <span 
            className={activeTab === 'alunos' ? 'active' : ''} 
            onClick={() => setActiveTab('alunos')}
        >
            Alunos
        </span>
        <span 
            className={activeTab === 'config' ? 'active' : ''} 
            onClick={() => setActiveTab('config')}
        >
            Configuração
        </span>
    </div>

    <div className="tabContent">
        {activeTab === 'alunos' ? (
            <div className="alunosSection">
                <h2>Alunos vinculados à turma</h2>

                <div className="alunosActions">
                    <input 
                        type="text" 
                        placeholder="Buscar aluno pelo nome..." 
                        className="inputSearch"
                    />

                    <div className="buttons">
                        <button className="btnDelete">
                            <FaTrash size={18} />
                        </button>
                        <button className="btnAdd">
                            Vincular Aluno
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <p>Config nova turma...</p>
        )}
    </div>
</>

            )}
        </div>
    );
}

export default Turmas;
