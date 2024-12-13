import './FirstAccessEmail.css'
import LogoText from '../../imgs/logoText.png'
import { auth, firestore } from '../../services/firebaseConfig';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import Cookies from 'js-cookie'
import { FaCircleCheck } from "react-icons/fa6";

function FirstAccess() {
    const [inputEmail, setInputEmail] = useState(false)
    const [email, setEmail] = useState('')
    const [
        createUserWithEmailAndPassword,
        loading,
    ] = useCreateUserWithEmailAndPassword(auth);
    const [name, setName] = useState('')
    const [matricula, setMatricula] = useState()
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        // Obtendo os valores dos cookies
        const cookieName = Cookies.get('name');
        const cookieMatricula = Cookies.get('matricula');

        // Setando os estados com os valores dos cookies, caso existam
        if (cookieName) setName(cookieName);
        if (cookieMatricula) setMatricula(cookieMatricula);
    }, [])

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
    
            if (email === '') {
                setInputEmail(true);
                return;
            }
    
            setInputEmail(false);
    
            try {
                const usersRef = collection(firestore, 'users');
                const emailQuery = query(usersRef, where('email', '==', email));
                const querySnapshot = await getDocs(emailQuery);
    
                if (!querySnapshot.empty) {
                    alert("E-mail já cadastrado.");
                    return;
                }
    
                const randomPassword = generateRandomPassword();
    
                const userCredential = await createUserWithEmailAndPassword(email, randomPassword);
                const userId = userCredential.user.uid;
    
                await setDoc(doc(firestore, 'users', userId), {
                    name: name,
                    email: email,
                    matricula: matricula,
                    type: 3,
                    userId: userId,
                    isActive: false
                });
    
                await sendEmail(name, email, randomPassword);
    
                close(false);
    
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
                setSuccess(true)
                console.log('E-mail enviado com sucesso!', response.status, response.text);
                resolve(); 
            })
            .catch((error) => {
                console.error('Erro ao enviar e-mail:', error);
                reject(error); 
            });
        });
    };

    const renderSuccess = () => {
        return(
            <div className='success'>
                <div className='divContent'>
                    <span className='title w100'>Tudo certo! <FaCircleCheck color='#222D7E'/></span>
                    <span>Enviamos um e-mail para {email} com seus dados de login. Por favor, verifique sua caixa de entrada</span>
                    <a href="/" className='btnLogin w100 textDN'>Voltar para área de login</a>
                </div>
            </div>
        )
    }
    
    return (
        <div className='containerLogin'>
            {success && renderSuccess()}
            <div className='divContent'>
                <img src={LogoText} alt="logo" style={{width: '186px'}}/>
                <div className='divForm'>
                    <div className='divTitle titleFisrt'>
                        <span className='title titleLink'>Informe seu e-mail de acesso</span>
                    </div>
                    <div className='divInput'>
                        <label htmlFor="email" style={{color: inputEmail && 'red'}}>E-mail</label>
                        <input 
                            type="email" 
                            name='email' 
                            id='email' 
                            className='input' 
                            value={email}
                            onChange={(e) => {setEmail(e.target.value), e.target.value != setInputEmail(false)}}
                            style={{borderColor: inputEmail && 'red'}}
                        />
                    </div>
                    <button className='btnLoginFirst' onClick={() => sendEmailToSignUp(true)}>{loading ? 'Carregando' : 'Continuar'}</button>
                    <div>
                        <a href="/" className='decorationN loginLink'>Voltar para tela de login</a>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default FirstAccess