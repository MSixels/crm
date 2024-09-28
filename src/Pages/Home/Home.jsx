import { useEffect, useState } from 'react'
import Header from '../../Components/Header/Header'
import Cursos from '../../Components/HomeAluno/Cursos/Cursos'
import HeadLine from '../../Components/HomeAluno/HeadLine/HeadLine'
import './Home.css'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '../../services/firebaseConfig'

function Home() {
    const navigate = useNavigate()
    const params = useParams()
    const page = params.page
    const [userId, setUserId] = useState('')
    const [userName, setUserName] = useState('usuário')
    const options = [
        {
            id: 1,
            text: 'Rastreio',
            route: '/aluno/rastreio'
        },
        {
            id: 2,
            text: 'Seus cursos',
            route: '/aluno/home'
        },
        
        {
            id: 3,
            text: 'Ao vivo',
            route: '/aluno/aovivo'
        },
        {
            id: 4,
            text: 'Sobre',
            route: '/aluno/sobre'
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
                    <HeadLine userName={userName}/>
                    <Cursos />
                </div>
            }
            {page === 'rastreio' && 
                <div className='divContentHome'>
                    <HeadLine userName={userName}/>
                    Rastreio
                </div>
            }
            {page === 'aovivo' && 
                <div className='divContentHome'>
                    <HeadLine userName={userName}/>
                    Ao Vivo
                </div>
            }
            {page === 'sobre' && 
                <div className='divContentHome'>
                    <HeadLine userName={userName}/>
                    Sobre
                </div>
            }
        </div>
    )
}

export default Home