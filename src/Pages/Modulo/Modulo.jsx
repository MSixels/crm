import { useParams } from 'react-router-dom'
import Menu from '../../Components/ModuloAluno/Menu/Menu'
import './Modulo.css'
import Aulas from '../../Components/ModuloAluno/Aulas/Aulas'
import Header from '../../Components/Header/Header'
import { modulos } from '../../database'

function Modulo() {
    const { moduloid } = useParams()

    const options = [
        {
            id: 1,
            text: 'Seus cursos'
        },
        {
            id: 2,
            text: 'Sobre'
        },
    ]

    const selectedModulo = modulos.find(m => m.id === parseInt(moduloid));
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