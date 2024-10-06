import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';  
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Loading from '../Loading/Loading';

const ProtectedRoute = ({ element, typeUser, allowedTypes }) => {
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            if (decodedToken.user_id) {
                fetchUserData(decodedToken.user_id);
            } else {
                setLoading(false); 
            }
        } else {
            console.log("Nenhum token encontrado nos cookies.");
            setLoading(false); 
        }
    }, []);

    const fetchUserData = async (userId) => {
        try {
            const userDoc = doc(firestore, "users", userId);
            const docSnap = await getDoc(userDoc);

            if (docSnap.exists()) {
                setUserType(docSnap.data().type);
            } else {
                console.log("Nenhum usuário encontrado!");
            }
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
        } finally {
            setLoading(false); 
        }
    };

    if (loading) {
        return <Loading />
    }

    if (!userType) {
        return <Navigate to={`/login/${typeUser === 3 ? 'aluno' : typeUser === 2 || typeUser === 1 ? 'professor' : ''}`} replace />;
    }

    if (!allowedTypes.includes(userType)) {
        return <Navigate to="/" replace />;
    }

    return element; 
};

ProtectedRoute.propTypes = {
    element: PropTypes.element.isRequired, 
    typeUser: PropTypes.number.isRequired, 
    allowedTypes: PropTypes.arrayOf(PropTypes.number).isRequired, 
};

export default ProtectedRoute;
