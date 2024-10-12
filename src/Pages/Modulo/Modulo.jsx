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

function Modulo() {
    const { moduloId } = useParams()
    const [modulo, setModulo] = useState([])
    const [conteudo, setConteudo] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [provas, setProvas] = useState([]);
    const [userId, setUserId] = useState('')
    const navigate = useNavigate()
    const [progressAulas, setProgressAulas] = useState([])

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
            route: `/aluno/modulo/${moduloId}`,
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
        const fetchMaterialStatus = async (userId, aulas) => {
            if (!userId || !aulas || aulas.length === 0) return;
    
            try {
                const aulaIds = aulas.map(aula => aula.id); // Extrai os IDs das aulas
    
                // Verifica se a quantidade de aulas é de 10 ou menos
                if (aulaIds.length <= 10) {
                    // Cria uma query onde aulaId está em aulaIds
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
    
                        console.log('Dados de progresso encontrados:', progressData);
                        setProgressAulas(progressData)
                    } else {
                        console.log('Nenhum dado de progresso encontrado para o usuário e aula.');
                    }
                } else {
                    console.log('O número de aulas excede o limite de 10 para a consulta "in".');
                }
            } catch (error) {
                console.error('Erro ao buscar status do material:', error);
            }
        };
    
        if (userId && aulas && aulas.length > 0) {
            fetchMaterialStatus(userId, aulas); 
        }
    }, [userId, aulas]);

    useEffect(() => {
        const fetchModulosData = async () => {
            try {
                const modulosSnapshot = await getDocs(collection(firestore, 'modulos'));
                const modulosData = modulosSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Filtrando o módulo baseado no moduloId
                const selectedModulo = modulosData.find((modulo) => modulo.id === moduloId);

                if (selectedModulo) {
                    setModulo(selectedModulo);
                    console.log("selectedModulo: ", selectedModulo); // Atualizando o estado com o módulo encontrado
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
                <Menu modulo={modulo} conteudo={conteudo} aulas={aulas} provas={provas} progressAulas={progressAulas}/>
                <Aulas modulo={modulo} conteudo={conteudo} aulas={aulas} provas={provas} progressAulas={progressAulas} userId={userId}/>
            </div>
        </div>
    )
}

export default Modulo