import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import './RecuperarSenha.css';
import LogoText from '../../imgs/logoText.svg'

function RecuperarSenha() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Verifique seu e-mail para redefinir sua senha.');
        } catch (error) {
            setMessage('Erro ao enviar o e-mail de redefinição. Verifique o endereço de e-mail.');
        }
    };

    return (
    <>
        <img src={LogoText} alt="logo" />
        <div className="containerRecuperarSenha">
            <h1>Recuperar Senha</h1>
            <p>Informe seu e-mail cadastrado na plataforma. Caso ele exista, enviaremos um link para redefinição de sua senha.</p>
            <input 
                type="email" 
                placeholder="Digite seu e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <a href="">Acessar minha conta</a>
            <button onClick={handlePasswordReset}>Enviar link de recuperação</button>
            {message && <p>{message}</p>}
            <p>Precisa de ajuda? <a href="">Fale conosco</a></p>
        </div>
        </>
    );
}

export default RecuperarSenha;
