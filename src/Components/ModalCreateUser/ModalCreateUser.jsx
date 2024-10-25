import { useState } from 'react';
import InputSend from '../InputSend/InputSend';
import './ModalCreateUser.css';
import PropTypes from 'prop-types';
import { IoClose } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import ButtonSend from '../ButtonSend/ButtonSend';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../services/firebaseConfig';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoCheckbox } from "react-icons/io5";
import emailjs from 'emailjs-com';

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
        const charset = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789@";
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

            try {
                const usersRef = collection(firestore, 'users');
                const emailQuery = query(usersRef, where('email', '==', email));
                const querySnapshot = await getDocs(emailQuery);
    
                if (!querySnapshot.empty) {
                    
                    alert("E-mail já cadastrado.");
                    return;
                }
                
                await sendEmail(name, email, randomPassword);
                
                createUserWithEmailAndPassword(email, randomPassword)
                .then(async (userCredential) => {
                    const userId = userCredential.user.uid;

                    await setDoc(doc(firestore, 'users', userId), {
                        name: name,
                        email: email,
                        type: selectedCargo,
                        userId: userId,
                        isActive: false
                    });

                    close(false);
                })
                .catch((error) => {
                    console.error("Erro ao criar usuário no Firebase Auth:", error);
                });
                
    
            } catch (error) {
                console.error('Erro ao enviar e-mail:', error);
            }
        }
    };

    const sendEmail = (name, email, password) => {
        return new Promise((resolve, reject) => {
            const serviceID = 'service_bbm4g9c';
            const templateID = 'template_ul9y5w5'; 
            const userID = 'dWO-tVRZLU_OAvoOM'; 
    
            const templateParams = {
                to_name: name,
                to_email: email,
                to_password: password,
                to_type: 'professor',
                to_url: 'https://pccn.com.br'
            };
    
            emailjs.send(serviceID, templateID, templateParams, userID)
            .then((response) => {
                console.log('E-mail enviado com sucesso!', response.status, response.text);
                resolve(); 
            })
            .catch((error) => {
                console.error('Erro ao enviar e-mail:', error);
                reject(error); 
            });
        });
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
