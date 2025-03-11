import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaCircleCheck } from "react-icons/fa6";
import LogoText from '../../imgs/logoText.png'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import emailjs from 'emailjs-com';
import { auth, firestore } from '../../services/firebaseConfig';
import Cookies from 'js-cookie'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

function FirstAccessPassword() {
  const navigate = useNavigate();
  const [inputPasswordType, setInputPasswordType] = useState(false);
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  const [inputConfirmPasswordType, setInputConfirmPasswordType] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [passwordDoesNotMatch, setPasswordDoesNotMatch] = useState(false)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')

  const [
    createUserWithEmailAndPassword,
  ] = useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    setEmail(Cookies.get("email"));
  })

  const finalizeFirstAccess = async () => {
    if (!password) setPasswordError(true)
    if (!confirmPassword) setConfirmPasswordError(true)

    if (password !== confirmPassword) {
      setPasswordDoesNotMatch(true)
      setConfirmPasswordError(true)
      setPasswordError(true)
    }

    setPasswordError(false)
    setConfirmPasswordError(false)
    setPasswordDoesNotMatch(false)

    const name = Cookies.get("name")
    const matricula = Cookies.get("matricula")
    const unidadeDeEnsino = Cookies.get("unidadeDeEnsino")
    const cpf = Cookies.get("cpf");

    const turmaId = await getActiveTurma()

    const userCredential = await createUserWithEmailAndPassword(email, password);
    const userId = userCredential.user.uid;
    await setDoc(doc(firestore, 'users', userId), {
      name: name,
      email: email,
      matricula: matricula,
      type: 3,
      userId: userId,
      isActive: false,
      unidadeDeEnsino,
      cpf,
      turmaId
    });

    await sendEmail(name, email, password);
    setSuccess(true)
  }

  const sendEmail = (name, email, password) => {
    return new Promise((resolve, reject) => {
      const serviceID = 'service_bbm4g9c';
      const templateID = 'template_ul9y5w5';
      const userID = 'dWO-tVRZLU_OAvoOM';

      const alunoName = () => {
        if (name === '') {
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

  const getActiveTurma = async () => {
    const turmasRef = collection(firestore, 'turmas');
    const turmaQuery = query(turmasRef, where('active', '==', true));
    const querySnapshot = await getDocs(turmaQuery);
    return querySnapshot.docs[0].id
  }

  const renderSuccess = () => {
    return (
      <div className='success'>
        <div className='divContent'>
          <span className='title w100'>Tudo certo! <FaCircleCheck color='#222D7E' /></span>
          <span>Enviamos um e-mail para {email}. com um link de confirmação. Por favor, verifique sua caixa de entrada.</span>
          <button className='btnLoginFirst' onClick={() => navigate("/")}>Continuar para o login</button>
        </div>
      </div>
    )
  }


  return (
    <div className="containerLogin">
      {success && renderSuccess()}
      <div className='divContent'>
        <img src={LogoText} alt="logo" style={{ width: '186px' }} />
        <div className='divForm'>
          <div className='divTitle titleFisrt'>
            <span className='title titleLink'>Configure sua senha</span>
            <span className='subtitle'>Sua senha deve conter pelo menos 8 caracteres. </span>
          </div>
          <div className='divInput'>
            <label htmlFor="password" style={{ color: passwordError && 'red' }}>Senha</label>
            <input
              type={inputPasswordType ? 'text' : 'password'}
              name='password'
              id='password'
              className='input'
              value={password}
              onChange={(e) => { setPassword(e.target.value), e.target.value != setPasswordError(false) }}
              style={{ borderColor: passwordError && 'red' }}
              minLength={8}
            />
            <button className='btnEye' onClick={() => setInputPasswordType(!inputPasswordType)}>
              {inputPasswordType ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className='divInput'>
            <label htmlFor="confirmPassword" style={{ color: confirmPasswordError && 'red' }}>Confirme a senha</label>
            <input
              type={inputConfirmPasswordType ? 'text' : 'password'}
              name='confirmPassword'
              id='confirmPassword'
              className='input'
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value), e.target.value != setConfirmPasswordError(false) }}
              style={{ borderColor: confirmPasswordError && 'red' }}
              minLength={8}
            />
            <button className='btnEye' onClick={() => setInputConfirmPasswordType(!inputConfirmPasswordType)}>
              {inputConfirmPasswordType ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {passwordDoesNotMatch ? <p style={{ fontSize: '12px', color: '#D32F2F' }}>As senhas não coincidem. Tente novamente.</p> : ''}
          <button className='btnLoginFirst' onClick={() => finalizeFirstAccess()}>Confirmar nova senha</button>
          <div>
            <a href="/" className='decorationN loginLink'>Voltar para tela de login</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirstAccessPassword