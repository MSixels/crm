import Header from '../../Components/Header/Header'
import Cursos from '../../Components/HomeAluno/Cursos/Cursos'
import HeadLine from '../../Components/HomeAluno/HeadLine/HeadLine'
import './Home.css'

function Home() {
    const options = [
        {
            id: 1,
            text: 'Seus cursos'
        },
        {
            id: 2,
            text: 'Sobre'
        },
    ]
    return (
        <div className='containerHome'>
            <Header options={options}/>
            <div className='divContentHome'>
                <HeadLine />
                <Cursos />
            </div>
        </div>
    )
}

export default Home