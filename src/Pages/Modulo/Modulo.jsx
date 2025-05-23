import { useNavigate, useParams } from 'react-router-dom'
import Menu from '../../Components/ModuloAluno/Menu/Menu'
import './Modulo.css'
import Aulas from '../../Components/ModuloAluno/Aulas/Aulas'
import Header from '../../Components/Header/Header'
import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../../services/firebaseConfig'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { chunk } from 'lodash';

function Modulo() {
    const { moduloId } = useParams()
    const { type } = useParams()
    const [modulo, setModulo] = useState([])
    const [conteudo, setConteudo] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [provas, setProvas] = useState([]);
    const [userId, setUserId] = useState('')
    const navigate = useNavigate()
    const [progressAulas, setProgressAulas] = useState([])
    const [progressProvas, setProgressProvas] = useState([])

    const options = [
        {
            id: 1,
            text: 'início',
            route: '/aluno/home',
            status: 'active'
        },
        {
            id: 2,
            text: 'Rastreio',
            route: '/aluno/rastreio',
            status: 'active'
        },
        {
            id: 3,
            text: 'Módulos e aulas',
            route: `/aluno/modulo/${moduloId}/${type}`,
            status: 'active'
        },
    ]

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            setUserId(decodedToken.user_id)
        } else {
            console.log("Nenhum token encontrado nos cookies.");
            navigate('/login/aluno');
        }
    }, [navigate]);

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
                
            } catch (error) {
                console.error('Erro ao buscar status do progresso das aulas:', error);
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
                
            } catch (error) {
                console.error('Erro ao buscar status do progresso das provas:', error);
            }
        };
    
        if (userId && provas && provas.length > 0) {
            fetchProvaProgress(userId, provas);
        }
    }, [userId, provas]);

    useEffect(() => {
        const fetchModulosData = async () => {
            try {
                const modulosSnapshot = await getDocs(collection(firestore, 'modulos'));
                const modulosData = modulosSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const selectedModulo = modulosData.find((modulo) => modulo.id === moduloId);

                if (selectedModulo) {
                    setModulo(selectedModulo);
                    console.log("selectedModulo: ", selectedModulo);
                } else {
                    console.log("Módulo não encontrado.");
                }

            } catch (error) {
                console.error('Erro ao carregar modulos:', error);
            }
        };
    
        fetchModulosData();
    }, [moduloId]);

    

    useEffect(() => {
        const fetchConteudoData = async () => {
            try {
                const conteudoSnapshot = await getDocs(collection(firestore, 'conteudo'));
                const conteudoData = conteudoSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const filteredConteudo = conteudoData.filter((c) => c.moduloId === modulo.id);

                setConteudo(filteredConteudo);
                console.log('Conteúdo filtrado: ', filteredConteudo);
            } catch (error) {
                console.error('Erro ao carregar conteúdo:', error);
            }
        };

        fetchConteudoData();
    }, [modulo]); 

    useEffect(() => {
        const fetchAulasData = async () => {
            try {
                const aulasSnapshot = await getDocs(collection(firestore, 'aulas'));
                const aulasData = aulasSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    conteudoId: doc.data().conteudoId,
                    createdAt: doc.data().createdAt,
                    type: doc.data().type,
                }));

                const aulasFiltradas = aulasData.filter(aula => 
                    conteudo.some(c => c.id === aula.conteudoId)
                );

                setAulas(aulasFiltradas);  
                console.log('Aulas filtradas: ', aulasFiltradas);
            } catch (error) {
                console.error('Erro ao carregar aulas:', error);
            }
        };

        if (conteudo.length > 0) {
            fetchAulasData();
        }
    }, [conteudo]);

    useEffect(() => {
        const fetchProvasData = async () => {
            try {
                const provasSnapshot = await getDocs(collection(firestore, 'provas'));
                const provasData = provasSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    conteudoId: doc.data().conteudoId,
                    createdAt: doc.data().createdAt,
                    type: doc.data().type,
                }));

                const provasFiltradas = provasData.filter(prova => 
                    conteudo.some(c => c.id === prova.conteudoId)
                );

                setProvas(provasFiltradas);  
                console.log('Provas filtradas: ', provasFiltradas);
            } catch (error) {
                console.error('Erro ao carregar provas:', error);
            }
        };

        if (conteudo.length > 0) {
            fetchProvasData();
        }
    }, [conteudo]);


    return (
        <div className='containerModulo'>
            <Header options={options}/>
            <div className='divContent'>
                <Menu 
                    modulo={modulo} 
                    conteudo={conteudo} 
                    aulas={aulas} 
                    provas={provas} 
                    progressAulas={progressAulas} 
                    progressProvas={progressProvas} 
                    userId={userId}
                />
                {type === 'aulas' && <Aulas 
                    modulo={modulo} 
                    conteudo={conteudo} 
                    aulas={aulas} 
                    provas={provas} 
                    progressAulas={progressAulas} 
                    progressProvas={progressProvas} 
                    userId={userId}
                />}
                
            </div>
        </div>
    )
}

export default Modulo