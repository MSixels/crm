import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './Login.css'
import LogoText from '../../imgs/logoText.svg'
import { MdSchool } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa6";
import { ImCheckboxUnchecked } from "react-icons/im";
import { ImCheckboxChecked } from "react-icons/im";
import { TfiReload } from "react-icons/tfi";
import { useEffect, useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode';

function Login() {
    const navigate = useNavigate()
    const { type } = useParams()
    const location = useLocation()
    const [userId, setUserId] = useState('')
    const [alertText, setAlertText] = useState(false)
    const [checkConect, setCheckConect] = useState(false)
    const [inputEmail, setInputEmail] = useState(false)
    const [inputSenha, setInputSenha] = useState(false)
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [typeUser, setTypeUser] = useState(null)
    const [alertCredentialInvalid, setAlertCredentialInvalid] = useState(false)
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);

    const openHome = (email, senha) => {
        if(email === ''){
            setInputEmail(true)
        }
        if(senha === ''){
            setInputSenha(true)
        }
        if(email != '' && senha != ''){
            signInWithEmailAndPassword(email, senha)
        }
    }

    useEffect(() => {
        if (error) {
            setInputEmail(true)
            setInputSenha(true)
            setAlertCredentialInvalid(true); 
            console.error("Erro de autenticação:", error.message); 
        } else {
            setInputEmail(false)
            setInputSenha(false)
            setAlertCredentialInvalid(false); 
        }
    }, [error]);

    const fetchUserType = async (userId) => {
        try {
            const userDocRef = doc(firestore, 'users', userId); 
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log("Tipo de usuário:", userData.type);
                setTypeUser(userData.type)
            } else {
                console.log("Usuário não encontrado no Firestore");
            }
        } catch (err) {
            console.log("Erro ao buscar dados do usuário:");
        }
    };

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            console.log(decodedToken.user_id)
            setUserId(decodedToken.user_id)

        } else {
            console.log("Nenhum token encontrado nos cookies.");
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = doc(firestore, "users", userId);
                const docSnap = await getDoc(userDoc);
        
                if (docSnap.exists()) {
                    console.log(docSnap.data().type)
                    const sessao = Cookies.get('accessToken')
                    if (
                        sessao && docSnap.data().type === 3 && 
                        location.pathname === '/login/aluno'
                    ) {
                        navigate('/aluno/home');
                    } else if(
                        sessao && location.pathname === '/login/professor' && 
                        docSnap.data().type === 1 || docSnap.data().type === 2
                    ) {
                        navigate('/professor/alunos');
                    }
                } else {
                    console.log("Nenhum usuário encontrado!");
                }
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
            }
        };
    
        if (userId) {
          fetchUserData();
        }

    }, [userId, navigate, location]);

    useEffect(() => {
        console.log(location.pathname)
    }, [location])

    useEffect(() => {
        if (user) {
            console.log("Usuário logado:", user);
            console.log("Access Token:", user.user.accessToken);
            fetchUserType(user.user.uid);
            const accessToken = user.user.accessToken;
    
            if (checkConect) {
                Cookies.set('accessToken', accessToken, { expires: 7 });
            } else {
                Cookies.set('accessToken', accessToken, { expires: null }); 
            }
        } else{
            console.log('user não encontrado')
        }
    }, [user, type, navigate, checkConect]);

    useEffect(() => {
        if(user && typeUser){
            if (type === 'aluno' && typeUser === 3) {
                navigate(`/${type}/home`);
            } else if(type === 'professor' && typeUser === 2){
                navigate(`/${type}/alunos`);
            } else if (type === 'professor' && typeUser === 1){
                navigate(`/${type}/alunos`);
            } else {
                setInputEmail(true)
                setInputSenha(true)
                setAlertText(true)
                setTypeUser(null)
                Cookies.remove('accessToken');
            }
        }
    }, [typeUser, user, type, navigate])

    const notPermission = async (route) => {
        Cookies.remove('accessToken')
        navigate(route)
    }

    return (
        <div className='containerLogin'>
            <div className='divContent'>
                <img src={LogoText} alt="logo" />
                <div className='divForm'>
                    <div className='divTitle'>
                        <div className='divIcon'>
                            {type === 'aluno' ? <MdSchool size={25}/> : <FaBookOpen size={25}/>}
                        </div>
                        <span className='title'>{type === 'aluno' ? 'Portal do aluno' : 'Portal do professor'}</span>
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
                    <div className='divInput'>
                        <label htmlFor="password" style={{color: inputSenha && 'red'}}>Senha</label>
                        <input 
                            type="password" 
                            name='password' 
                            id='password' 
                            className='input' 
                            value={senha}
                            onChange={(e) => {setSenha(e.target.value), e.target.value != setInputSenha(false)}}
                            style={{borderColor: inputSenha && 'red'}}
                        />
                    </div>
                    {alertText && type === 'professor' &&
                        <div style={{marginBottom: 20}}>
                            <p style={{color: 'red'}}>Você não possui as permissões necessárias para acessar.</p>
                            <p style={{color: 'red'}}>Vá para <span style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}} onClick={() => notPermission(`/`)}>portal do aluno</span> e tente novamente</p>
                        </div>
                    }
                    {alertText && type === 'aluno' &&
                        <div style={{marginBottom: 20}}>
                            <p style={{color: 'red'}}>Você não possui as permissões necessárias para acessar.</p>
                            <p style={{color: 'red'}}>Vá para <span style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}} onClick={() => notPermission(`/`)}>portal do professor</span> e tente novamente</p>
                        </div>
                    }
                    {alertCredentialInvalid && 
                        <div style={{marginBottom: 20}}>
                            <p style={{color: 'red'}}>Email ou senha incorretos</p>
                            <p style={{color: 'red'}}>Tente novamente</p>
                        </div>
                    }
                    <div className='divCheck-forgot'>
                        <div className='divCheck' onClick={() => setCheckConect(!checkConect)}>
                            {checkConect ? <ImCheckboxChecked size={15}/> : <ImCheckboxUnchecked color='#000' size={15}/>}
                            <span>Manter conectado</span>
                        </div>
                        <a onClick={() => navigate('/recuperar-senha')}>Esqueci minha senha</a>
                    </div>
                    <button className='btnLogin' onClick={() => openHome(email, senha)}>{loading ? 'Carregando' : 'Fazer login'}</button>
                    <div className='divHelp'>
                        <span>Precisa de ajuda?</span>
                        <a href="">Fale conosco</a>
                    </div>
                </div>
                <a href="/" className='decorationN'>Trocar modo de acesso <TfiReload /></a>
            </div>
        </div>
    )
}

export default Login