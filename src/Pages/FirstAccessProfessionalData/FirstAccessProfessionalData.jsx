import { useState } from 'react'
import LogoText from '../../imgs/logoText.png'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'

function FirstAccessProfessionalData() {
  const navigate = useNavigate()
  const [matricula, setMatricula] = useState('');
  const [unidadeDeEnsino, setUnidadeDeEnsino] = useState('')

  const [errorMatricula, setErrorMatricula] = useState(false)
  const [errorUnidadeDeEnsino, setErrorUnidadeDeEnsino] = useState(false)

  const nextStep = () => {
    if(!errorUnidadeDeEnsino) setErrorUnidadeDeEnsino(true)

    // verificar validacao no backend

    Cookies.set("unidadeDeEnsino", unidadeDeEnsino)

    navigate("/login/aluno/primeiro-acesso/password");
  }

  return (
    <div className='containerLogin'>
      <div className="divContent">
        <img src={LogoText} alt="logo" style={{ width: '186px' }} />
        <div className="divForm">
          <div className="divTitle titleFisrt">
            <span className='title titleLink'>Dados profissionais</span>
            <span className='subtitle'>Seus dados estão registrados no banco de dados, precisamos valida-los.</span>
          </div>
          {/* <div className='divInput'>
            <label htmlFor="matricula" style={{color: errorMatricula && 'red'}}>Matrícula</label>
            <input
              type="text"
              name='matricula'
              id='matricula'
              className='input'
              value={matricula}
              onChange={(e) => { setMatricula(e.target.value) }}
              style={{borderColor: errorMatricula && 'red'}}
            />
          </div> */}
          <div className='divInput'>
            <label htmlFor="unidadeDeEnsino" style={{color: errorUnidadeDeEnsino && 'red'}}>Unidade de ensino</label>
            <input
              type="text"
              name='unidadeDeEnsino'
              id='unidadeDeEnsino'
              className='input'
              value={unidadeDeEnsino}
              onChange={(e) => { setUnidadeDeEnsino(e.target.value) }}
              style={{borderColor: errorUnidadeDeEnsino && 'red'}}
            />
          </div>
          <button className='btnLoginFirst' onClick={() => nextStep()}>Continuar</button>
          <div>
            <a href="/" className='decorationN loginLink'>Voltar para tela de login</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirstAccessProfessionalData