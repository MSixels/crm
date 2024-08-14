import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./UserModal.css";

UserModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  

export default function UserModal({ isOpen }) {
  const navigate = useNavigate();

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-infos">
        <h4>Vinicius Parrião</h4>
        <p>vinicius.parriao@gmail.com</p>
      </div>
      <div className="modal-links">
        <a href="#" onClick={() => navigate("/aluno/perfil")}>
          Perfil
        </a>
        <a href="#" onClick={() => navigate("/login/aluno")}>
          Sair
        </a>
      </div>
    </div>
  );
}