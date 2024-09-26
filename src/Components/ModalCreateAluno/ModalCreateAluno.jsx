import { useState } from 'react';
import ButtonBold from '../ButtonBold/ButtonBold';
import InputSend from '../InputSend/InputSend';
import './ModalCreateAluno.css'
import PropTypes from 'prop-types'
import { IoClose } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import ButtonSend from '../ButtonSend/ButtonSend';

function ModalCreateAluno({title, close}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [nameError, seNameError] = useState(false)

    const getName = (newName) => {
        setName(newName);
        if(newName != ''){
            seNameError(false)
        }
    };

    const getEmail = (newEmail) => {
        setEmail(newEmail);
        if(newEmail != ''){
            setEmailError(false)
        }
    };

    const sendEmail = (send) => {
        if(send){
            if(name === ''){
                seNameError(true)
                return
            } if(email === ''){
                setEmailError(true)
                return
            } else {
                seNameError(false)
                setEmailError(false)
                //salvar aluno da db
                close(false)
            }
        }
    }

    return (
        <div className='containerModalCreateAluno'>
            <div className='modalCreate'>
                <div className='divheader'>
                    <h3>{title}</h3>
                    <div className='divClose'>
                        <IoClose size={25} onClick={() => close(false)}/>
                    </div>
                </div>
                <InputSend title='Nome' placeH='' onSearchChange={getName} inputError={nameError}/>
                <InputSend title='Email' placeH='' onSearchChange={getEmail} inputError={emailError}/>
                <ButtonSend  title='Enviar convite' icon={<MdEmail size={20}/>} action={sendEmail}/>
            </div>
        </div>
    )
}

ModalCreateAluno.propTypes = {
    title: PropTypes.string.isRequired,
    inputs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
    })).isRequired,
    //onChange: PropTypes.func.isRequired,
    close: PropTypes.string.isRequired
};

export default ModalCreateAluno