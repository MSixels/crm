import './Cursos.css';
import { IoMdSearch } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { GoDotFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../../services/firebaseConfig';
import ProgressBar from '../../ProgressBar/ProgressBar';
import LoadingItem from '../../LoadingItem/LoadingItem';
import { chunk } from 'lodash';

function Cursos({ modulos, conteudo, aulas, provas, professores, userId }) {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [progressAulas, setProgressAulas] = useState([])
    const [progressProvas, setProgressProvas] = useState([])
    const [modulosUpdate, setModulosUpdate] = useState([])
    const [loadingAulas, setLoadingAulas] = useState(true)
    const [loadingProvas, setLoadingProvas] = useState(true)

    useEffect(() => {
        try {
            const updatedModulos = modulos.map((modulo) => {
                let status = "start"; 
        
                if (modulo.liberacao) {
                    const liberacaoDate = new Date(modulo.liberacao);
                    const today = new Date();
        
                    if (liberacaoDate > today) {
                        status = "block";
                    }
                }
        
                return {
                    ...modulo,
                    status,
                };
            });
        
            setModulosUpdate(updatedModulos); 
            console.log("Modulos com status:", updatedModulos);
        } catch (error) {
            console.error("Erro ao atualizar modulos:", error);
            setModulosUpdate(modulos); 
        }
    }, [modulos]);

    useEffect(() => {
        console.log('modulosUpdate: ', modulosUpdate)
    }, [modulosUpdate])
    
    

    const calculateProgress = (aulasCompletadas, aulasTotal, provasCompletadas, provasTotal) => {
        console.log(`Calculos de %: ${aulasCompletadas} / ${aulasTotal} && ${provasCompletadas} / ${provasTotal}`)
        const percentAulas = (aulasCompletadas / aulasTotal) * 100;
        const percentProvas = (provasCompletadas / provasTotal) * 100;
        const totalProgress = (percentAulas + percentProvas) / 2;
        return totalProgress.toFixed(0);
    };

    const removeAccents = (text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredModulos = modulosUpdate.filter(m => {
        const lowerCaseSearchTerm = removeAccents(searchTerm).toLowerCase();
        return removeAccents(m.name).toLowerCase().includes(lowerCaseSearchTerm);
    });

    const sortedModulos = filteredModulos.sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    const getProfessorName = (professorId) => {
        const professor = professores.find(p => p.id === professorId);
        return professor ? professor.name : 'Professor não encontrado';
    };

    const openModulo = (id) => {
        navigate(`/aluno/modulo/${id}/aulas`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate() + 1).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchAulaProgress = async (userId, aulas) => {
            if (!userId || !aulas || aulas.length === 0) return;
    
            try {
                const aulaIds = aulas.map(aula => aula.id);
                const progressRef = collection(firestore, 'progressAulas');
                const progressData = [];
    
                // Divide os IDs de aulas em blocos de até 10
                const chunks = chunk(aulaIds, 10);
    
                for (const aulaChunk of chunks) {
                    const q = query(
                        progressRef,
                        where('userId', '==', userId),
                        where('aulaId', 'in', aulaChunk)
                    );
    
                    const querySnapshot = await getDocs(q);
    
                    if (!querySnapshot.empty) {
                        const chunkData = querySnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        progressData.push(...chunkData);
                    }
                }
    
                if (progressData.length > 0) {
                    console.log('Dados de progresso das aulas encontrados:', progressData);
                    setProgressAulas(progressData);
                } else {
                    console.log('Nenhum dado de progresso das aulas encontrado.');
                }
                setLoadingAulas(false);
                
            } catch (error) {
                console.error('Erro ao buscar status do progresso das aulas:', error);
                setLoadingAulas(false);
            }
        };
    
        if (userId && aulas && aulas.length > 0) {
            fetchAulaProgress(userId, aulas);
        }
    }, [userId, aulas]);
    

    useEffect(() => {
        const fetchProvaProgress = async (userId, provas) => {
            if (!userId || !provas || provas.length === 0) return;
    
            try {
                const provaIds = provas.map(prova => prova.id);
                const progressProvasRef = collection(firestore, 'progressProvas');
                const progressProvasData = [];
    
                // Divide os IDs de provas em blocos de até 10
                const chunks = chunk(provaIds, 10);
    
                for (const provaChunk of chunks) {
                    const q = query(
                        progressProvasRef,
                        where('userId', '==', userId),
                        where('provaId', 'in', provaChunk)
                    );
    
                    const querySnapshot = await getDocs(q);
    
                    if (!querySnapshot.empty) {
                        const chunkData = querySnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        progressProvasData.push(...chunkData);
                    }
                }
    
                if (progressProvasData.length > 0) {
                    console.log('Dados de progresso das provas encontrados:', progressProvasData);
                    setProgressProvas(progressProvasData);
                } else {
                    console.log('Nenhum dado de progresso das provas encontrado.');
                }
                setLoadingProvas(false);
                
            } catch (error) {
                console.error('Erro ao buscar status do progresso das provas:', error);
                setLoadingProvas(false);
            }
        };
    
        if (userId && provas && provas.length > 0) {
            fetchProvaProgress(userId, provas);
        }
    }, [userId, provas]);
    

    if(loadingAulas || loadingProvas){
        return <div className='containerCursos'><LoadingItem /></div>
    }

    return (
        <div className='containerCursos'>
            <header>
                <div>
                    <h1>Módulos e aulas</h1>
                    <span className='subtitle'>Últimos módulos acessados, ou mais importantes para você.</span>
                </div>
                <div className='divSearch'>
                    <label htmlFor="search"><IoMdSearch size={22} /></label>
                    <input
                        className='inputPesquisa'
                        type="text"
                        id='search'
                        placeholder='Buscar por módulo'
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </header>
            <div className='divModulos'>
                {sortedModulos.map((m) => {
                    const conteudosDoModulo = conteudo.filter(c => c.moduloId === m.id);

                    const aulasCompletadas = aulas.filter(aula => 
                        conteudosDoModulo.some(c => c.id === aula.conteudoId) &&
                        progressAulas?.some(progress => progress.userId === userId && progress.aulaId === aula.id && progress.status === 'end')
                    ).length;

                    console.log('aulasCompletadas', aulasCompletadas)

                    const totalAulasModulo = aulas.filter(a =>
                        conteudosDoModulo.some(c => c.id === a.conteudoId)
                    ).length;

                    const provasCompletadas = provas.filter(prova => 
                        conteudosDoModulo.some(c => c.id === prova.conteudoId) &&
                        progressProvas?.some(progress => progress.userId === userId && progress.provaId === prova.id && progress.status === 'end')
                    ).length;

                    console.log('provasCompletadas', provasCompletadas)

                    const totalProvasModulo = provas.filter(p =>
                        conteudosDoModulo.some(c => c.id === p.conteudoId)
                    ).length;

                    return (
                        <div key={m.id} className='divModulo'>
                            <span className='prof'>
                                Prof: {getProfessorName(m.professorId)} <GoDotFill size={12} /> Disponível até {formatDate(m.validade)}
                            </span>
                            <h3 style={{ fontSize: 20 }}>{m.name}</h3>
                            <span style={{ fontSize: 16 }}>{m.description}</span>
                            <div className='divProgressInfos'>
                                <div className={`divInfo ${m.status === 'block' ? 'aulaBlock' : aulasCompletadas < totalAulasModulo ? 'aulaStart' : aulasCompletadas === totalAulasModulo && totalAulasModulo > 0 ? 'aulaEnd' : 'aulaStart'}`}>
                                    <span>{aulasCompletadas}/{totalAulasModulo} {totalAulasModulo > 1 ? 'aulas' : 'aula'}</span>
                                </div>
                                <div className={`divInfo ${m.status === 'block' ? 'provaBlock' : provasCompletadas < totalProvasModulo ? 'provaStart' : provasCompletadas === totalProvasModulo && totalProvasModulo > 0 ? 'provaEnd' : 'provaStart'}`}>
                                    <span>{provasCompletadas}/{totalProvasModulo} {totalProvasModulo > 1 ? 'provas' : 'prova'}</span>
                                </div>
                            </div>
                            <div className='divProgressBar'>
                                <ProgressBar aulasCompletadas={aulasCompletadas} aulasTotal={totalAulasModulo} provasCompletadas={provasCompletadas} provasTotal={totalProvasModulo} />
                                <span className='progressPorcent'>{m.status !== 'block' ? `${calculateProgress(aulasCompletadas, totalAulasModulo, provasCompletadas, totalProvasModulo) > 0 ? `${calculateProgress(aulasCompletadas, totalAulasModulo, provasCompletadas, totalProvasModulo)}% Concluído` : 'Não iniciado'}` : (<> <FaLock /> Bloqueado</>)}</span>
                            </div>
                            
                            <button
                                className={`btn ${m.status === 'block' ? 'btnBlock' : aulasCompletadas < totalAulasModulo || provasCompletadas < totalProvasModulo ? 'btnStart' : aulasCompletadas === totalAulasModulo && totalAulasModulo > 0 && provasCompletadas === totalProvasModulo && totalProvasModulo > 0 ? 'btnEnd' : ''}`}
                                disabled={m.status === 'block'}
                                onClick={() => openModulo(m.id)}
                            >
                                {m.status === 'block' ? 'Em breve' : aulasCompletadas === totalAulasModulo && totalAulasModulo > 0 && provasCompletadas === totalProvasModulo && totalProvasModulo > 0 ? 'Ver progresso' : 'Acessar módulo'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

Cursos.propTypes = {
    modulos: PropTypes.array.isRequired,
    conteudo: PropTypes.array.isRequired,
    aulas: PropTypes.array.isRequired, 
    provas: PropTypes.array.isRequired, 
    professores: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
};

export default Cursos;