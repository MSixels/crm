import { useState } from 'react';
import ButtonBold from '../ButtonBold/ButtonBold';
import InputSend from '../InputSend/InputSend';
import './ModalCreateAluno.css'
import PropTypes from 'prop-types'
import { IoClose } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import ButtonSend from '../ButtonSend/ButtonSend';
import { supabase } from '../../../lib/supabase';


function ModalCreateAluno({title, close}) {
    const [nameInput, setNameInput] = useState('')
    const [emailInput, setEmailInput] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [nameError, seNameError] = useState(false)

    const getName = (newName) => {
        setNameInput(newName);
        if(newName != ''){
            seNameError(false)
        }
    };

    const getEmail = (newEmail) => {
        setEmailInput(newEmail);
        if(newEmail != ''){
            setEmailError(false)
        }
    };

    const sendEmail = (send) => {
        if(send){
            if(nameInput === ''){
                seNameError(true)
                return
            } if(emailInput === ''){
                setEmailError(true)
                return
            } else {
                console.log(emailInput)
                console.log(nameInput)
                seNameError(false)
                setEmailError(false)
                signUpWithEmail({ name: nameInput, email: emailInput, password: '12345678' });
                close(false)
            }
        }
    }

    async function signUpWithEmail({ name, email, password }) {
        try {
            console.log('email no supabase: ', email)
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
    
            if (error) {
                alert(`Deu erro ${error}`);
                return;
            }
    
            if (data.user) {
                const { error: updateUsernameError } = await supabase
                    .from('profiles')
                    .update({ username: name })
                    .eq('id', data.user.id);
    
                if (updateUsernameError) {
                    console.error('Erro ao atualizar o username:', updateUsernameError);
                }
            }
        } catch (err) {
            console.error('Erro ao criar conta', err);
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
                <InputSend title='Nome' placeH='' onSearchChange={getName} inputError={nameError} type='text'/>
                <InputSend title='Email' placeH='' onSearchChange={getEmail} inputError={emailError} type='email'/>
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