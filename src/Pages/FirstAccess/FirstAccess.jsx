import { useNavigate } from 'react-router-dom'
import './FirstAccess.css'
import LogoText from '../../imgs/logoText.png'
import { MdSchool } from "react-icons/md";
import { firestore } from '../../services/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useState } from 'react';
import Cookies from 'js-cookie'
import { TfiReload } from 'react-icons/tfi';

function FirstAccess() {
    const navigate = useNavigate()
    const [inputName, setInputName] = useState(false)
    const [inputMatricula, setInputMatricula] = useState(false)
    const [name, setName] = useState('')
    const [matricula, setMatricula] = useState('')
    const [alertCredentialInvalid, setAlertCredentialInvalid] = useState(false)

    const access = async () => {
        if (name === '') {
            setInputName(true);
        } else if (matricula === '') {
            setInputMatricula(true);
        } else {
            try {
                const upperCaseName = name.toUpperCase();
                const cleanedMatricula = matricula.replace(/-/g, '');
    
                // Adiciona o hífen antes do último dígito
                const formattedMatricula = cleanedMatricula.slice(0, cleanedMatricula.length - 1) + '-' + cleanedMatricula.slice(-1);
    
                const q = query(
                    collection(firestore, "alunos"),
                    where("name", "==", upperCaseName), 
                    where("matricula", "==", formattedMatricula) 
                );
    
                const querySnapshot = await getDocs(q);
    
                if (!querySnapshot.empty) {
                    Cookies.set('name', upperCaseName);
                    Cookies.set('matricula', formattedMatricula);
                    
                    navigate('/login/aluno/primeiro-acesso/email');
                    setAlertCredentialInvalid(false);
                } else {
                    setAlertCredentialInvalid(true);
                }
            } catch (error) {
                console.error("Erro ao buscar aluno:", error);
                alert('Erro ao buscar aluno.');
            }
        }
    };

    return (
        <div className='containerLogin'>
            <div className='divContent'>
                <img src={LogoText} alt="logo" style={{width: '186px'}}/>
                <div className='divForm'>
                    <div className='divTitle titleFisrt'>
                        <span className='title'>Informe os dados de acesso</span>
                        <span style={{width: '100%'}}>Você deve informar os dados que recebeu para criar sua conta.</span>
                    </div>
                    
                    <div className='divInput'>
                        <label htmlFor="name" style={{color: inputName && 'red'}}>Nome completo</label>
                        <input 
                            type="name" 
                            name='name' 
                            id='name' 
                            className='input' 
                            value={name}
                            onChange={(e) => {setName(e.target.value), e.target.value != setInputName(false)}}
                            style={{borderColor: inputName && 'red'}}
                        />
                    </div>
                    <div className='divInput'>
                        <label htmlFor="matricula" style={{color: inputMatricula && 'red'}}>Número de matrícula</label>
                        <input 
                            type='text' 
                            name='matricula' 
                            id='matricula' 
                            className='input' 
                            value={matricula}
                            onChange={(e) => {setMatricula(e.target.value), e.target.value != setInputMatricula(false)}}
                            style={{borderColor: inputMatricula && 'red'}}
                        />
                    </div>
                    {alertCredentialInvalid && 
                        <div style={{marginBottom: 20}}>
                            <p style={{color: 'red'}}>Nome ou matrícula não encontrados</p>
                            <p style={{color: 'red'}}>Tente novamente</p>
                        </div>
                    }
                    <button className='btnLogin' onClick={access}>Confirmar</button>
                    <a href="/" className='decorationN loginLink'>Voltar para tela de login</a>
                </div>
            </div>
        </div>
    )
}

export default FirstAccess