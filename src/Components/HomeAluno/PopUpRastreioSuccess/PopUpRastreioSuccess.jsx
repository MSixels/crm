import './PopUpRastreioSuccess.css'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';
import { FaCircleCheck } from "react-icons/fa6";
import { HiMiniXMark } from "react-icons/hi2";

function PopUpRastreioSuccess({title, name, idade, details, close}) {
    const [show, setShow] = useState(false)
    const executeAction = () => {
        close(true)
    }

    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 500)
        
        setTimeout(() => {
            setShow(false)
        }, 9000)
    }, [])
    return (
        <div className={`containerPopUpRastreioSuccess ${show && 'activePopUpRastreio'}`}>
            <div className='divIcon'>
                <FaCircleCheck size={22}/>
            </div>
            <div className='divClose' onClick={() => executeAction()}>
                <HiMiniXMark size={28}/>
            </div>
            <div className='divText'>
                <div>
                    <p className='title'>{title}</p>
                    <p className='text'>{name}</p>
                    <p className='text'>{idade}</p>
                </div>
                <p className='small'>{details}</p>
            </div>
        </div>
    )
}
PopUpRastreioSuccess.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    idade: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    close: PropTypes.bool.isRequired,
};

export default PopUpRastreioSuccess