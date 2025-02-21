import { useState } from 'react';
import { FaCirclePlus, FaCircleChevronLeft, FaTrash, FaUser, FaGear } from 'react-icons/fa6';
import ButtonBold from '../../ButtonBold/ButtonBold';
import InputText from '../../InputText/InputText';
import './Turmas.css';

function Turmas() {
    const [novaTurma, setNovaTurma] = useState(false);
    const [activeTab, setActiveTab] = useState('config');
    const [alunos, setAlunos] = useState([
        { id: 1, nome: "João Silva", email: "joao@email.com", media: 8.5 },
        { id: 2, nome: "Maria Souza", email: "maria@email.com", media: 9.2 },
        { id: 3, nome: "Carlos Lima", email: "carlos@email.com", media: 7.8 },
    ]);


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
    <span className="voltarIcon" onClick={() => setNovaTurma(false)}>
        <FaCircleChevronLeft size={20} />
    </span>
    <h1>Nova Turma</h1>
</div>
    <div className="tabs">
        <span 
            className={activeTab === 'alunos' ? 'active' : ''} 
            onClick={() => setActiveTab('alunos')}
        >
            <FaUser size={14} />
            Alunos
        </span>
        <span 
            className={activeTab === 'config' ? 'active' : ''} 
            onClick={() => setActiveTab('config')}
        >
            <FaGear size={14} />
            Configuração
        </span>
    </div>

    <div className="tabContent">
        {activeTab === 'alunos' ? (
            <div className="alunosSection">
            <h2>Alunos vinculados à turma</h2>
        
            <div className="alunosActions">
                <InputText title="Pesquisar por Aluno" />
                <div className="buttons">
                    <button className="btnDelete">
                        <FaTrash size={18} />
                    </button>
                    <ButtonBold title='Vincular aluno +'/>
                </div>
            </div>
        
            
            <div className="alunosLista">
                <div className="alunosHeader">
                <input type="checkbox" />

                    <span>Nome</span>
                    <span>Email</span>
                    <span>Média de Notas</span>
                </div>
        
                {alunos.map((aluno) => (
                    <div key={aluno.id} className="alunoItem">
                        <input type="checkbox" />
                        <span>{aluno.nome}</span>
                        <span>{aluno.email}</span>
                        <span>{aluno.media}</span>
                    </div>
                ))}
            </div>
        </div>
        
        ) : (
            <div className="configSection">
                <h2>Configurações</h2>
                <ButtonBold title='Salvar alterações'/>
                <div className="InfosClass">
                    <span>Informações</span>
                    <InputText title='Nome da turma' placeH='Turma XXX'/>
                    <InputText title='Descrição' placeH='Descrição da turma'/>
                    <span>Módulos vinculados</span>
                    <ul>
                        <li>Módulo xxx</li>
                        <li>Módulo yyy</li>
                        <li>Módulo zzz</li>
                    </ul>
                    <span>Validade da Turma</span>
                    <span>Turma ativa</span>
                    <div className='StartAndEnd'>
                    <InputText title='Inicío' placeH='XX/XX/XXXX'/>
                    <InputText title='Fim' placeH='XX/XX/XXXX'/>
                    </div>
                </div>
                <ButtonBold title='Salvar alterações'/>
            </div>
        )}
    </div>
</>
            )}
        </div>
    );
}

export default Turmas;
