import { useNavigate, useParams } from 'react-router-dom'
import DashProf from '../../Components/HomeCrm/DashProf/DashProf'
import MenuDash from '../../Components/HomeCrm/Menu/MenuDash'
import Header from '../../Components/Header/Header'
import './HomeCrm.css'
import Alunos from '../../Components/HomeCrm/Alunos/Alunos'
import Turmas from '../../Components/HomeCrm/Turmas/Turmas'
import Modulos from '../../Components/HomeCrm/Modulos/Modulos'
import Usuarios from '../../Components/HomeCrm/Usuarios/Usuarios'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { auth, firestore } from '../../services/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'

function HomeCrm() {
    const { page } = useParams()
    const [userId, setUserId] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const sessao = Cookies.get('accessToken');
        if (sessao) {
            return;
        } else {
            navigate('/login/professor');
        }
    }, [navigate]);
    

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            setUserId(decodedToken.user_id)
        } else {
            console.log("Nenhum token encontrado nos cookies.");
            navigate('/login/professor');
        }
    }, [navigate]);

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(firestore, 'users', user.uid);
            await updateDoc(userRef, { isActive: true });
        }
    });

    /*
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
    */
    
    return (
        <div className='containerHomeCrm'>
            <Header userId={userId}/>
            <div className='divContent'>
                <MenuDash page={page}/>
                <div className='divPages'>
                    {page === 'dashboard' && <DashProf />}
                    {page === 'alunos' && <Alunos />}
                    {page === 'turmas' && <Turmas />}
                    {page === 'modulos' && <Modulos />}
                    {page === 'usuarios' && <Usuarios />}
                </div>
            </div>
        </div>
    )
}

export default HomeCrm