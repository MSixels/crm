import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';  
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Loading from '../Loading/Loading';

const PasswordDataProtectedRoute = ({ element }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const cpf = Cookies.get('cpf')
        const email = Cookies.get('email');
        const unidadeDeEnsino = Cookies.get("unidadeDeEnsino")
        
        // Verifica se o nome e a matrícula estão presentes nos cookies
        if (cpf && email && unidadeDeEnsino) {
            setIsAuthorized(true);
        }

        setLoading(false); 
    }, []);

    if (loading) {
        return <Loading /> 
    }

    if (!isAuthorized) {
        return <Navigate to="/login/aluno/primeiro-acesso" replace />;
    }

    return element; 
};

PasswordDataProtectedRoute.propTypes = {
    element: PropTypes.element.isRequired, 
};

export default PasswordDataProtectedRoute;
