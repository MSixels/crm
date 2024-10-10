import { useParams } from 'react-router-dom'
import Menu from '../../Components/ModuloAluno/Menu/Menu'
import './Modulo.css'
import Aulas from '../../Components/ModuloAluno/Aulas/Aulas'
import Header from '../../Components/Header/Header'
import { modulos } from '../../database'

function Modulo() {
    const { moduloId } = useParams()

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

    const selectedModulo = modulos.find(m => m.id === parseInt(moduloId));
    return (
        <div className='containerModulo'>
            <Header options={options}/>
            <div className='divContent'>
                <Menu modulo={selectedModulo}/>
                <Aulas modulo={selectedModulo}/>
            </div>
        </div>
    )
}

export default Modulo