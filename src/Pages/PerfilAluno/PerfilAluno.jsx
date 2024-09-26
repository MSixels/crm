import './PerfilAluno.css';
import Header from "../../Components/Header/Header";
import InputMask from 'react-input-mask';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


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


export default function ProfileEdit() {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState(false);

  const handleSave = () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErro(true);
    } else {
      setErro(false);
    }
  };

  return (
    <>
      <Header options={[{ id: 1, text: "Home" }, { id: 2, text: "Perfil" }]} />
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
                  Recomendamos que a foto tenha um tamanho máximo de 250x250px. O arquivo não pode ter tamanho superior a 2MB
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
                    <input id="nome-completo" placeholder="Vinícius Parrilo" />
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
                    <input id="email" placeholder="viniciusparrilo@gmail.com" disabled />
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