import './Rastreios.css'
import ButtonBold from '../../ButtonBold/ButtonBold'
import { FaCirclePlus } from 'react-icons/fa6'
import { useState } from 'react'
import ModalCreateRastreio from '../../ModalCreateRastreio/ModalCreateRastreio'

function Rastreios() {
    const [showModal, setShowModal] = useState(false)

    const clickBtn = (openModal) => {
        setShowModal(openModal)
    }
    
    const closeBtn = (close) => {
        setShowModal(close)
    }
    
    return (
        <div className='containerRastreios'>
            {showModal && <ModalCreateRastreio title='Novo rastreio' close={closeBtn}/> }
            <header>
                <div>
                    <h1>Rastreios</h1>
                    <span className='subtitle'>Inicie um novo rastreio ou veja os que já foram concluídos</span>
                </div>
                <ButtonBold title='Iniciar novo rastreio' icon={<FaCirclePlus size={20}/>} action={clickBtn} />
            </header>
        </div>
    )
}

export default Rastreios