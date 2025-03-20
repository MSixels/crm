import { useState } from 'react';
import { useEffect } from 'react';
import { db } from '../../../services/firebaseConfig';
import { collection, getDocs, addDoc, writeBatch } from 'firebase/firestore';
import {  FaCircleChevronLeft, FaTrash, FaUser, FaGear, FaCirclePlus, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import ButtonBold from '../../ButtonBold/ButtonBold';
import InputText from '../../InputText/InputText';
import './Turmas.css';

function Turmas() {
    const [novaTurma, setNovaTurma] = useState(false);
    const [activeTab, setActiveTab] = useState('config');
    const [turmas, setTurmas] = useState([]);
    const [editandoTurma, setEditandoTurma] = useState(false);
    const [turmaSelecionada, setTurmaSelecionada] = useState(null);
    const [alunos, setAlunos] = useState([
        { id: 1, nome: "João Silva", email: "joao@email.com", media: 80 },
        { id: 2, nome: "Maria Souza", email: "maria@email.com", media: 90 },
        { id: 3, nome: "Carlos Lima", email: "carlos@email.com", media: 75 },
    ]);
    const [turma, setTurma] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        active: false,
        modulos: [],
    });
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (value) => {
    setSearchTerm(value);
    console.log("Pesquisa:", value);
};

const buscarTurmas = async () => {
    try {
        const turmasRef = collection(db, 'turmas');
        const snapshot = await getDocs(turmasRef);
        
        if (snapshot.empty) {
            console.log("Nenhuma turma encontrada na coleção 'turmas'.");
        } else {
            console.log("Dados encontrados:", snapshot.docs.map(doc => doc.data()));
        }

        const listaTurmas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTurmas(listaTurmas);
    } catch (error) {
        console.error('Erro ao buscar turmas:', error);
    }
};
useEffect(() => {
    buscarTurmas();
}, []);


const salvarTurma = async () => {
    console.log("Estado atual da turma:", turma);

    if (!turma.name || !turma.description || !turma.startDate || !turma.endDate) {
        alert('Todos os campos são obrigatórios!');
        return;
    }

    try {
        
        const turmasRef = collection(db, 'turmas');
        const turmasSnapshot = await getDocs(turmasRef);
        const batch = writeBatch(db);

        turmasSnapshot.forEach((doc) => {
            batch.update(doc.ref, { active: false });
        });

        await batch.commit();
        
        const docRef = await addDoc(turmasRef, {
            name: turma.name,
            description: turma.description,
            startDate: turma.startDate,
            endDate: turma.endDate,
            active: turma.active,
            modulos: turma.modulos,
            alunosCount: alunos.length, 
        });

        alert('Turma criada com sucesso!');
        setNovaTurma(false);
        buscarTurmas();
    } catch (error) {
        console.error('Erro ao salvar turma:', error);
        alert('Erro ao criar turma.');
    }
};

const buscarTurmaAtiva = async () => {
    try {
        const turmasRef = collection(db, 'turmas');
        const snapshot = await getDocs(turmasRef);
        const turmaAtiva = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .find(turma => turma.active);

        return turmaAtiva || null;
    } catch (error) {
        console.error('Erro ao buscar turma ativa:', error);
        return null;
    }
};

const cadastrarAluno = async (nome, email, media) => {
    try {
        const turmaAtiva = await buscarTurmaAtiva();
        
        if (!turmaAtiva) {
            alert("Nenhuma turma ativa encontrada.");
            return;
        }

        const alunosRef = collection(db, 'alunos');
        const alunoDoc = await addDoc(alunosRef, {
            nome,
            email,
            media,
            turmaID: turmaAtiva.id
        });

        const turmaAlunosRef = collection(db, `turmas/${turmaAtiva.id}/alunos`);
        await addDoc(turmaAlunosRef, {
            nome,
            email,
            media,
            alunoID: alunoDoc.id
        });

        const turmaRef = doc(db, 'turmas', turmaAtiva.id);
        await updateDoc(turmaRef, {
            alunosCount: turmaAtiva.alunosCount + 1
        });

        alert("Aluno cadastrado com sucesso!");
    } catch (error) {
        console.error("Erro ao cadastrar aluno:", error);
        alert("Erro ao cadastrar aluno.");
    }
};

