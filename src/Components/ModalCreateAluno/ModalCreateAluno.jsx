import { useState } from 'react';
import InputSend from '../InputSend/InputSend';
import './ModalCreateAluno.css';
import PropTypes from 'prop-types';
import { IoClose } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import ButtonSend from '../ButtonSend/ButtonSend';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../services/firebaseConfig';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import InputCPF from '../InputCPF/InputCPF';
import { isValidCPF } from '../../functions/functions'


function ModalCreateAluno({ title, close }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [matricula, setMatricula] = useState('');
    const [unidade, setUnidade] = useState('')

    const [emailError, setEmailError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [cpfError, setCpfError] = useState(false);
    const [
        createUserWithEmailAndPassword,
        loading,
    ] = useCreateUserWithEmailAndPassword(auth);
    const [loadingEmail, setLoadingEmail] = useState(false)

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

    const getCpf = (newCpf) => {
        setCpf(newCpf)
        if(newCpf !== '') {
            setCpfError(false)
        }
    }

    const getMatricula = (newMatricula) => {
        setMatricula(newMatricula)
    }

    const getUnidade = (newUnidade) => {
        setUnidade(newUnidade)
    }

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

            if(!isValidCPF(cpf)) {
                setCpfError(true)
            }

            setNameError(false);
            setEmailError(false);
            setCpfError(false)
    
            try {
                setLoadingEmail(true)
                const usersRef = collection(firestore, 'users');
                const emailQuery = query(usersRef, where('email', '==', email));
                const cpfQuery = query(usersRef, where('cpf', '==', cpf))
                const emailSnapshot = await getDocs(emailQuery);
                const cpfSnapshot = await getDocs(cpfQuery);
    
                if (!emailSnapshot.empty) {
                    
                    alert("E-mail já cadastrado.");
                    return;
                }

                if(!cpfSnapshot.empty) {
                    alert("CPF já cadastrado.");
                    return;
                }
    
                const randomPassword = generateRandomPassword();
    
                await sendEmail(name, email, randomPassword);
    
                createUserWithEmailAndPassword(email, randomPassword)
                    .then(async (userCredential) => {
                        const userId = userCredential.user.uid;
    
                        await setDoc(doc(firestore, 'users', userId), {
                            name: name,
                            email: email,
                            type: 3,
                            userId: userId,
                            isActive: false,
                            missingData: !matricula || !unidade,
                            cpf,
                            matricula, 
                            unidade
                        });
                        alert("Aluno cadastrado com sucesso!");
                        setLoadingEmail(false)
                        close(false);
                    })
                    .catch((error) => {
                        console.error("Erro ao criar usuário no Firebase Auth:", error);
                    });
    
            } catch (error) {
                console.error('Erro ao verificar ou enviar e-mail:', error);
            }
        }
    };
    
    

    const sendEmail = (name, email, password) => {
        return new Promise((resolve, reject) => {
            const serviceID = 'service_bbm4g9c';
            const templateID = 'template_ul9y5w5'; 
            const userID = 'dWO-tVRZLU_OAvoOM';

            const alunoName = () => {
                if(name === ''){
                    return 'Aluno'
                } else {
                    return name
                }
            }
    
            const templateParams = {
                to_name: alunoName(),
                to_email: email,
                to_password: password,
                to_type: 'aluno',
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

    
    
    return (
        <div className='containerModalCreateAluno'>
            <div className='modalCreate'>
                <div className='divheader'>
                    <h3>{title}</h3>
                    <div className='divClose'>
                        <IoClose size={25} onClick={() => close(false)} />
                    </div>
                </div>
                <InputCPF title='CPF' placeH='' onSearchChange={getCpf} inputError={cpfError}></InputCPF>
                <InputSend title='Nome completo' placeH='' onSearchChange={getName} inputError={nameError} type='text' />
                <InputSend title='E-mail de acesso' placeH='' onSearchChange={getEmail} inputError={emailError} type='email' />
                <div className='containerInputs'>
                    <InputSend title='Nº de matrícula' placeH='' onSearchChange={getMatricula} type='text' />
                    <InputSend title='Unidade' placeH='' onSearchChange={getUnidade} type='text' />
                </div>
                <p className="containerInputsWarning">Caso não preencha esse campo, o aluno deverá preenche-lo ao acessar a plataforma.</p>
                <ButtonSend title={loading || loadingEmail ? 'Carregando' : 'Enviar convite'} icon={<MdEmail size={20} />} action={sendEmailToSignUp} />
            </div>
        </div>
    );
}

ModalCreateAluno.propTypes = {
    title: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
};

export default ModalCreateAluno;
