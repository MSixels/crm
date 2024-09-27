import { useEffect, useState } from 'react'
import Header from '../../Components/Header/Header'
import Cursos from '../../Components/HomeAluno/Cursos/Cursos'
import HeadLine from '../../Components/HomeAluno/HeadLine/HeadLine'
import './Home.css'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

function Home() {
    const [userId, setUserId] = useState('')
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

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
            //console.log("Access Token:", accessToken);
            const decodedToken = jwtDecode(accessToken);
            //console.log("Decoded Token:", decodedToken);
            //console.log("UID:", decodedToken.user_id);
            setUserId(decodedToken.user_id)
        } else {
            console.log("Nenhum token encontrado nos cookies.");
        }
    }, []);
    return (
        <div className='containerHome'>
            <Header options={options} />
            <div className='divContentHome'>
                <HeadLine userId={userId}/>
                <Cursos />
            </div>
        </div>
    )
}

export default Home