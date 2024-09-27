import { useEffect, useState } from 'react';
import './HeadLine.css'
import { FaPlay } from "react-icons/fa";
import { firestore } from '../../../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

function HeadLine({userId}) {
    const [userData, setUserData] = useState([])
    const [loading, setLoading] = useState(false)
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
    
    return (
        <div className='containerHeadLine'>
            <h1>Olá, {userData?.name?.split(" ")[0]}</h1>
            <button>Continuar de onde parou <FaPlay /></button>
        </div>
    )
}

export default HeadLine