const buscarAlunosDaTurma = async (turmaID) => {
    try {
        const alunosRef = collection(db, `turmas/${turmaID}/alunos`);
        const snapshot = await getDocs(alunosRef);

        const listaAlunos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        setAlunos(listaAlunos);

        
        setTurma(prevTurma => ({
            ...prevTurma,
            alunosCount: listaAlunos.length
        }));
    } catch (error) {
        console.error("Erro ao buscar alunos da turma:", error);
    }
};


const salvarAlteracoes = async () => {
    console.log("Estado atual da turma:", turma);

    if (!turma.name || !turma.description || !turma.startDate || !turma.endDate) {
        alert('Todos os campos são obrigatórios!');
        return;
    }

    try {
        if (editandoTurma && turmaSelecionada) {
            
            const turmaRef = doc(db, 'turmas', turmaSelecionada.id);
            await updateDoc(turmaRef, {
                name: turma.name,
                description: turma.description,
                startDate: turma.startDate,
                endDate: turma.endDate,
                active: turma.active,
                modulos: turma.modulos,
            });

            alert('Turma atualizada com sucesso!');
        } else {
            
            const turmasRef = collection(db, 'turmas');
            const turmasSnapshot = await getDocs(turmasRef);
            const batch = writeBatch(db);

            
            turmasSnapshot.forEach((doc) => {
                batch.update(doc.ref, { active: false });
            });

            await batch.commit();

            const docRef = await addDoc(turmasRef, {
                name: turma.name,
                description: turma.description,
                startDate: turma.startDate,
                endDate: turma.endDate,
                active: turma.active,
                modulos: turma.modulos,
                alunosCount: 0, 
            });

            alert('Turma criada com sucesso!');
        }

        setNovaTurma(false);
        buscarTurmas(); 
    } catch (error) {
        console.error('Erro ao salvar turma:', error);
        alert('Erro ao salvar turma.');
    }
};



