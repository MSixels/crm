import './Header.css';
import PropTypes from 'prop-types';
import Logo from '../../imgs/logoTextWhite.svg';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';
import { useEffect, useState } from 'react';
import UserModal from '../UserModal/UserModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'

function Header({ options }) {
    const [userId, setUserId] = useState('')
    const [userData, setUserData] = useState(null);
    const [optId, setOptId] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate()
    const location = useLocation()

    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '';

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

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const userDoc = doc(firestore, 'users', userId);
                    const docSnap = await getDoc(userDoc);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        console.log('Nenhum usuário encontrado');
                    }
                } catch (error) {
                    console.error('Erro ao buscar usuário:', error);
                }
            }
        };
        fetchUserData();
    }, [userId]);


    return (
        <div className='containerHeader'>
            <header>
                <img src={Logo} alt="" />
                <div className='divUser'>
                    <div className='divOptions'>
                        {options && options.map((o) => (
                            <span key={o.id} onClick={() => handleClickOption(o.route, o.id, o.status)} style={{borderBottom: location.pathname === o.route ? '2px solid #FFF' : 'none', color: o.status === 'block' ? '#000' : ''}}>{o.text}</span>
                        ))}
                    </div>
                    <div className='divUser'>
                    <div className='avatar-placeholder' onClick={() => setIsModalOpen(!isModalOpen)}>
                        {userData ? (
                            <span className='letter'>{getInitial(userData.name)}</span>
                        ) : (
                            <span>A</span>
                        )}
                    </div>
                    {isModalOpen && <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} userId={userId} />}
                    </div>
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
