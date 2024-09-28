import './PerfilAluno.css';
import Header from "../../Components/Header/Header";
import InputMask from 'react-input-mask';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLocation, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../services/firebaseConfig';
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';

function PasswordInput({ id, placeholder, value, onChange, erro }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={`perfil__input-group ${erro ? "perfil__input--erro" : ""}`}>
      <input
        id={id}
        placeholder={placeholder}
        type={isPasswordVisible ? "text" : "password"}
        value={value}
        onChange={onChange}
        className={`perfil__input ${erro ? "perfil__input--erro" : ""}`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="perfil__icon-eye"
      >
        {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}

export default function PerfilAluno() {
  const { userId } = useParams();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState(false);
  const [route, setRoute] = useState('');
  const [tilte, setTitle] = useState('');
  const [routePage, setRoutePage] = useState('');

  const handleSave = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErro(true);
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert("As senhas não correspondem.");
      setErro(true);
      return;
    }

    setErro(false);

    try {
      const user = auth.currentUser;
      if (user) {
        const credential = EmailAuthProvider.credential(user.email, senhaAtual);

        // Reautenticar usuário
        await reauthenticateWithCredential(user, credential);

        // Verificar se a nova senha é igual à senha atual
        if (senhaAtual === novaSenha) {
          alert("A nova senha não pode ser igual à senha atual.");
          return;
        }

        // Atualizar senha
        await updatePassword(user, novaSenha);

        alert("Senha alterada com sucesso!");

        // Limpar os inputs após sucesso
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      alert("Erro ao alterar senha. Verifique se sua senha atual foi digitada corretamente.");
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/aluno')) {
      setRoute('/aluno/perfil');
      setRoutePage('/aluno/home');
      setTitle('Seus cursos');
    } else if (location.pathname.startsWith('/professor')) {
      setRoute('/professor/perfil');
      setRoutePage('/professor/dashbord');
      setTitle('Dashboard');
    }
  }, [location]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, "users", userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          console.log(docSnap.data());
        } else {
          console.log("Nenhum usuário encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);
  
  return (
    <>
      <Header options={[{ id: 1, text: "Perfil", route: route }, { id: 2, text: tilte, route: routePage }]} />
      <div className="perfil">
        <div className='divContent'>
          <div className="perfil__grid">
            <div className="perfil__card perfil__card--centered">
              <div className="perfil__avatar">
                <div className="perfil__avatar-photo">V</div>
              </div>
              <div className="perfil__text-center">
                <h3>Foto do perfil</h3>
                <p className="perfil__description">
                  Recomendamos que a foto tenha um tamanho máximo de 250x250px. O arquivo não pode ter tamanho superior a 2MB.
                </p>
                <button className="perfil__button">
                  Fazer upload de foto
                </button>
              </div>
            </div>

            <div className="perfil__card">
              <div className="perfil__infos">
                <h2>Dados do aluno</h2>
                <p className="perfil__description">
                  As informações aqui inseridas, serão as mesmas que aparecerão em seus certificados.
                </p>
              </div>
              <div className="perfil__content">
                <div className="perfil__grid-input">
                  <div className="perfil__input-group">
                    <label htmlFor="nome-completo">Nome completo</label>
                    <input id="nome-completo" placeholder="Seu nome" value={userData.name} />
                  </div>
                  <div className="perfil__input-group">
                    <label htmlFor="cidade">Cidade</label>
                    <input id="cidade" placeholder="Palmas" />
                  </div>
                </div>
                <div className="perfil__grid-input">
                  <div className="perfil__input-group">
                    <label htmlFor="data-nascimento">Data de nascimento</label>
                    <InputMask mask="99/99/9999" id="data-nascimento" placeholder="01/01/1990" />
                  </div>
                  <div className="perfil__input-group">
                    <label htmlFor="cpf">CPF</label>
                    <InputMask mask="999.999.999-99" id="cpf" placeholder="025.***.***-80" />
                  </div>
                </div>
                <div className="perfil__grid-input">
                  <div className="perfil__input-group">
                    <label htmlFor="email">E-mail (deve ser o mesmo do login)</label>
                    <input id="email" placeholder="Seu email" disabled value={userData.email} />
                  </div>
                  <div className="perfil__input-group">
                    <label htmlFor="telefone">Telefone/Celular</label>
                    <InputMask mask="+55 99999-9999" id="telefone" placeholder="+55 9999996381" />
                  </div>
                </div>
              </div>
              <div className="perfil__button-save">
                <button className="perfil__button" onClick={handleSave}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
          <div className="perfil__card">
            <div className="perfil__infos">
              <h2>Alterar senha</h2>
            </div>
            <div className="perfil__content">
              <div className="perfil__grid-input">
                <PasswordInput
                  required
                  id="senha-atual"
                  placeholder="Senha atual*"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  erro={erro && !senhaAtual}
                />
              </div>
              <div className="perfil__grid-input">
                <PasswordInput
                  required
                  id="nova-senha"
                  placeholder="Nova senha*"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  erro={erro && !novaSenha}
                />
                <PasswordInput
                  required
                  id="confirmar-senha"
                  placeholder="Confirmar a nova senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  erro={erro && !confirmarSenha}
                />
              </div>
            </div>
            <div className="perfil__button-save">
              <button className="perfil__button" onClick={handleSave}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