useEffect(() => {
    if (editandoTurma && turmaSelecionada) {
        setTurma({
            name: turmaSelecionada.name,
            description: turmaSelecionada.description,
            startDate: turmaSelecionada.startDate,
            endDate: turmaSelecionada.endDate,
            active: turmaSelecionada.active,
            modulos: turmaSelecionada.modulos || [],
            alunosCount: turmaSelecionada.alunosCount || 0, 
        });

        buscarAlunosDaTurma(turmaSelecionada.id);
    }
}, [turmaSelecionada, editandoTurma]);


    return (
        <div className='containerTurmas'>
            {!novaTurma ? (
                <>
                    <h1>Turmas</h1>
                    <div className='divContent'>
                        <div className='header'>
                            <div className='divInputs'>
                            <InputText 
                            title='Pesquisar na lista' 
                            placeH='Nome da turma' 
                            onSearchChange={handleSearchChange} 
                        />
                            </div>
                            
                            <ButtonBold 
                            title='Nova turma' 
                            icon={<FaCirclePlus size={20}/>} 
                            action={() => {
                                setEditandoTurma(false); // Não estamos editando, e sim criando
                                setTurma({
                                    name: '',
                                    description: '',
                                    startDate: '',
                                    endDate: '',
                                    active: false,
                                    modulos: [],
                                });
                                setTurmaSelecionada(null);
                                setNovaTurma(true); // Abre o formulário
                            }} 
                        />

                        </div>
                        <div className='divInfos'>
    <div className='divHeader'>
        <span className='spanHeader'>Nome</span>
        <span className='spanHeader'>Alunos</span>
        <span className='spanHeader'>Inicio</span>
        <span className='spanHeader'>Fim</span>
        <span></span>
    </div>
    {turmas.length > 0 ? (
    turmas.map((turma) => (
        <div key={turma.id} className={` divHeader turmaItem ${turma.active ? 'ativa' : ''}` }>
            <span>{turma.name}</span>
            <span>{turma.alunosCount}</span>
            <span>{turma.startDate}</span>
            <span>{turma.endDate}</span>
            
            <button 
    className='configBtnTurma' 
    onClick={() => {
        setTurmaSelecionada(turma);
        setEditandoTurma(true); 
        setNovaTurma(true); 
    }}
            >
                <FaArrowUpRightFromSquare/>
            </button> 
        </div>
    ))
) : (
    <p>Nenhuma turma cadastrada.</p>
)}

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
            {'     '}
            Alunos
        </span>
        <span 
            className={activeTab === 'config' ? 'active' : ''} 
            onClick={() => setActiveTab('config')}
        >
            <FaGear size={14} />
            {'     '}
            Configuração
        </span>
    </div>

    <div className="tabContent">
        {activeTab === 'alunos' ? (
            <div className="alunosTab">
            <h2>Alunos vinculados à turma</h2>
                <div className="alunosSection">
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
                    <button className="btnDelete">
                        <FaTrash size={18} />
                    </button>
                </div>
        
                {alunos.map((aluno) => (
                    <div key={aluno.id} className="alunoItem">
                        <input type="checkbox" />
                        <span>{aluno.nome}</span>
                        <span>{aluno.email}</span>
                        <span>{aluno.media}</span>
                        <button className="btnDelete">
                        <FaTrash size={18} />
                    </button>
                        </div>
                ))}
            </div>
        </div>
            </div>
        
        ) : (
            <div className="configSection">
                <div className="configHeader">
                <h2>Configurações</h2>
                <ButtonBold title='Salvar alterações' action={salvarAlteracoes} />


                </div>
                <div className="InfosClass">
                    <span className='titlesConfigs'>Informações</span>
                    <InputText 
    title='Nome da turma' 
    placeH='Turma XXX' 
    value={turma.name}
    onChange={(e) => setTurma(prevState => ({ ...prevState, name: e.target.value }))}
    onSearchChange={() => {}} 
/>
<InputText 
    title='Descrição' 
    placeH='Descrição da turma' 
    value={turma.description}
    onChange={(e) => setTurma(prevState => ({ ...prevState, description: e.target.value }))}
    onSearchChange={() => {}} 
/>
                    <span className='titlesConfigs'>Módulos vinculados</span>
                    <ul className='modulosList'>
                        <li>Módulo XXX</li>
                        <li>Módulo YYY</li>
                        <li>Módulo ZZZ</li>
                    </ul>
                    <span className='titlesConfigs'>Validade da Turma</span>
                    <div className="ativaTurma">
                    <label className="switch">
                    <input 
                        type="checkbox" 
                        checked={turma.active} 
                        onChange={() => setTurma({ ...turma, active: !turma.active })}
                    />
                    <span className="slider round"></span>
                </label>
                <span>{turma.active ? 'Turma Ativa' : 'Turma Inativa'}</span>
                    </div>
                    <div className='StartAndEnd'>
                    <InputText 
    title='Início' 
    placeH='XX/XX/XXXX' 
    value={turma.startDate}
    onChange={(e) => setTurma(prevState => ({ ...prevState, startDate: e.target.value }))}
    onSearchChange={() => {}} 
/>

<InputText 
    title='Fim' 
    placeH='XX/XX/XXXX' 
    value={turma.endDate}
    onChange={(e) => setTurma(prevState => ({ ...prevState, endDate: e.target.value }))}
    onSearchChange={() => {}} 
/>
                    </div>
                </div>
            <div className="buttonStart--">
            <ButtonBold title='Salvar alterações' action={salvarAlteracoes} />


            </div>
            </div>
        )}
    </div>
</>
            )}
        </div>
    );
}

export default Turmas;
