import { useParams } from 'react-router-dom'
import './ModuloConteudo.css'
import Header from '../../Components/Header/Header'


function ModuloConteudo() {
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

    return (
        <div className='containerModuloConteudo'>
            <Header options={options}/>
        </div>
    )
}

export default ModuloConteudo