import './PreLogin.css'
import { HiAcademicCap } from "react-icons/hi2";
import { AiFillHome } from "react-icons/ai";
import Logo from '../../imgs/logo.svg'
import { useNavigate } from 'react-router-dom';

function PreLogin() {
    const navigate = useNavigate()
    const options = [
        {
            id: 1,
            icon: <HiAcademicCap size={30}/>,
            title: 'Aluno',
            subtitle: 'Acesso aos módulos de aulas e provas',
            type:'aluno'
        },
        {
            id: 2,
            icon: <AiFillHome size={30}/>,
            title: 'Professor',
            subtitle: 'Configure a plataforma, adicione conteúdos e mais',
            type:'professor'
        }
    ]

    const openLogin = (id) => {
        navigate(`/login/${id}`)
    }
    return (
        <div className='containerPreLogin'>
            <div className='divForm'>
                <div className='intro'>
                    <img src={Logo} alt="logo" />
                    <h1 className='headLine'>Bem-Vindo</h1>
                    <span className='text'>Selecione como deseja acessar a plataforma</span>
                </div>
                <div className='divOptions'>
                    {options.map((o) => (
                        <div key={o.id} className='divOption' onClick={() => openLogin(o.type)}>
                            <div className='divIcon'>
                                {o.icon}
                            </div>
                            <div className='divText'>
                                <span className='textTitle'>{o.title}</span>
                                <span className='textSubtitle'>{o.subtitle}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PreLogin