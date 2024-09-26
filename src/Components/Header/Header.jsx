import './Header.css';
import PropTypes from 'prop-types';
import Logo from '../../imgs/logoTextWhite.svg';
import UserImg from '../../imgs/user.svg';
import { useState } from 'react';
import UserModal from '../UserModal/UserModal';
import { useNavigate } from 'react-router-dom';

function Header({ options }) {
    const [optId, setOptId] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate()

    const handleClickOption = (route) => {
        navigate(route)
    }

    return (
        <div className='containerHeader'>
            <header>
                <img src={Logo} alt="" />
                <div className='divUser'>
                    <div className='divOptions'>
                        {options && options.map((o) => (
                            <span key={o.id} onClick={() => [setOptId(o.id), handleClickOption(o.route)]} style={{borderBottom: optId === o.id ? '3px solid #FFF' : 'none'}}>{o.text}</span>
                        ))}
                    </div>
                    <img src={UserImg} alt="" onClick={() => setIsModalOpen(!isModalOpen)} />
                    {isModalOpen && <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
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
    })).isRequired,
};

export default Header;
