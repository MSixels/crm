import { useNavigate, useParams } from 'react-router-dom'
import './Login.css'
import LogoText from '../../imgs/logoText.svg'
import { HiAcademicCap } from "react-icons/hi2";
import { AiFillHome } from "react-icons/ai";
import { ImCheckboxUnchecked } from "react-icons/im";
import { ImCheckboxChecked } from "react-icons/im";
import { TfiReload } from "react-icons/tfi";
import { useState } from 'react';

function Login() {
    const navigate = useNavigate()
    const { type } = useParams()
    const [checkConect, setCheckConect] = useState(false)
    const [inputEmail, setInputEmail] = useState(false)
    const [inputSenha, setInputSenha] = useState(false)
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const openHome = (email, senha) => {
        if(email === ''){
            setInputEmail(true)
        }
        if(senha === ''){
            setInputSenha(true)
        }
        if(email != '' && senha != ''){
            if(type === 'aluno'){
                navigate(`/${type}/home`)
            } else if(type === 'professor'){
                navigate(`/${type}/dashboard`)
            }
        }
    }

    return (
        <div className='containerLogin'>
            <div className='divContent'>
                <img src={LogoText} alt="logo" />
                <div className='divForm'>
                    <div className='divTitle'>
                        <div className='divIcon'>
                            {type === 'aluno' ? <HiAcademicCap size={25}/> : <AiFillHome size={25}/>}
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
                            onChange={(e) => setEmail(e.target.value)}
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
                            onChange={(e) => setSenha(e.target.value)}
                            style={{borderColor: inputSenha && 'red'}}
                        />
                    </div>
                    <div className='divCheck-forgot'>
                        <div className='divCheck' onClick={() => setCheckConect(!checkConect)}>
                            {checkConect ? <ImCheckboxChecked /> : <ImCheckboxUnchecked color='#000'/>}
                            <span>Manter conectado</span>
                        </div>
                        <a href="">Esqueci minha senha</a>
                    </div>
                    <button className='btnLogin' onClick={() => openHome(email, senha)}>Fazer login</button>
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