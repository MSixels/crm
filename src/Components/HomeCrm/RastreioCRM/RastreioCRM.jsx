import { useRef, useState, useEffect } from 'react';
import { firestore } from '../../../services/firebaseConfig';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import ButtonBold from '../../ButtonBold/ButtonBold';
import './RastreioCRM.css';
import html2pdf from 'html2pdf.js';
import InputText from '../../InputText/InputText';
import DropDown from '../../DropDown/DropDown';
import { FaEllipsisVertical, FaCircleChevronRight, FaCircleChevronLeft } from 'react-icons/fa6';

function RastreioCRM() {
    const [nome, setNome] = useState('');
    const [turmaSelecionada, setTurmaSelecionada] = useState('');
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [turmas, setTurmas] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [alunosFiltrados, setAlunosFiltrados] = useState([]);
    const [selecionados, setSelecionados] = useState([]);
    const [selecionarTodos, setSelecionarTodos] = useState(false);
    const [modalPos, setModalPos] = useState({ top: 0, left: 0 });
    const [modalAberto, setModalAberto] = useState(null);
    const modalRef = useRef(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;
    const [modalConfirmacao, setModalConfirmacao] = useState(null);
    const componentRef = useRef();
    
    const abrirModalConfirmacao = (acao, alunoId) => {
        setModalConfirmacao({ acao, alunoId });
        setModalAberto(null); // Fecha o modal pequeno
    };
    

    const baixarPDF = () => {
        const element = componentRef.current;
    
        if (!element) {
            console.error("Elemento para gerar PDF não encontrado!");
            return;
        }
    
        const opt = {
            margin: 0.15,
            filename: 'relatorio_rastreio.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    
        html2pdf().from(element).set(opt).save();
    };
    
    

    useEffect(() => {
        const fetchTurmas = async () => {
            try {
                const snapshot = await getDocs(collection(firestore, 'turmas'));
                setTurmas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Erro ao buscar turmas:", error);
            }
        };

        const fetchRastreios = async () => {
            try {
                const snapshot = await getDocs(collection(firestore, 'rastreios'));
                const rastreios = await Promise.all(snapshot.docs.map(async (docSnap) => {
                    const data = docSnap.data();

                    // Buscar nome do usuário na collection 'users'
                    let userName = 'Desconhecido';
                    if (data.userID) {
                        const userDocRef = doc(firestore, 'users', data.userID);
                        const userDocSnap = await getDoc(userDocRef);
                        if (userDocSnap.exists()) {
                            userName = userDocSnap.data().name || 'Desconhecido';
                        }
                    }

                    // Buscar nome da turma (se existir)
                    let turmaNome = '';
                    if (data.turmaID) {
                        const turmaDocRef = doc(firestore, 'turmas', data.turmaID);
                        const turmaDocSnap = await getDoc(turmaDocRef);
                        if (turmaDocSnap.exists()) {
                            turmaNome = turmaDocSnap.data().name || '';
                        }
                    }

                    // Formatar faixa etária conforme lógica do typeQuest
                    let faixaEtaria = '';
                    switch (data.typeQuest) {
                        case 1:
                            faixaEtaria = '3 a 6 anos';
                            break;
                        case 2:
                            faixaEtaria = 'Até 8 anos';
                            break;
                        case 3:
                            faixaEtaria = 'Acima de 8 anos';
                            break;
                        default:
                            faixaEtaria = '';
                    }

                    let dataFormatada = '';
                    if (data.createdAt?.seconds) {
                        const dataObj = new Date(data.createdAt.seconds * 1000);
                        dataFormatada = dataObj.toLocaleDateString('pt-BR');
                    }

                    return {
                        id: docSnap.id,
                        nome: userName,
                        turma: turmaNome,
                        faixaEtaria: faixaEtaria,
                        data: dataFormatada,
                        resultado: '' 
                    };
                }));

                setAlunos(rastreios);
            } catch (error) {
                console.error("Erro ao buscar rastreios:", error);
            }
        };

        fetchTurmas();
        fetchRastreios();
    }, []);

    const handleExcluirRastreio = (alunoId) => {
        abrirModalConfirmacao('excluir', alunoId);
    };
    
    const handleBaixarRastreio = (alunoId) => {
        abrirModalConfirmacao('baixar', alunoId);
    };
    const confirmarAcao = async () => {
        if (!modalConfirmacao) return;
    
        const { acao, alunoId } = modalConfirmacao;
    
        if (acao === 'excluir') {
            try {
                await deleteDoc(doc(firestore, 'rastreios', alunoId));
                setAlunos(prevAlunos => prevAlunos.filter(aluno => aluno.id !== alunoId));
                alert("Rastreio excluído com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir rastreio:", error);
                alert("Erro ao excluir rastreio. Tente novamente.");
            }
        } else if (acao === 'baixar') {
            baixarPDF();
        }
    
        setModalConfirmacao(null); // Fecha o modal
    };

    const ModalConfirmacao = () => {
        if (!modalConfirmacao) return null;
    
        return (
            <div className="overlay">
                <div className="modalConfirmacao">
                    <h2 className='textModal' style={{ color: modalConfirmacao.acao === 'excluir' ? '#323F49' : '#323F49' }}>
                        {modalConfirmacao.acao === 'excluir' ? "Excluir este rastreio?" : "Baixar rastreio?"}
                    </h2>
                    <div className="botoes">
                        <button className="btnSim" onClick={confirmarAcao}>Sim</button>
                        <button className="btnNao" onClick={() => setModalConfirmacao(null)}>Não</button>
                    </div>
                </div>
            </div>
        );
    };
    

    useEffect(() => {
        const filtrados = alunos.filter(aluno =>
            aluno.nome.toLowerCase().includes(nome.toLowerCase()) &&
            (turmaSelecionada === '' || aluno.turma === turmaSelecionada) &&
            (dataSelecionada === '' || aluno.data === dataSelecionada)
        );
        setAlunosFiltrados(filtrados);
    }, [nome, turmaSelecionada, dataSelecionada, alunos]);

    useEffect(() => {
        setSelecionados(selecionarTodos ? alunosFiltrados.map(aluno => aluno.id) : []);
    }, [selecionarTodos, alunosFiltrados]);

    const handleOpenModal = (event, alunoId) => {
        event.stopPropagation(); 
        const rect = event.currentTarget.getBoundingClientRect();
        setModalPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
        setModalAberto(alunoId);
    };
    
    

    const handleCheckboxChange = (id) => {
        setSelecionados(prevSelecionados =>
            prevSelecionados.includes(id)
                ? prevSelecionados.filter(item => item !== id)
                : [...prevSelecionados, id]
        );
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalAberto && modalRef.current && !modalRef.current.contains(event.target)) {
                setModalAberto(null);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalAberto]);
    
    

    const renderGrafic = (value) => {
        return (
            <div className='containerGraficMini divlineValue'>
                <div className={`bar bar-1 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-2 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-3 ${value === 'pp' ? '' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-4 ${value === 'pp' ? '' : value === 'p' ? '' : value === 'mp' ? 'red' : ''}`}></div>
            </div>
        );
    };

    const totalPaginas = Math.ceil(alunos.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const alunosPaginados = alunosFiltrados.slice(inicio, inicio + itensPorPagina);


    return (
        <div className="containerRastreios">
            <h1 className='titleRastreios'>Rastreios</h1>
            <ModalConfirmacao />
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
                        onChange={(e) => setDataSelecionada(e.target.value)}
                        placeholder="dd/mm/aaaa"
                    />
                    <ButtonBold title='Baixar relatórios' />
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
                    {alunosPaginados.length > 0 ? (
                        alunosPaginados.map(aluno => (
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
                                <span>{renderGrafic(aluno.resultado)}</span>
                                <button className='dowRastreio' onClick={(e) => handleOpenModal(e, aluno.id)}>
    <FaEllipsisVertical size={14}/>
</button>
{modalAberto === aluno.id && (
    <div 
        ref={componentRef}
        className="modalRastreio" 
        style={{ position: 'absolute', top: modalPos.top, left: modalPos.left, background: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
    >
        <ul className='modalList'>
            <li onClick={() => handleExcluirRastreio(aluno.id)} style={{ cursor: 'pointer', color: 'red' }}>Excluir</li>
            <li onClick={handleBaixarRastreio} style={{ cursor: 'pointer' }}> Baixar</li>
        </ul>
    </div>
)}
                            </div>
                        ))
                    ) : (
                        <p>Nenhum rastreio encontrado.</p>
                    )}
                </div>
            </div>
            <div className="paginacao">
                <span></span>
                <div>
                <button className='navBtn' onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))} disabled={paginaAtual === 1}>
                    <FaCircleChevronLeft size={20} />
                </button>
                <span>Página {paginaAtual} de {totalPaginas}</span>
                <button className='navBtn' onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas))} disabled={paginaAtual === totalPaginas}>
                    <FaCircleChevronRight  size={20}/>
                </button>
                </div>
            </div>
        </div>
    );
}

export default RastreioCRM;
