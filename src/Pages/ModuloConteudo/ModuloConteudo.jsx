import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './ModuloConteudo.css'
import Header from '../../Components/Header/Header'
import MenuConteudo from '../../Components/ModuloAluno/MenuConteudo/MenuConteudo'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { firestore } from '../../services/firebaseConfig'
import VideoAula from '../../Components/ModuloAluno/VideoAula/VideoAula'
import Prova from '../../Components/ModuloAluno/Prova/Prova'
import StoryTelling from '../../Components/ModuloAluno/Storytelling/Storytelling'
import Game from '../../Components/ModuloAluno/Game/Game'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'


function ModuloConteudo() {
    const { moduloId } = useParams()
    const { conteudoId } = useParams()
    const { materialId } = useParams()
    const { type } = useParams()
    const [modulo, setModulo] = useState([])
    const [conteudo, setConteudo] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [provas, setProvas] = useState([]);
    const [itemType, setItemType] = useState(null); 
    const navigate = useNavigate()
    const [userId, setUserId] = useState('')
    const [progressAulas, setProgressAulas] = useState([])
    const [progressProvas, setProgressProvas] = useState([])

    const location = useLocation();

    useEffect(() => {
        //console.log('Rota atual:', location.pathname);
    }, [location]);

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
            route: `/aluno/modulo/${moduloId}/${conteudoId}/${type}/${materialId}`,
            status: 'active'
        },
    ]

    useEffect(() => {
        //console.log('conteudoId: ', conteudoId)
    }, [conteudoId])

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
                    //console.log("selectedModulo ModuloConteduo: ", selectedModulo); 
                } else {
                    //console.log("Módulo não encontrado.");
                }

            } catch (error) {
                //console.error('Erro ao carregar modulos:', error);
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

                const filteredConteudo = conteudoData.filter((c) => c.id === conteudoId);

                setConteudo(filteredConteudo);
                //console.log('Conteúdo ModuloConteduo: ', filteredConteudo);
            } catch (error) {
                //console.error('Erro ao carregar conteúdo:', error);
            }
        };

        fetchConteudoData();
    }, [conteudoId]); 

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
                //console.log('Aulas ModuloConteduo: ', aulasFiltradas);
            } catch (error) {
                //console.error('Erro ao carregar aulas:', error);
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
                //console.log('Provas ModuloConteduo: ', provasFiltradas);
            } catch (error) {
                //console.error('Erro ao carregar provas:', error);
            }
        };

        if (conteudo.length > 0) {
            fetchProvasData();
        }
    }, [conteudo]);

    useEffect(() => {
        const fetchMaterialData = async () => {
            try {
                const aulasSnapshot = await getDocs(collection(firestore, 'aulas'));
                const aulasData = aulasSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    conteudoId: doc.data().conteudoId,
                    createdAt: doc.data().createdAt,
                    type: doc.data().type,
                }));

                const aulaEncontrada = aulasData.find(aula => aula.id === materialId);
                
                if (aulaEncontrada) {
                    setItemType('aula');
                    return;
                }

                const provasSnapshot = await getDocs(collection(firestore, 'provas'));
                const provasData = provasSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    conteudoId: doc.data().conteudoId,
                    createdAt: doc.data().createdAt,
                    type: doc.data().type,
                }));

                const provaEncontrada = provasData.find(prova => prova.id === materialId);
                
                if (provaEncontrada) {
                    setItemType('prova');
                    return;
                }

                setItemType('não encontrado');
            } catch (error) {
                //console.error('Erro ao buscar o material:', error);
            }
        };

        if (materialId) {
            fetchMaterialData();
        }
    }, [materialId]);

    useEffect(() => {
        //console.log('materialId: ', materialId)
    }, [materialId])

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            setUserId(decodedToken.user_id)
        } else {
            //console.log("Nenhum token encontrado nos cookies.");
            navigate('/login/aluno');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchAulaProgress = async (userId, aulas) => {
            if (!userId || !aulas || aulas.length === 0) return;
    
            try {
                const aulaIds = aulas.map(aula => aula.id);
    
                if (aulaIds.length <= 10) {
                    const progressRef = collection(firestore, 'progressAulas');
                    const q = query(progressRef,
                        where('userId', '==', userId),
                        where('aulaId', 'in', aulaIds)
                    );
    
                    const querySnapshot = await getDocs(q);
    
                    if (!querySnapshot.empty) {
                        const progressData = querySnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
    
                        //console.log('Dados de progresso das aulas encontrados:', progressData);
                        setProgressAulas(progressData);
                    } else {
                        //console.log('Nenhum dado de progresso das aulas encontrado.');
                    }
                } else {
                    //console.log('O número de aulas excede o limite de 10 para a consulta "in".');
                }
            } catch (error) {
                //console.error('Erro ao buscar status do progresso das aulas:', error);
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
    
                if (provaIds.length <= 10) {
                    const progressProvasRef = collection(firestore, 'progressProvas');
                    const qProvas = query(progressProvasRef,
                        where('userId', '==', userId),
                        where('provaId', 'in', provaIds)
                    );
    
                    const querySnapshotProvas = await getDocs(qProvas);
    
                    if (!querySnapshotProvas.empty) {
                        const progressProvasData = querySnapshotProvas.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
    
                        //console.log('Dados de progresso das provas encontrados:', progressProvasData);
                        setProgressProvas(progressProvasData);
                        //console.log('Nenhum dado de progresso das provas encontrado.');
                    }
                } else {
                    //console.log('O número de provas excede o limite de 10 para a consulta "in".');
                }
            } catch (error) {
                //console.error('Erro ao buscar status do progresso das provas:', error);
            }
        };
    
        if (userId && provas && provas.length > 0) {
            fetchProvaProgress(userId, provas);
        }
    }, [userId, provas]);
    
    return (
        <div className='containerModuloConteudo'>
            <Header options={options}/>
            <div className='divContent'>
                {modulo && conteudo.length > 0  && <MenuConteudo modulo={modulo} conteudo={conteudo} aulas={aulas} provas={provas} progressAulas={progressAulas} progressProvas={progressProvas} userId={userId}/>}
                <div className='divMaterial'>
                    {type === 'aula' && <VideoAula materialId={materialId} userId={userId} />}
                    {type === 'prova' && <Prova materialId={materialId} userId={userId} conteudoId={conteudoId} />}
                    {type === 'storyTelling' && <StoryTelling materialId={materialId} userId={userId}/>}
                    {type === 'game' && <Game materialId={materialId} userId={userId}/>}
                </div>
                
            </div>
        </div>
    )
}

export default ModuloConteudo