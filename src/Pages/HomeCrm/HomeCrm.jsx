import { useLocation, useNavigate, useParams } from 'react-router-dom'
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
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import StoryTelling from '../../Components/HomeCrm/StoryTelling/StoryTelling'
import StoryTellingDetails from '../../Components/HomeCrm/StoryTellingDetails/StoryTellingDetails'
import ModuloDetails from '../../Components/HomeCrm/ModuloDetails/ModuloDetails'
import MaterialEdit from '../../Components/HomeCrm/MaterialEdit/MaterialEdit'

function HomeCrm() {
    const { page } = useParams()
    const { conteudoId } = useParams()
    const { moduloId } = useParams()
    const { type } = useParams()
    const { materialId } = useParams()
    const location = useLocation();
    const [userId, setUserId] = useState('')
    const navigate = useNavigate()
    const [userType, setUserType] = useState(null)

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(firestore, 'users', userId);
            await updateDoc(userRef, { isActive: true });
        }
    });

    useEffect(() => {
        console.log(location)
    }, [location])

    useEffect(() => {
        const sessao = Cookies.get('accessToken');
        if (!sessao) {
            navigate('/login/professor');
        }
    }, [userType, navigate]);

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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = doc(firestore, "users", userId);
                const docSnap = await getDoc(userDoc);
        
                if (docSnap.exists()) {
                    setUserType(docSnap.data().type)
                } else {
                    console.log("Nenhum usuário encontrado!");
                }
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
            }
        };
    
        if (userId) {
            fetchUserData();
        }
    }, [userId]);


    return (
        <div className='containerHomeCrm'>
            <Header userId={userId}/>
            <div className='divContent'>
                <MenuDash page={page} conteudoId={conteudoId} moduloId={moduloId}/>
                <div className='divPages'>
                    {page === 'dashboard' && <DashProf />}
                    {page === 'alunos' && <Alunos userType={userType}/>}
                    {page === 'turmas' && <Turmas />}
                    {page === 'modulos' && <Modulos userType={userType}/>}
                    {page === 'usuarios' && <Usuarios userType={userType}/>}
                    {page === 'storytelling' && <StoryTelling userType={userType} />}
                    {location.pathname === `/professor/storytelling/${conteudoId}` && <StoryTellingDetails conteudoId={conteudoId}/>}
                    {location.pathname === `/professor/modulos/${moduloId}` && <ModuloDetails userType={userType} moduloId={moduloId}/>}
                    {location.pathname === `/professor/modulos/${moduloId}/${type}/${materialId}` && <MaterialEdit />}
                </div>
            </div>
        </div>
    )
}

export default HomeCrm;
