import { useState } from 'react';
import { useEffect } from 'react';
import { db } from '../../../services/firebaseConfig';
import { collection, getDocs, addDoc,doc, updateDoc, writeBatch, query, where } from 'firebase/firestore';
import {  FaCircleChevronLeft, FaTrash, FaUser, FaGear, FaCirclePlus, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import ButtonBold from '../../ButtonBold/ButtonBold';
import InputText from '../../InputText/InputText';
import Pagination from '../../Pagination/Pagination';
import './Turmas.css';

function Turmas() {
    const [novaTurma, setNovaTurma] = useState(false);
    const [activeTab, setActiveTab] = useState('config');
    const [turmas, setTurmas] = useState([]);
    const [editandoTurma, setEditandoTurma] = useState(false);
    const [turmaSelecionada, setTurmaSelecionada] = useState(null);
    const [alunos, setAlunos] = useState([]);
    const [selectedAlunos, setSelectedAlunos] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const paginatedAlunos = alunos.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
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

const handleSelectAll = () => {
    if (selectedAlunos.length === alunos.length) {
        setSelectedAlunos([]);
    } else {
        setSelectedAlunos(alunos.map(aluno => aluno.id));
    }
};

const handleSelectAluno = (id) => {
    setSelectedAlunos(prevSelected => 
        prevSelected.includes(id) 
            ? prevSelected.filter(alunoId => alunoId !== id)
            : [...prevSelected, id] 
    );
};

const buscarTurmas = async () => {
    try {
        const turmasRef = collection(db, 'turmas');
        const snapshot = await getDocs(turmasRef);

        const listaTurmas = await Promise.all(snapshot.docs.map(async (doc) => {
            const turmaData = doc.data();

            const q = query(collection(db, 'users'), where('turmaId', '==', doc.id), where('type', '==', 3));
            const alunosSnapshot = await getDocs(q);
            const totalAlunos = alunosSnapshot.size;

            return { id: doc.id, ...turmaData, alunosCount: totalAlunos };
        }));

        setTurmas(listaTurmas);
    } catch (error) {
        console.error('Erro ao buscar turmas:', error);
    }
};
useEffect(() => {
    buscarTurmas();
}, []);

const fetchMediasAlunos = async () => {
    try {
        const q = query(collection(firestore, 'turmas', turmaId, 'alunos')); 
        const querySnapshot = await getDocs(q);
        
        const alunosComMedias = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        setAlunos(alunosComMedias);
    } catch (error) {
        console.error("Erro ao carregar as médias dos alunos:", error);
    }
};

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


const buscarAlunosDaTurma = async (turmaID) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('type', '==', 3), where('turmaId', '==', turmaID));
        const snapshot = await getDocs(q);

        const listaAlunos = snapshot.docs.map(doc => ({
            id: doc.id,
            nome: doc.data().nome || doc.data().name || "Sem nome",
            email: doc.data().email,
            media: doc.data().media || "N/A"
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
                alunosCount: alunos.length, 
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
            alunosCount: alunos.length || 0, 
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
                            
                            {/*
                            <ButtonBold 
                            title='Nova turma' 
                            icon={<FaCirclePlus size={20}/>} 
                            action={() => {
                                setEditandoTurma(false);
                                setTurma({
                                    name: '',
                                    description: '',
                                    startDate: '',
                                    endDate: '',
                                    active: false,
                                    modulos: [],
                                });
                                setTurmaSelecionada(null);
                                setNovaTurma(true);
                            }} 
                        /> */}

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
    <h1>{turmaSelecionada ? turmaSelecionada.name : "Nova Turma"}</h1>
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
                <div className='spanName'>
                <input 
    type="checkbox" 
    checked={selectedAlunos.length === alunos.length && alunos.length > 0} 
    onChange={handleSelectAll} 
/>
                <span>Nome</span>
                </div>
                    <span>Email</span>
                    <span>Média de Notas</span>
                    <span></span>
                </div>
        
                {paginatedAlunos.map((aluno) => (
    <div key={aluno.id} className="alunoItem">
        <div className='spanName'>
        <input 
    type="checkbox" 
    checked={selectedAlunos.includes(aluno.id)} 
    onChange={() => handleSelectAluno(aluno.id)} 
/>

        <span title={aluno.nome}>
            {aluno.nome.length > 15 ? aluno.nome.slice(0, 15) + '...' : aluno.nome}
        </span>
        </div>
        <span title={aluno.email}>
            {aluno.email.length > 12 ? aluno.email.slice(0, 12) + '...' : aluno.email}
        </span>
        <span>{aluno.media ? aluno.media : "N/A"}</span>
        <button className="btnDelete">
            <FaTrash size={18} />
        </button>
    </div>
))}
            </div>
        </div>
        <Pagination
    currentPage={currentPage}
    setCurrentPage={setCurrentPage}
    itemsPerPage={itemsPerPage}
    setItemsPerPage={setItemsPerPage}
    totalItems={alunos.length}
/>
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
