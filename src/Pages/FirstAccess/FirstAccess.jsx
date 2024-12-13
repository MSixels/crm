import { useNavigate } from 'react-router-dom';
import './FirstAccess.css';
import LogoText from '../../imgs/logoText.png';
import { firestore } from '../../services/firebaseConfig';
import { collection, getDocs, query } from 'firebase/firestore';
import { useState } from 'react';
import Cookies from 'js-cookie';

function FirstAccess() {
    const navigate = useNavigate();
    const [inputMatricula, setInputMatricula] = useState(false);
    const [nameData, setNameData] = useState('');
    const [matriculaData, setMatriculaData] = useState('');
    const [matricula, setMatricula] = useState('');
    const [alertCredentialInvalid, setAlertCredentialInvalid] = useState(false);
    const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true);

    // Função para remover acentos e caracteres especiais
    const removeAccentsAndSpecialChars = (text) => {
        return text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[-\s]/g, ''); 
    };

    const buscarMatricula = async () => {
        if (matricula === '') {
            setInputMatricula(true);
            return;
        }

        try {
            const cleanedUserMatricula = removeAccentsAndSpecialChars(matricula);

            const q = query(collection(firestore, "alunos"));
            const querySnapshot = await getDocs(q);

            let userFound = null;

            querySnapshot.forEach(doc => {
                const dbMatricula = removeAccentsAndSpecialChars(doc.data().matricula);
                if (dbMatricula === cleanedUserMatricula) {
                    userFound = doc.data();
                }
            });

            if (userFound) {
                setNameData(userFound.name);
                setMatriculaData(userFound.matricula)
                setAlertCredentialInvalid(false);
                 
            } else {
                setAlertCredentialInvalid(true);
                setIsConfirmButtonDisabled(true); 
                setNameData('');
                setMatriculaData('') 
            }
        } catch (error) {
            console.error("Erro ao buscar aluno:", error);
            alert('Erro ao buscar aluno.');
        }
    };

    const access = async () => {
        if (!matriculaData || !nameData) {
            alert('Ocorreu um erro tente novamente')
            return
        } else {
            try {
                const q = query(collection(firestore, "alunos"));
                const querySnapshot = await getDocs(q);

                let matriculaFound = false;

                querySnapshot.forEach(doc => {
                    const dbMatricula = (doc.data().matricula); 
                    if (dbMatricula === matriculaData) {
                        matriculaFound = true;
                    }
                });

                if (matriculaFound) {
                    Cookies.set('name', nameData)
                    Cookies.set('matricula', matriculaData);
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

    const confirmUser = () => {
        setIsConfirmButtonDisabled(false);
    }

    const cancelUser = () => {
        setNameData('')
        setMatriculaData('')
        setIsConfirmButtonDisabled(true);
        setMatricula('')
    }

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
                        <label htmlFor="matricula" style={{color: inputMatricula && 'red'}}>Número de matrícula</label>
                        <input 
                            type='text' 
                            name='matricula' 
                            id='matricula' 
                            className='input' 
                            value={matricula}
                            onChange={(e) => {
                                setMatricula(e.target.value);
                                setInputMatricula(false);
                            }}
                            style={{borderColor: inputMatricula && 'red'}}
                        />
                    </div>
                    {alertCredentialInvalid && 
                        <div style={{marginBottom: 20}}>
                            <p style={{color: 'red'}}>Matrícula não encontrada</p>
                            <p style={{color: 'red'}}>Tente novamente</p>
                        </div>
                    }
                    {nameData && matriculaData && (
                        <div style={{marginBottom: 20}}>
                            <p style={{fontWeight: 'bold'}}>{nameData}</p>
                            <p>Matrícula: {matriculaData}</p>
                        </div>
                    )}
                    {nameData && matriculaData && isConfirmButtonDisabled ? 
                    (   
                        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                            <button className='btnLogin mT-20' onClick={confirmUser}>Sou eu </button>
                            <button className='btnLogin mT-20 alert' onClick={cancelUser}>Não sou eu</button>
                        </div>
                    ) : nameData && matriculaData ? '' : <button className='btnLogin' onClick={buscarMatricula}>Buscar</button>}
                    <button className={`btnLogin ${isConfirmButtonDisabled && 'block'}`} onClick={access} disabled={isConfirmButtonDisabled}>Confirmar</button>
                    <a href="/" className='decorationN loginLink'>Voltar para tela de login</a>
                </div>
            </div>
        </div>
    );
}

export default FirstAccess;
