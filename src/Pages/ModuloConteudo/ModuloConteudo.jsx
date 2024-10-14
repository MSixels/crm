import { useNavigate, useParams } from 'react-router-dom'
import './ModuloConteudo.css'
import Header from '../../Components/Header/Header'
import MenuConteudo from '../../Components/ModuloAluno/MenuConteudo/MenuConteudo'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { firestore } from '../../services/firebaseConfig'
import VideoAula from '../../Components/ModuloAluno/VideoAula/VideoAula'
import Prova from '../../Components/ModuloAluno/Prova/Prova'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'


function ModuloConteudo() {
    const { moduloId } = useParams()
    const { conteudoId } = useParams()
    const { materialId } = useParams()
    const [modulo, setModulo] = useState([])
    const [conteudo, setConteudo] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [provas, setProvas] = useState([]);
    const [itemType, setItemType] = useState(null); 
    const navigate = useNavigate()
    const [userId, setUserId] = useState('')
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
            route: `/aluno/modulo/${moduloId}/${conteudoId}/${materialId}`,
            status: 'active'
        },
    ]

    useEffect(() => {
        console.log('conteudoId: ', conteudoId)
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
                    console.log("selectedModulo ModuloConteduo: ", selectedModulo); 
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

                const filteredConteudo = conteudoData.filter((c) => c.id === conteudoId);

                setConteudo(filteredConteudo);
                console.log('Conteúdo ModuloConteduo: ', filteredConteudo);
            } catch (error) {
                console.error('Erro ao carregar conteúdo:', error);
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
                }));

                const aulasFiltradas = aulasData.filter(aula => 
                    conteudo.some(c => c.id === aula.conteudoId)
                );

                setAulas(aulasFiltradas);  
                console.log('Aulas ModuloConteduo: ', aulasFiltradas);
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
                }));

                
                const provasFiltradas = provasData.filter(prova => 
                    conteudo.some(c => c.id === prova.conteudoId)
                );

                setProvas(provasFiltradas);  
                console.log('Provas ModuloConteduo: ', provasFiltradas);
            } catch (error) {
                console.error('Erro ao carregar provas:', error);
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
                }));

                const provaEncontrada = provasData.find(prova => prova.id === materialId);
                
                if (provaEncontrada) {
                    setItemType('prova');
                    return;
                }

                setItemType('não encontrado');
            } catch (error) {
                console.error('Erro ao buscar o material:', error);
            }
        };

        if (materialId) {
            fetchMaterialData();
        }
    }, [materialId]);

    useEffect(() => {
        console.log('materialId: ', materialId)
    }, [materialId])

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

    const aulaConfirm = async (userId, aulaId) => {
        try {
            const progressRef = doc(firestore, 'progressAulas', `${userId}_${aulaId}`);
            const progressDoc = await getDoc(progressRef);
            if (progressDoc.exists()) {
                await setDoc(progressRef, { status: 'end' }, { merge: true });
                console.log('Progresso atualizado com sucesso!');
            } else {
                const progressData = {
                    userId: userId,
                    aulaId: aulaId,
                    status: 'end',
                };
                await setDoc(progressRef, progressData);
                console.log('Progresso criado e atualizado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao criar ou atualizar o progresso:', error);
        }
    };


    const provaConfirm = async (userId, provaId) => {
        try {
            const progressRef = doc(firestore, 'progressProvas', `${userId}_${provaId}`);
            const progressDoc = await getDoc(progressRef);
    
            if (progressDoc.exists()) {
                await setDoc(progressRef, { status: 'end' }, { merge: true });
                console.log('Progresso da prova atualizado com sucesso!');
            } else {
                const progressData = {
                    userId: userId,
                    provaId: provaId,
                    status: 'end',
                };
                await setDoc(progressRef, progressData);
                console.log('Progresso da prova criado e atualizado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao criar ou atualizar o progresso da prova:', error);
        }
    };


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
    
                        console.log('Dados de progresso das aulas encontrados:', progressData);
                        setProgressAulas(progressData);
                    } else {
                        console.log('Nenhum dado de progresso das aulas encontrado.');
                    }
                } else {
                    console.log('O número de aulas excede o limite de 10 para a consulta "in".');
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
    
                        console.log('Dados de progresso das provas encontrados:', progressProvasData);
                        setProgressProvas(progressProvasData);
                        console.log('Nenhum dado de progresso das provas encontrado.');
                    }
                } else {
                    console.log('O número de provas excede o limite de 10 para a consulta "in".');
                }
            } catch (error) {
                console.error('Erro ao buscar status do progresso das provas:', error);
            }
        };
    
        if (userId && provas && provas.length > 0) {
            fetchProvaProgress(userId, provas);
        }
    }, [userId, provas]);
    
    
    

    const confirmMaterial = (confirm, itemType) => {
        if (confirm) {
            const materialConfim = materialId;
            console.log('materialId_confirmado: ', materialConfim);
    
            if (itemType === 'aula') {
                aulaConfirm(userId, materialConfim) 
                    .then(() => {
                        if (provas.length > 0) {
                            console.log('Array provas: ', provas[0].id);
                            navigate(`/aluno/modulo/${moduloId}/${conteudoId}/${provas[0].id}`);
                        } else {
                            console.log('Não há provas disponíveis.');
                            navigate(`/aluno/modulo/${moduloId}`);
                        }
                    })
                    .catch(error => console.error('Erro ao confirmar aula:', error));
            }
    
            else if (itemType === 'prova') {
                provaConfirm(userId, materialConfim) 
                    .then(() => {
                        console.log('Prova confirmada, navegando para o módulo.');
                        navigate(`/aluno/modulo/${moduloId}`);
                    })
                    .catch(error => console.error('Erro ao confirmar prova:', error));
            }
        }
    };

    return (
        <div className='containerModuloConteudo'>
            <Header options={options}/>
            <div className='divContent'>
                {modulo && conteudo.length > 0  && <MenuConteudo modulo={modulo} conteudo={conteudo} aulas={aulas} provas={provas} progressAulas={progressAulas} progressProvas={progressProvas} userId={userId}/>}
                <div className='divMaterial'>
                    {itemType === 'aula' && <VideoAula materialId={materialId} confirmAula={() => confirmMaterial(true, 'aula')} />}
                    {itemType === 'prova' && <Prova materialId={materialId} confirmProva={() => confirmMaterial(true, 'prova')}/>}
                </div>
                
            </div>
        </div>
    )
}

export default ModuloConteudo