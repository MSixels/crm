import { useParams } from 'react-router-dom'
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

function HomeCrm() {
    const { page } = useParams()
    const [userId, setUserId] = useState('')

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
            //console.log("Access Token:", accessToken);
            const decodedToken = jwtDecode(accessToken);
            //console.log("Decoded Token:", decodedToken);
            //console.log("UID:", decodedToken.user_id);
            setUserId(decodedToken.user_id)
        } else {
            console.log("Nenhum token encontrado nos cookies.");
        }
    }, []);
    
    return (
        <div className='containerHomeCrm'>
            <Header userId={userId}/>
            <div className='divContent'>
                <MenuDash page={page}/>
                {page === 'dashboard' && <DashProf />}
                {page === 'alunos' && <Alunos />}
                {page === 'turmas' && <Turmas />}
                {page === 'modulos' && <Modulos />}
                {page === 'usuarios' && <Usuarios />}
            </div>
        </div>
    )
}

export default HomeCrm