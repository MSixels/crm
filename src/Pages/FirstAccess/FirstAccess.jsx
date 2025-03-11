import { useNavigate } from 'react-router-dom';
import './FirstAccess.css';
import LogoText from '../../imgs/logoText.png';
import { firestore } from '../../services/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import InputCPF from '../../Components/InputCPF/InputCPF'
import InputSend from '../../Components/InputSend/InputSend'
import { isValidCPF } from '../../functions/functions'

function FirstAccess() {
    const navigate = useNavigate();
    const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true);
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [nameError, setNameError] = useState(false);
    const [cpfError, setCpfError] = useState(false);
    const [cpfErrorMessage, setCpfErrorMessage] = useState("")
    const [user, setUser] = useState(null);

    useEffect(() => {
        if(cpf) {
            setIsConfirmButtonDisabled(false);
        }
    }, [cpf])

    const getName = (newName) => {
        setName(newName);
        if (newName !== '') {
            setNameError(false);
        }
    };

    const getCpf = (newCpf) => {
        setCpf(newCpf)
        if(newCpf !== '') {
            setCpfError(false)
        }
    }

    const validateCPF = async () => {
        setName("");
        setCpfError(false);

        if(!isValidCPF(cpf)) {
           setCpfError(true);
           setCpfErrorMessage("CPF Inválido. Corrija a informação ou fale com o suporte.")
           return;
        }

        const cleanedCpf = cpf.replace(/\D/g, '');
        const q = query(collection(firestore, "alunos"), where('cpf', '==', cleanedCpf))
        const querySnapshot = await getDocs(q);
        let userFound = querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : null;

        if(userFound) {
            setUser(userFound);
            setName(userFound.name)
            setCpfError(false);
        }
        else {
            setCpfError(true)
            setCpfErrorMessage("CPF Inválido. Corrija a informação ou fale com o suporte.")
        }
    }

    const access = async () => {
        if(user) {
            Cookies.set('name', user.name);
            Cookies.set('matricula', user.matricula);
            Cookies.set('cpf', user.cpf);
            navigate('/login/aluno/primeiro-acesso/email');
        }
    }

    return (
        <div className='containerLogin'>
            <div className='divContent'>
                <img src={LogoText} alt="logo" style={{width: '186px'}}/>
                <div className='divForm'>
                    <div className='divTitle titleFisrt'>
                        <span className='title'>Informe seus dados</span>
                        <span style={{width: '100%'}}>Seus dados estão registrados no banco de dados, precisamos valida-los.</span>
                    </div>

                    <div>
                        <InputCPF 
                            title='CPF' 
                            placeH='' 
                            onSearchChange={getCpf} 
                            inputError={cpfError} 
                            inputErrorMessage={cpfErrorMessage} 
                            onBlur={validateCPF}
                        >
                        </InputCPF>
                        <InputSend title='Nome completo' placeH='' onSearchChange={getName} inputError={nameError} type='text' disabled={true} inputValue={name} />
                    </div>

                    <button className={`btnLogin ${isConfirmButtonDisabled && 'block'}`} onClick={access} disabled={isConfirmButtonDisabled}>Continuar</button>
                    <a href="/" className='decorationN loginLink'>Voltar para tela de login</a>
                </div>
            </div>
        </div>
    );
}

export default FirstAccess;
