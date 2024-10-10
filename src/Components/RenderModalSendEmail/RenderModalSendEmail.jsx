import './RenderModalSendEmail.css'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';
import { FaCircleCheck } from "react-icons/fa6";
import { HiMiniXMark } from "react-icons/hi2";

function RenderModalSendEmail({title, name, email, close}) {
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
        <div className={`containerRenderModalSendEmail ${show && 'activePopUpEmail'}`}>
            <div className='divIcon'>
                <FaCircleCheck size={22}/>
            </div>
            <div className='divClose' onClick={() => executeAction()}>
                <HiMiniXMark size={28}/>
            </div>
            <div className='divText'>
                <div>
                    <p className='title'>{title}</p>
                    <p className='text'>Destinatario: {name}</p>
                    <p className='text'>Email: {email}</p>
                </div>
            </div>
        </div>
    )
}
RenderModalSendEmail.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    close: PropTypes.bool.isRequired,
};

export default RenderModalSendEmail
