import { useState, useEffect } from 'react';
import { firestore } from '../../../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import ButtonBold from '../../ButtonBold/ButtonBold';
import './RastreioCRM.css';
import InputText from '../../InputText/InputText';
import DropDown from '../../DropDown/DropDown';
import { FaEllipsisVertical } from 'react-icons/fa6';

function RastreioCRM() {
    const [nome, setNome] = useState('');
    const [turmaSelecionada, setTurmaSelecionada] = useState('');
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [turmas, setTurmas] = useState([]);
    const [alunos, setAlunos] = useState([
        { id: 1, nome: 'João Silva', turma: 'Turma A', faixaEtaria: '10-12 anos', data: '20/02/2024', resultado: 'Aprovado' },
        { id: 2, nome: 'Maria Souza', turma: 'Turma B', faixaEtaria: '13-15 anos', data: '19/02/2024', resultado: 'Reprovado' },
        { id: 3, nome: 'Carlos Lima', turma: 'Turma A', faixaEtaria: '10-12 anos', data: '18/02/2024', resultado: 'Aprovado' }
    ]);
    const [alunosFiltrados, setAlunosFiltrados] = useState([]);
    const [selecionados, setSelecionados] = useState([]);
    const [selecionarTodos, setSelecionarTodos] = useState(false);

    useEffect(() => {
        const fetchTurmas = async () => {
            try {
                const turmasRef = collection(firestore, 'turmas'); 
                const snapshot = await getDocs(turmasRef);
                const turmasData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTurmas(turmasData);
            } catch (error) {
                console.error("Erro ao buscar turmas:", error);
            }
        };

        fetchTurmas();
    }, []);

    useEffect(() => {
        const filtrarAlunos = () => {
            const filtrados = alunos.filter(aluno =>
                aluno.nome.toLowerCase().includes(nome.toLowerCase()) &&
                (turmaSelecionada === '' || aluno.turma === turmaSelecionada) &&
                (dataSelecionada === '' || aluno.data === dataSelecionada)
            );
            setAlunosFiltrados(filtrados);
        };

        filtrarAlunos();
    }, [nome, turmaSelecionada, dataSelecionada, alunos]);

    useEffect(() => {
        if (selecionarTodos) {
            setSelecionados(alunosFiltrados.map(aluno => aluno.id));
        } else {
            setSelecionados([]);
        }
    }, [selecionarTodos, alunosFiltrados]);

    const handleCheckboxChange = (id) => {
        setSelecionados(prevSelecionados =>
            prevSelecionados.includes(id)
                ? prevSelecionados.filter(item => item !== id)
                : [...prevSelecionados, id]
        );
    };

    const handleDownload = () => {
        const data = [
            ["Nome", "Turma", "Faixa Etária", "Data", "Resultado"],
            ...alunosFiltrados.map(aluno => [aluno.nome, aluno.turma, aluno.faixaEtaria, aluno.data, aluno.resultado])
        ];
        const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "rastreio.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDataChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        
        let formattedDate = value;
        if (value.length >= 2) formattedDate = `${value.slice(0, 2)}/${value.slice(2)}`;
        if (value.length >= 4) formattedDate = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
        
        setDataSelecionada(formattedDate);
    };

    return (
        <div className="containerRastreios">
            <h1 className='titleRastreios'>Rastreios</h1>

            <div className="listaFiltrada">
                <div className="filtros">
                    <InputText 
                        title='Pesquisar nome' 
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                    />
                    <DropDown 
                        title='Turma' 
                        type='Selecione' 
                        options={turmas.map(t => t?.nome ?? '')}
                        value={turmaSelecionada}
                        onChange={(e) => setTurmaSelecionada(e.target.value)}
                    />
                    <InputText 
                        title='Data' 
                        type="text" 
                        maxLength="10"
                        value={dataSelecionada} 
                        onChange={handleDataChange}
                        placeholder="dd/mm/aaaa"
                    />
                    <ButtonBold title='Baixar relatórios' onClick={handleDownload} />
                </div>

                <div className="listaAlunos">
                    <div className="alunoItem cabecalhoLista">
                        <div className='spanName'>
                            <input 
                                type="checkbox" 
                                checked={selecionarTodos} 
                                onChange={() => setSelecionarTodos(!selecionarTodos)} 
                            />
                            <span>Nome</span>
                        </div>
                        <span>Turma</span>
                        <span>Faixa Etária</span>
                        <span>Data</span>
                        <span>Resultado</span>
                        <span></span>
                    </div>
                    {alunosFiltrados.length > 0 ? (
                        alunosFiltrados.map(aluno => (
                            <div key={aluno.id} className="alunoItem">
                                <div className='spanName'>
                                    <input 
                                        type="checkbox" 
                                        checked={selecionados.includes(aluno.id)} 
                                        onChange={() => handleCheckboxChange(aluno.id)} 
                                    />
                                    <span>{aluno.nome}</span>
                                </div>
                                <span>{aluno.turma}</span>
                                <span>{aluno.faixaEtaria}</span>
                                <span>{aluno.data}</span>
                                <span>{aluno.resultado}</span>
                                <button className='dowRastreio'><FaEllipsisVertical size={14}/></button>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum aluno encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RastreioCRM;
