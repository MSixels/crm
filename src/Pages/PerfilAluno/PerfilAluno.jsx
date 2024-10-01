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
  const [alertNewPasswordInvalid, setAlertNewPasswordInvalid] = useState(false);
  const [alertInputInvalid, setAlertInputInvalid] = useState(false);
  const [alertPasswordInvalid, setAlertPasswordInvalid] = useState(false);
  const [alertPasswordSuccess, setAlertPasswordSuccess] = useState(false); // Estado para o alerta de sucesso

  const handleSave = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErro(true);
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setAlertInputInvalid(true);
      setErro(true);
      return;
    }

    setErro(false);

    try {
      const user = auth.currentUser;
      if (user) {
        const credential = EmailAuthProvider.credential(user.email, senhaAtual);

        await reauthenticateWithCredential(user, credential);

        if (senhaAtual === novaSenha) {
          setAlertNewPasswordInvalid(true);
          return;
        }

        await updatePassword(user, novaSenha);

        setAlertPasswordSuccess(true); // Exibir alerta de sucesso
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setAlertPasswordInvalid(true);
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/aluno')) {
      setRoute(`/aluno/perfil/${userId}`);
      setRoutePage('/aluno/home');
      setTitle('Início');
    } else if (location.pathname.startsWith('/professor')) {
      setRoute(`/professor/perfil/${userId}`);
      setRoutePage('/professor/dashbord');
      setTitle('Dashboard');
    }
  }, [location, userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, "users", userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
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

  const options = [
    { id: 1, text: "Perfil", route: route, status: 'active' }, 
    { id: 2, text: tilte, route: routePage, status: 'active' }
  ];

  return (
    <>
      <Header options={options} />
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
          <div className="perfil__card-password">
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
                  onChange={(e) => {
                    setSenhaAtual(e.target.value);
                    e.target.value !== '' && setAlertPasswordInvalid(false);
                    setAlertPasswordSuccess(false);
                  }}
                  erro={erro && !senhaAtual}
                />
                {alertPasswordInvalid && <p style={{color: 'red'}} className='invalidPassword'>Erro ao alterar senha. Verifique se sua senha atual foi digitada corretamente</p>}
                {alertPasswordSuccess && <p style={{color: 'green'}} className='successMessage'>Sua senha foi alterada com sucesso!</p>}
              </div>
              <div className="perfil__grid-input">
                <div className='divNewPasswords'>
                  <PasswordInput
                    required
                    id="nova-senha"
                    placeholder="Nova senha*"
                    value={novaSenha}
                    onChange={(e) => {
                      setNovaSenha(e.target.value);
                      e.target.value !== '' && setAlertNewPasswordInvalid(false);
                    }}
                    erro={erro && !novaSenha}
                  />
                  {alertNewPasswordInvalid && <p style={{color: 'red'}} >A nova senha não pode ser igual à senha atual.</p>}
                </div>
                <div className='divNewPasswords'>
                  <PasswordInput
                    required
                    id="confirmar-senha"
                    placeholder="Confirmar a nova senha"
                    value={confirmarSenha}
                    onChange={(e) => {setConfirmarSenha(e.target.value), e.target.value != '' && setAlertInputInvalid(false)}}
                    erro={erro && !confirmarSenha}
                  />
                  {alertInputInvalid && <p style={{color: 'red'}}>As senhas não são iguais</p>}
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
      </div>
    </>
  );
}
