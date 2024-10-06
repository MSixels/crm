import { useState } from 'react';
import InputSend from '../InputSend/InputSend';
import './ModalCreateUser.css';
import PropTypes from 'prop-types';
import { IoClose } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import ButtonSend from '../ButtonSend/ButtonSend';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../services/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoCheckbox } from "react-icons/io5";

function ModalCreateUser({ title, close }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [selectedCargo, setSelectedCargo] = useState(null);
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

    const sendEmailtoSignOut = async (send) => {
        if (send) {
            if (name === '') {
                setNameError(true);
                return;
            }
            if (email === '') {
                setEmailError(true);
                return;
            }
            if (selectedCargo === null) { 
                console.error("Cargo não selecionado.");
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
                    type: selectedCargo,
                    userId: userId,
                    password: randomPassword,
                    isActive: false
                });

                close(false);
            })
            .catch((error) => {
                console.error("Erro ao criar usuário no Firebase Auth:", error);
            });
        }
    };

    const renderCargo = () => {
        const handleSelectCargo = (cargo) => {
            setSelectedCargo(cargo); 
        };
        return (
            <div className='containerCorgo'>
                <p style={{fontSize: 18}}>Cargo:</p>
                <div className='divOptions'>
                    <div 
                        className='divOption' 
                        onClick={() => handleSelectCargo(1)}
                    >
                        <div className='divIcon'>
                            {selectedCargo === 1 ? (
                                <IoCheckbox size={25} />
                            ) : (
                                <MdCheckBoxOutlineBlank size={25} color='#1d1d1d' />
                            )}
                        </div>
                        <p>Administrador</p>
                    </div>
                    
                    <div 
                        className='divOption' 
                        onClick={() => handleSelectCargo(2)}
                    >
                        <div className='divIcon'>
                            {selectedCargo === 2 ? (
                                <IoCheckbox size={25} />
                            ) : (
                                <MdCheckBoxOutlineBlank size={25} color='#1d1d1d' />
                            )}
                        </div>
                        <p>Professor</p>
                    </div>
                </div>
            </div>
        );
    }
 
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
                {renderCargo()}
                <ButtonSend title={loading ? 'Carregando' : 'Enviar convite'} icon={<MdEmail size={20} />} action={sendEmailtoSignOut} />
            </div>
        </div>
    );
}

ModalCreateUser.propTypes = {
    title: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
};

export default ModalCreateUser;
