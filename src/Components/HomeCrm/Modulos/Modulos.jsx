import { FaCirclePlus } from 'react-icons/fa6'
import ButtonBold from '../../ButtonBold/ButtonBold'
import InputText from '../../InputText/InputText'
import './Modulos.css'
import { useEffect, useState } from 'react'
import ModalCreateModulo from '../../ModalCreateModulo/ModalCreateModulo'

function Modulos() {
    const [showModal, setShowModal] = useState(false)

    const clickBtn = (openModal) => {
        setShowModal(openModal)
    }

    const closeBtn = (close) => {
        setShowModal(close)
    }
    const header = [
        { title: 'Nome' },
        { title: 'Turmas' },
        { title: 'Alunos' },
        { title: 'Professor' },
    ]

    

    useEffect(() => {
        
        
    }, [])
    return(
        <div className='containerModulos'>
            {showModal && <ModalCreateModulo title='Novo Módulo' close={closeBtn}/> }
            <h1>Módulos</h1>
            <div className='divContent'>
                <div className='header'>
                    <div className='divInputs'>
                        <InputText title='Pesquisa pora' placeH='Nome do módulo'/>
                    </div>
                    <ButtonBold title='Novo módulo' icon={<FaCirclePlus size={20}/>} action={clickBtn}/>
                </div>
                <div className='divInfos'>
                    <div className='divHeader'>
                        {header.map((h, index) => (
                            <div key={index} className='title'>
                                <span className='bold'>{h.title}</span>
                            </div>
                        ))}
                    </div>
                    
                </div>
                
            </div>
        </div>
    )
}

export default Modulos