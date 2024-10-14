import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./UserModal.css";
import { useEffect, useState } from "react";
import { firestore } from "../../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";

UserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

export default function UserModal({ isOpen, userId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [routePerfil, setRoutePerfil] = useState("");
  const [routeLogin, setRouteLogin] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (location.pathname.startsWith("/aluno")) {
      setRoutePerfil(`/aluno/perfil/${userId}`);
      setRouteLogin("/login/aluno");
    } else if (location.pathname.startsWith("/professor")) {
      setRoutePerfil(`/professor/perfil/${userId}`);
      setRouteLogin("/login/professor");
    }
  }, [location, userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, "users", userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("Nenhum usuário encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false); // Desativar o estado de carregamento
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading) {
    return <div className="modal">Carregando...</div>;
  }

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-infos">
        {userData ? (
          <>
            <h4>{userData.name}</h4> 
            <p>
            {userData.email.length > 24
              ? `${userData.email.slice(0, 24)}...`
              : userData.email}
</p>
          </>
        ) : (
          <p>Usuário não encontrado</p>
        )}
      </div>
      <div className="modal-links">
        <button onClick={() => navigate(routePerfil)}>
          Perfil
        </button>
        <button onClick={() => { Cookies.remove('accessToken'); navigate(routeLogin); window.location.reload();}}>
          Sair
        </button>
      </div>
    </div>
  );
}
