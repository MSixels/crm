import { useState } from 'react';
import InputSend from '../InputSend/InputSend';
import './ModalCreateAluno.css';
import PropTypes from 'prop-types';
import { IoClose } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import ButtonSend from '../ButtonSend/ButtonSend';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../services/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com';

function ModalCreateAluno({ title, close }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);

    const getName = (newName) => {
        setName(newName);
        if (newName !== '') {
            setNameError(false);
        }
    };

    const getEmail = (newEmail) => {
        setEmail(newEmail);
        if (newEmail !== '') {
            setEmailError(false);
        }
    };

    const generateRandomPassword = () => {
        const length = 8;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@";
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    };

    const sendEmailToSignUp = async (send) => {
        if (send) {
            if (name === '') {
                setNameError(true);
                return;
            }
            if (email === '') {
                setEmailError(true);
                return;
            }

            setNameError(false);
            setEmailError(false);
            const randomPassword = generateRandomPassword();

            createUserWithEmailAndPassword(email, randomPassword)
            .then(async (userCredential) => {
                const userId = userCredential.user.uid;

                await setDoc(doc(firestore, 'users', userId), {
                    name: name,
                    email: email,
                    type: 3,
                    userId: userId,
                    password: randomPassword,
                    isActive: false
                });
                sendEmail(name, email, randomPassword);

                close(false);
            })
            .catch((error) => {
                console.error("Erro ao criar usuário no Firebase Auth:", error);
            });
        }
    };

    const sendEmail = (name, email, password) => {
        const templateParams = {
            to_name: name,
            to_email: email,
            message: `Olá ${name}, sua conta foi criada com sucesso. Utilize o seguinte email e senha para acessar a plataforma: `,
            email: email,
            password: password,
        };

        emailjs.send('service_ald967s', 'template_ul9y5w5', templateParams, 'dWO-tVRZLU_OAvoOM')
            .then((response) => {
                console.log('Email enviado com sucesso!', response.status, response.text);
            }, (err) => {
                console.error('Erro ao enviar email:', err);
            });
    };

    return (
        <div className='containerModalCreateAluno'>
            <div className='modalCreate'>
                <div className='divheader'>
                    <h3>{title}</h3>
                    <div className='divClose'>
                        <IoClose size={25} onClick={() => close(false)} />
                    </div>
                </div>
                <InputSend title='Nome' placeH='' onSearchChange={getName} inputError={nameError} type='text' />
                <InputSend title='Email' placeH='' onSearchChange={getEmail} inputError={emailError} type='email' />
                <ButtonSend title={loading ? 'Carregando' : 'Enviar convite'} icon={<MdEmail size={20} />} action={sendEmailToSignUp} />
            </div>
        </div>
    );
}

ModalCreateAluno.propTypes = {
    title: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
};

export default ModalCreateAluno;
