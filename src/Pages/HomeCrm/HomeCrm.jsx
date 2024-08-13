import { useParams } from 'react-router-dom'
import DashProf from '../../Components/HomeCrm/DashProf/DashProf'
import MenuDash from '../../Components/HomeCrm/Menu/MenuDash'
import Header from '../../Components/Header/Header'
import './HomeCrm.css'
import Alunos from '../../Components/HomeCrm/Alunos/Alunos'
import Turmas from '../../Components/HomeCrm/Turmas/Turmas'
import Modulos from '../../Components/HomeCrm/Modulos/Modulos'
import Usuarios from '../../Components/HomeCrm/Usuarios/Usuarios'

function HomeCrm() {
    const { page } = useParams()
    
    return (
        <div className='containerHomeCrm'>
            <Header />
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