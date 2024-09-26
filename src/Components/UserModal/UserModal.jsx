import { useLocation, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import "./UserModal.css";
import { useEffect, useState } from "react";

UserModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  

export default function UserModal({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation()
  const [routePerfil, setRoutePerfil] = useState('')
  const [routeLogin, setRouteLogin] = useState('')
  
  useEffect(() => {
    if (location.pathname.startsWith('/aluno')) {
      setRoutePerfil("/aluno/perfil")
      setRouteLogin("/login/aluno")
    } else if (location.pathname.startsWith('/professor')) {
      setRoutePerfil("/professor/perfil")
      setRouteLogin("/login/professor")
    }
  }, [location])

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-infos">
        <h4>Vinicius Parrião</h4>
        <p>vinicius.parriao@gmail.com</p>
      </div>
      <div className="modal-links">
        <a href="#" onClick={() => navigate(routePerfil)}>
          Perfil
        </a>
        <a href="#" onClick={() => navigate(routeLogin)}>
          Sair
        </a>
      </div>
    </div>
  );
}