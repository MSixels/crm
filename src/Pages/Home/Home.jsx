import { useEffect, useState } from 'react'
import Header from '../../Components/Header/Header'
import Cursos from '../../Components/HomeAluno/Cursos/Cursos'
import HeadLine from '../../Components/HomeAluno/HeadLine/HeadLine'
import './Home.css'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { auth, firestore } from '../../services/firebaseConfig'
import Rastreios from '../../Components/HomeAluno/Rastreios/Rastreios'
import RastreiosSmall from '../../Components/HomeAluno/RastreiosSmall/RastreiosSmall'
import { onAuthStateChanged } from 'firebase/auth'
import ModalCertificado from '../../Components/HomeAluno/ModalCertificado/ModalCertificado'

function Home() {
    const navigate = useNavigate()
    const params = useParams()
    const page = params.page
    const [userId, setUserId] = useState('')
    const [userName, setUserName] = useState('usuário')
    const [userType, setUserType] = useState(null)
    const [rastreios, setRastreios] = useState([])
    const [nome, setNome] = useState('')
    const validPages = ['home', 'rastreio', 'modulos', 'certificado']; 
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
            route: '/aluno/modulos',
            status: 'active'
        },
        {
            id: 4,
            text: 'Emitir Certificado',
            route: '/aluno/certificado',
            status: 'active',
            type: 'btn'
        },
    ]

    const [modulos, setModulos] = useState([]);
    const [conteudo, setConteudo] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [provas, setProvas] = useState([]);
    const [professores, setProfessores] = useState([]);

    /*
    const insertAccess = async (userId) => {
        if(userId !== ''){
            try{
                await addDoc(collection(firestore, 'access'), {
                    userId: userId,
                    createdAt: new Date(),
                });
                //console.log('Acesso registrado com sucesso');
            } catch (error) {
                //console.log('Erro ao registrar o acesso:', error)
            }
        } else {
            //console.log('UserId não encontrado')
        }
    }

    useEffect(() => {
        insertAccess(userId)
    }, [userId])
    */

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(firestore, 'users', userId);
            await updateDoc(userRef, { isActive: true });
        }
    });
    
    useEffect(() => {
        const sessao = Cookies.get('accessToken');
        if (!sessao) {
            navigate('/login/aluno');
        }
    }, [userType, navigate]);

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            setUserId(decodedToken.user_id)
            //console.log('decodedToken.user_id: ', decodedToken.user_id)
        } else {
            //console.log("Nenhum token encontrado nos cookies.");
            navigate('/login/aluno');
        }
    }, [navigate]);

    useEffect(() => {
        getRastreios(userId)
        //console.log(userId)
    }, [userId])

    useEffect(() => {
        //console.log(rastreios)
    }, [rastreios])

    const getRastreios = async (userId) => {
        try {
            const q = query(collection(firestore, "rastreios"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            
            const allRastreios = [];
    
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    allRastreios.push(doc.data());
                });
                
                setRastreios(allRastreios);
            } else {
                //console.log("Nenhum rastreio encontrado para este usuário!");
                setRastreios([]); 
            }
        } catch (error) {
            //console.error("Erro ao buscar rastreios:", error);
        }
    }
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = doc(firestore, "users", userId);
                const docSnap = await getDoc(userDoc);
        
                if (docSnap.exists()) {
                    setUserName(docSnap.data().name?.split(" ")[0]);
                    setNome(docSnap.data().name)
                    setUserType(docSnap.data().type)
                } else {
                    //console.log("Nenhum usuário encontrado!");
                }
            } catch (error) {
                //console.error("Erro ao buscar usuário:", error);
            }
        };
    
        if (userId) {
          fetchUserData();
        }
    }, [userId]);

    useEffect(() => {
        const fetchProfessorData = async () => {
            try {
                const q = query(collection(firestore, "users"), where("type", "in", [1, 2]));
                const querySnapshot = await getDocs(q);

                const professorArray = [];
                querySnapshot.forEach((doc) => {
                    professorArray.push({ id: doc.id, ...doc.data() });
                });

                setProfessores(professorArray); 
                //console.log('professorArray: ', professorArray)
            } catch (error) {
                //console.error("Erro ao buscar dados:", error);
            }
        };

        fetchProfessorData();
    }, []);

    useEffect(() => {
        const fetchModulosData = async () => {
            try {
                const modulosSnapshot = await getDocs(collection(firestore, 'modulos'));
                const modulosData = modulosSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setModulos(modulosData);
                //console.log('modulosData: ', modulosData)
            } catch (error) {
                //console.error('Erro ao carregar modulos:', error);
            }
        };
    
        fetchModulosData();
    }, []);
    useEffect(() => {
        const fetchConteudoData = async () => {
            try {
                const conteudoSnapshot = await getDocs(collection(firestore, 'conteudo'));
                const conteudoData = conteudoSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setConteudo(conteudoData);
                //console.log('conteudoData: ', conteudoData);
            } catch (error) {
                //console.error('Erro ao carregar conteudo:', error);
            }
        };
    
        fetchConteudoData();
    }, []);
    useEffect(() => {
        const fetchAulasData = async () => {
            try {
                const aulasSnapshot = await getDocs(collection(firestore, 'aulas'));
                const aulasData = aulasSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    conteudoId: doc.data().conteudoId,
                }));
                setAulas(aulasData);  // Define o estado com os dados das aulas
                //console.log('aulasData: ', aulasData);  // Verifica o array no //console
            } catch (error) {
                //console.error('Erro ao carregar aulas:', error);
            }
        };

        fetchAulasData();
    }, []);
    useEffect(() => {
        const fetchProvasData = async () => {
            try {
                const provasSnapshot = await getDocs(collection(firestore, 'provas'));
                const provasData = provasSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    conteudoId: doc.data().conteudoId,
                }));
                setProvas(provasData);  
                //console.log('provasData: ', provasData);  
            } catch (error) {
                //console.error('Erro ao carregar provas:', error);
            }
        };

        fetchProvasData();
    }, []);

    if (!validPages.includes(page)) {
        return null;
    }

    const fetchCometario = (confirm) => {
        if(confirm){
            getRastreios(userId)
        }
    }

    return (
        <div className='containerHome'>
            <Header options={options} />
            {page === 'home' && 
                <div className='divContentHome'>
                    <div className='borderB'>
                        <HeadLine userName={userName}/>
                    </div>
                    <div className='borderB'>
                        <Cursos modulos={modulos} conteudo={conteudo} aulas={aulas} provas={provas} professores={professores} userId={userId}/>
                    </div>
                    <RastreiosSmall data={[rastreios]}/>
                </div>
            }
            {page === 'rastreio' && 
                <div className='divContentHome'>
                    <Rastreios data={[rastreios]} userName={nome} fetchRestreios={fetchCometario}/>
                </div>
            }
            {page === 'modulos' && 
                <div className='divContentHome'>
                    <Cursos modulos={modulos} conteudo={conteudo} aulas={aulas} provas={provas} professores={professores} userId={userId}/>
                </div>
            }
            {page === 'aovivo' && 
                <div className='divContentHome'>
                    Ao Vivo
                </div>
            }
            {page === 'certificado' && 
                <div className='divContentHome'>
                    <ModalCertificado userId={userId}/>
                </div>
            }
        </div>
    )
}

export default Home;
