import { FaCirclePlus } from 'react-icons/fa6'
import ButtonBold from '../../ButtonBold/ButtonBold'
import InputText from '../../InputText/InputText'
import './Turmas.css'

function Turmas() {
    const header = [
        {
            id: 1,
            title: 'Nome'
        },
        {
            id: 2,
            title: 'Alunos'
        },
        {
            id: 3,
            title: 'Início'
        },
        {
            id: 4,
            title: 'Fim'
        },
    ]
    return(
        <div className='containerTurmas'>
            <h1>Turmas</h1>
            <div className='divContent'>
                <div className='header'>
                    <div className='divInputs'>
                        <InputText title='Pesquisa na lista' placeH='Nome da turma'/>
                    </div>
                    <ButtonBold title='Nova turma' icon={<FaCirclePlus size={20}/>}/>
                </div>
                <div className='divInfos'>
                    <div className='divHeader'>
                        {header.map((h) => (
                            <div key={h.id} className='title'>
                                <span className='bold'>{h.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Turmas