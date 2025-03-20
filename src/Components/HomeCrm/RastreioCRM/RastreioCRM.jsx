import { useRef, useState, useEffect } from 'react';
import { firestore } from '../../../services/firebaseConfig';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import ButtonBold from '../../ButtonBold/ButtonBold';
import './RastreioCRM.css';
import html2pdf from 'html2pdf.js';
import InputText from '../../InputText/InputText';
import DropDown from '../../DropDown/DropDown';
import { FaEllipsisVertical, FaCircleChevronRight, FaCircleChevronLeft } from 'react-icons/fa6';
import { evaluateTDAHPotential, evaluateTDIPotential, evaluateTEAPotential, evaluateTEAPPotential, evaluateTLPotential, evaluateTODPotential } from '../../../functions/functions';

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
    const [resultText, setResultText] = useState('');
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
                setTurmas(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (error) {
                console.error("Erro ao buscar turmas:", error);
            }
        };

        const fetchRastreios = async () => {
            try {
                const snapshot = await getDocs(collection(firestore, 'rastreios'));
                const docsRastreios = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

                // 1. Obter todos os userIds e turmaIds únicos
                const userIds = [...new Set(docsRastreios.map(d => d.userId).filter(Boolean))];

                // 2. Buscar todos os usuários de uma vez só
                const userSnapshots = await Promise.all(userIds.map(id => getDoc(doc(firestore, 'users', id))));
                const usersMap = new Map(userSnapshots.map(snap => [snap.id, snap.exists() ? snap.data() : null]));

                // 3. Obter todas as turmas necessárias (baseado nos usuários)
                const turmaIds = [...new Set([...usersMap.values()].map(u => u?.turmaId).filter(Boolean))];
                const turmaSnapshots = await Promise.all(turmaIds.map(id => getDoc(doc(firestore, 'turmas', id))));
                const turmasMap = new Map(turmaSnapshots.map(snap => [snap.id, snap.exists() ? snap.data() : null]));

                // 4. Processar os rastreios com dados já carregados
                const alunos = docsRastreios.map(docRastreio => {
                    const user = usersMap.get(docRastreio.userId) || {};
                    const turma = turmasMap.get(user.turmaId) || {};

                    return {
                        id: docRastreio.id,
                        nome: user.name || 'Desconhecido',
                        turma: turma.name || '',
                        faixaEtaria: getFaixaEtaria(docRastreio.typeQuest),
                        data: formatarData(docRastreio.createdAt),
                        resultado: docRastreio.responses
                    };
                });

                setAlunos(alunos);
            } catch (error) {
                console.error("Erro ao buscar rastreios:", error);
            }
        };

        fetchTurmas();
        fetchRastreios();
    }, []);

    const getFaixaEtaria = (typeQuest) => {
        switch (typeQuest) {
            case 1: return '3 a 6 anos';
            case 2: return 'Até 8 anos';
            case 3: return 'Acima de 8 anos';
            default: return '';
        }
    };

    const formatarData = (createdAt) => {
        if (createdAt?.seconds) {
            return new Date(createdAt.seconds * 1000).toLocaleDateString('pt-BR');
        }
        return '';
    };

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
        let filtrados;
        if (turmaSelecionada === 'Selecione') {
            filtrados = alunos;
            setAlunosFiltrados(filtrados)
            return
        }

        filtrados = alunos.filter(aluno =>
            aluno.nome && aluno.nome.toLowerCase().includes(nome.toLowerCase()) &&
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

    const handleDropChange = (option) => {
        if (option) {
            setTurmaSelecionada(option);
        } else {
            setTurmaSelecionada('Selecione')
        }
    };

    const mapPotentialToText = (potential) => {
        switch (potential) {
            case 'pp':
                return 'Baixo';
            case 'p':
                return 'Médio';
            case 'mp':
                return 'Alto';
            default:
                return 'Indefinido'; // Caso o valor seja inesperado
        }
    };

    const calculateResult = (value) => {
        const { tdahPotential } = evaluateTDAHPotential(value);
        const { teaPotential } = evaluateTEAPotential(value);
        const { teapPotential } = evaluateTEAPPotential(value);
        const { tlPotential } = evaluateTLPotential(value);
        const { todPotential } = evaluateTODPotential(value);
        const { tdiPotential } = evaluateTDIPotential(value);
        let resultado = 'pp';

        const potentials = [tdahPotential, teaPotential, teapPotential, tlPotential, todPotential, tdiPotential];

        if (potentials.includes('mp')) {
            resultado = 'mp';
        } else if (potentials.includes('p')) {
            resultado = 'p';
        }

        return resultado;
    }

    const renderText = (value) => {
        const resultado = calculateResult(value);
        return mapPotentialToText(resultado);
    }


    const renderGrafic = (value) => {
        const resultado = calculateResult(value);
        return (
            <div className='containerGraficMini divlineValue'>
                <div className={`bar bar-1 ${resultado === 'pp' ? 'green' : resultado === 'p' ? 'yellow' : resultado === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-2 ${resultado === 'pp' ? 'green' : resultado === 'p' ? 'yellow' : resultado === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-3 ${resultado === 'pp' ? '' : resultado === 'p' ? 'yellow' : resultado === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-4 ${resultado === 'pp' ? '' : resultado === 'p' ? '' : resultado === 'mp' ? 'red' : ''}`}></div>
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
            <div className="divContent">
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
                            options={turmas.map(t => t?.name ?? '')}
                            value={turmaSelecionada}
                            onChange={(e) => setTurmaSelecionada(e.target.value)}
                            onTurmaChange={handleDropChange}
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

                    <div className="divInfos">
                        <div className="divHeader">
                            <div className='spanName'>
                                <input
                                    type="checkbox"
                                    checked={selecionarTodos}
                                    onChange={() => setSelecionarTodos(!selecionarTodos)}
                                />
                                <span>Nome</span>
                            </div>
                            <span className='title'>Turma</span>
                            <span className='title'>Faixa Etária</span>
                            <span className='title'>Data</span>
                            <span className='title'>Resultado</span>
                            <span className='title'></span>
                        </div>
                        <div className="divValues">
                            {alunosPaginados.length > 0 ? (
                                alunosPaginados.map(aluno => (
                                    <div key={aluno.id} className="divRastreios">
                                        <div className='spanName'>
                                            <input
                                                type="checkbox"
                                                checked={selecionados.includes(aluno.id)}
                                                onChange={() => handleCheckboxChange(aluno.id)}
                                            />
                                            <span>{aluno.nome}</span>
                                        </div>
                                        <span className='spanBox'>{aluno.turma}</span>
                                        <span className='spanBox'>{aluno.faixaEtaria}</span>
                                        <span className='spanBox'>{aluno.data}</span>
                                        <div className='spanName'>
                                            {renderGrafic(aluno.resultado)}{renderText(aluno.resultado)} risco potencial
                                        </div>
                                        <button className='dowRastreio' onClick={(e) => handleOpenModal(e, aluno.id)}>
                                            <FaEllipsisVertical size={14} />
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
                </div>
                <div className="paginacao">
                    <span></span>
                    <div>
                        <button className='navBtn' onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))} disabled={paginaAtual === 1}>
                            <FaCircleChevronLeft size={20} />
                        </button>
                        <span>Página {paginaAtual} de {totalPaginas}</span>
                        <button className='navBtn' onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas))} disabled={paginaAtual === totalPaginas}>
                            <FaCircleChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RastreioCRM;
