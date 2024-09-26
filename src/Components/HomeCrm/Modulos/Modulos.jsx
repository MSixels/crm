import { FaCirclePlus } from 'react-icons/fa6'
import ButtonBold from '../../ButtonBold/ButtonBold'
import InputText from '../../InputText/InputText'
import './Modulos.css'
import { useState } from 'react'
import ModalCreateModulo from '../../ModalCreateModulo/ModalCreateModulo'

function Modulos() {
    const [showModal, setShowModal] = useState(false)

    const clickBtn = (openModal) => {
        setShowModal(openModal)
    }

    const closeBtn = (close) => {
        setShowModal(close)
    }
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
            </div>
        </div>
    )
}

export default Modulos