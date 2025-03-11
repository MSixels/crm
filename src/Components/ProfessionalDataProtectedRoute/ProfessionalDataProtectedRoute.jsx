import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';  
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Loading from '../Loading/Loading';

const ProfessionalDataProtectedRoute = ({ element }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const matricula = Cookies.get('matricula'); // Supondo que você armazena a matrícula no cookie
        const cpf = Cookies.get('cpf')
        const email = Cookies.get('email');

        // Verifica se o nome e a matrícula estão presentes nos cookies
        if ((matricula | cpf) && email) {
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

ProfessionalDataProtectedRoute.propTypes = {
    element: PropTypes.element.isRequired, 
};

export default ProfessionalDataProtectedRoute;
