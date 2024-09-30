import './Header.css';
import PropTypes from 'prop-types';
import Logo from '../../imgs/logoTextWhite.svg';
import UserImg from '../../imgs/user.svg';
import { useEffect, useState } from 'react';
import UserModal from '../UserModal/UserModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'

function Header({ options }) {
    const [userId, setUserId] = useState('')
    const [optId, setOptId] = useState(2);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate()
    const location = useLocation()

    const handleClickOption = (route, id, status) => {
        if(status === 'active'){
            navigate(route)
            setOptId(id)
        }
    }

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            setUserId(decodedToken.user_id)
        } else {
            console.log("Nenhum token encontrado nos cookies.");
        }
    }, [location]);

    return (
        <div className='containerHeader'>
            <header>
                <img src={Logo} alt="" />
                <div className='divUser'>
                    <div className='divOptions'>
                        {options && options.map((o) => (
                            <span key={o.id} onClick={() => handleClickOption(o.route, o.id, o.status)} style={{borderBottom: optId === o.id ? '2px solid #FFF' : 'none', color: o.status === 'block' ? '#000' : ''}}>{o.text}</span>
                        ))}
                    </div>
                    <img src={UserImg} alt="" onClick={() => setIsModalOpen(!isModalOpen)} className='avatar'/>
                    {isModalOpen && <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} userId={userId}/>}
                </div>
            </header>
        </div>
    )
}

Header.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        route: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
    })).isRequired,
    userId: PropTypes.string.isRequired,
};

export default Header;
