import { useEffect, useState } from 'react'
import Header from '../../Components/Header/Header'
import Cursos from '../../Components/HomeAluno/Cursos/Cursos'
import HeadLine from '../../Components/HomeAluno/HeadLine/HeadLine'
import './Home.css'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../../services/firebaseConfig'
import Rastreios from '../../Components/HomeAluno/Rastreios/Rastreios'
import RastreiosSmall from '../../Components/HomeAluno/RastreiosSmall/RastreiosSmall'

function Home() {
    const navigate = useNavigate()
    const params = useParams()
    const page = params.page
    const [userId, setUserId] = useState('')
    const [userName, setUserName] = useState('usuário')
    const [rastreios, setRastreios] = useState([])
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
            text: 'Ao vivo',
            route: '/aluno/aovivo',
            status: 'block'
        },
    ]

    useEffect(() => {
        const sessao = Cookies.get('accessToken');
        if (sessao) {
            return;
        } else {
            navigate('/login/aluno');
        }
    }, [navigate]);

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
        getRastreios(userId)
        console.log(userId)
    }, [userId])

    useEffect(() => {
        console.log(rastreios)
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
                console.log("Nenhum rastreio encontrado para este usuário!");
                setRastreios([]); 
            }
        } catch (error) {
            console.error("Erro ao buscar rastreios:", error);
        } finally {
            //setLoading(false); 
        }
    }
    

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = doc(firestore, "users", userId);
                const docSnap = await getDoc(userDoc);
        
                if (docSnap.exists()) {
                setUserName(docSnap.data().name?.split(" ")[0]);
                } else {
                console.log("Nenhum usuário encontrado!");
                }
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
            } finally {
                //setLoading(false); 
            }
        };
    
        if (userId) {
          fetchUserData();
        }
      }, [userId]);
    return (
        <div className='containerHome'>
            <Header options={options} />
            {page === 'home' && 
                <div className='divContentHome'>
                    <div className='borderB'>
                        <HeadLine userName={userName}/>
                    </div>
                    <div className='borderB'>
                        <Cursos />
                    </div>
                    <RastreiosSmall data={[rastreios]}/>
                </div>
            }
            {page === 'rastreio' && 
                <div className='divContentHome'>
                    <Rastreios data={[rastreios]}/>
                </div>
            }
            {page === 'modulos' && 
                <div className='divContentHome'>
                    <Cursos />
                </div>
            }
            {page === 'aovivo' && 
                <div className='divContentHome'>
                    Ao Vivo
                </div>
            }
        </div>
    )
}

export default Home