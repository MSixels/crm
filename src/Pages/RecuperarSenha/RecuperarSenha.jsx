import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import para redirecionamento
import { auth } from '../../services/firebaseConfig';
import './RecuperarSenha.css';
import LogoText from '../../imgs/logoText.png';

function RecuperarSenha() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const navigate = useNavigate();

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setIsEmailSent(true);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Erro ao enviar o e-mail de redefinição. Verifique o endereço de e-mail.');
        }
    };

    return (
        <div className="containerRecuperarSenha">
            <img src={LogoText} alt="logo" style={{width: '186px'}} />
            
            {!isEmailSent ? (
                <div className="divContentRecovery">
                    <h1>Recuperar Senha</h1>
                    <p>Informe seu e-mail cadastrado na plataforma. Caso ele exista, enviaremos um link para redefinição de sua senha. Cheque sua caixa de entrada e também a de SPAM.</p>
                    <input 
                        type="email" 
                        placeholder="Digite seu e-mail" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <a className='linkRecovery' onClick={() => {navigate(`/`)}}>Acessar minha conta</a>
                    <button className='btn1' onClick={handlePasswordReset}>Enviar link de recuperação</button>
                    <p>Precisa de ajuda? <a className='linkRecovery' href="">Fale conosco</a></p>
                </div>
            ) : (
                <div className="mailSending">
                    <h2>Tudo Certo!</h2>
                    <p>Nós te enviamos um e-mail com as instruções para recuperar sua conta.</p>
                    <button className='btn1' onClick={() => {navigate(`/`)}}>Voltar para área de login</button>
                    <button className='btn2' onClick={handlePasswordReset}>Reenviar link</button>
                </div>
            )}
        </div>
    );
}

export default RecuperarSenha;
