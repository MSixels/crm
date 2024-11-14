import './PerfilAluno.css';
import Header from "../../Components/Header/Header";
import InputMask from 'react-input-mask';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLocation, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";import { auth, firestore } from '../../services/firebaseConfig';
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';
import PropTypes from 'prop-types';


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
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const storage = getStorage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
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
  const [alertPasswordSuccess, setAlertPasswordSuccess] = useState(false);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : 'A');

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0])
    const file = event.target.files[0];
    const storageRef = ref(storage, `avatars/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const userRef = doc(firestore, 'users', userId);
        updateDoc(userRef, {
          avatar: url,
        });
      });
    });
  };

  const handleSaveData = async () => {
    try {
      if (!userData.cpf || !userData.dataNascimento) {
        setErro(true);
        return;
      }
      const userRef = doc(firestore, 'users', userId);
      await updateDoc(userRef, {
        cpf: userData.cpf,
        dataNascimento: userData.dataNascimento,
        name: userData.name,
      });
      setErro(false);
      setIsChanged(false);
      setSaveSuccess(true);
      setEditMode(false);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      //console.error("Erro ao salvar dados:", error);
    }
  };

  const toggleEditMode = () => {
    if (!editMode) {
      setOriginalData({ ...userData });
    } else {
      setUserData({ ...originalData });
    }
    setEditMode(!editMode);
    setIsChanged(false);
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
    setIsChanged(true);
  };

  const handleSavePassword = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErro(true);
      return;
    }
  
    if (novaSenha !== confirmarSenha) {
      setAlertInputInvalid(true);
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (user) {
        const credential = EmailAuthProvider.credential(user.email, senhaAtual);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, novaSenha);
        setAlertPasswordSuccess(true);
      }
    } catch (error) {
      //console.error("Erro ao alterar senha:", error);
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
      setRoutePage('/professor/alunos');
      setTitle('Alunos');
    }
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userDoc = doc(firestore, 'users', userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          //console.log('Nenhum usuário encontrado!');
        }
      } catch (error) {
        //console.error('Erro ao buscar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [location, userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userDoc = doc(firestore, "users", userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          if (data.avatar) {
            setSelectedImage(data.avatar);
          }
        } else {
          //console.log('Nenhum usuário encontrado!');
        }
      } catch (error) {
        //console.error("Erro ao buscar usuário:", error);
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
              <div className="perfil__avatar-photo">
              {selectedImage ? (
                typeof selectedImage === "string" ? (
                  <img src={selectedImage} alt="Avatar" style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }} />
                ) : (
                  <img src={URL.createObjectURL(selectedImage)} alt="Avatar" style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }} />
                )
              ) : (
                <div>{getInitial(userData.name) || 'A'}</div>
              )}
            </div>
              </div>
              <div className="perfil__text-center">
                <h3>Foto do perfil</h3>
                <p className="perfil__description">
                  Recomendamos que a foto tenha um tamanho máximo de 250x250px. O arquivo não pode ter tamanho superior a 2MB.
                </p>
                <label
                  htmlFor="avatar-input"
                  className="perfil__button"
                > Alterar foto de perfil
                <input
                  type="file"
                  id="avatar-input"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                </label>
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
                    <label htmlFor="name">Nome completo</label>
                    <input
                      id="name"
                      placeholder="Seu nome"
                      value={userData.name || ''}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="perfil__input-group">
                    <label htmlFor="dataNascimento">Data de nascimento*</label>
                    <InputMask
                      mask="99/99/9999"
                      id="dataNascimento"
                      placeholder="01/01/1990"
                      value={userData.dataNascimento || ''}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      required
                    />
                  </div>
                </div>
                <div className="perfil__grid-input">
                  <div className="perfil__input-group">
                    <label htmlFor="cpf">CPF*</label>
                    <InputMask
                      mask="999.999.999-99"
                      id="cpf"
                      placeholder="025.***.***-80"
                      value={userData.cpf || ''}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      required
                    />
                    {saveSuccess && <p style={{ color: 'green' }}>Dados salvos com sucesso!</p>}
                  </div>
                  <div className="perfil__input-group">
                    <label htmlFor="email">E-mail (deve ser o mesmo do login)</label>
                    <input id="email" placeholder="Seu email" value={userData.email || ''} disabled />
                  </div>
                </div>
              </div>
              <div className="perfil__button-save">
                <button
                  className="perfil__button"
                  onClick={toggleEditMode}
                  style={{ backgroundColor: editMode ? 'red' : '', marginRight: '16px' }}
                >
                  {editMode ? 'Cancelar' : 'Editar dados'}
                </button>
                <button
                  className="perfil__button"
                  onClick={handleSaveData}
                  disabled={!isChanged}
                  style={{
                    backgroundColor: isChanged ? 'var(--bg-btnConfirm)' : '#ccc',
                    cursor: isChanged ? 'pointer' : 'not-allowed',
                  }}
                >
                  Salvar Dados
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
              <button className="perfil__button-password" onClick={handleSavePassword}>
                Alterar Senha
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

PasswordInput.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  erro: PropTypes.bool,
};
