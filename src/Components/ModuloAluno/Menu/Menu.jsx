import './Menu.css'
import { IoIosArrowDropleftCircle } from "react-icons/io";
import PropTypes from 'prop-types'
import { FaLock } from "react-icons/fa";
import ProgressBar from '../../ProgressBar/ProgressBar';
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../../services/firebaseConfig";
import { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { FaUser } from "react-icons/fa";
import { MdOutlineErrorOutline } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';


function Menu({ modulo, conteudo, aulas, provas, progressAulas, progressProvas, userId }) {
    const navigate = useNavigate()
    const [selectOption, setSelectOption] = useState(1)
    const { moduloId } = useParams();
    const { type } = useParams()
    const [provasQtd, setProvasQtd] = useState(0);
    const [materiais, setMateriais] = useState([]);

    const calculateProgress = (aulasCompletadas, aulasTotal, provasCompletadas, provasTotal) => {
        //console.log(`Calculos de %: ${aulasCompletadas} / ${aulasTotal} && ${provasCompletadas} / ${provasTotal}`)
        const percentAulas = (aulasCompletadas / aulasTotal) * 100;
        const percentProvas = (provasCompletadas / provasTotal) * 100;

    
        const totalProgress = (percentAulas + percentProvas) / 2;
        return totalProgress.toFixed(0);
    };

    
    
    useEffect(() => {
        const provaTypeProva = provas.filter(prova => prova.type === 'prova').length;
        setProvasQtd(provaTypeProva)
    }, [provas]);

    const options = [
        {
            id: 1,
            icon: <SiGoogleclassroom size={20}/>,
            text: 'Aulas',
            type: 'aulas'
        },
        {
            id: 2,
            icon: <FaUser size={20}/>,
            text: 'Professor',
            type: 'professor'
        },
        
    ]

    const navigateToOptions = (type) => {
        if(type === 'aulas'){
            navigate(`/aluno/modulo/${moduloId}/aulas`)
        }else if(type === 'professor'){
            navigate(`/aluno/modulo/${moduloId}/professor`)
        }else {
            navigate(`/aluno/modulo/${moduloId}/aulas`)
        }
    }

    const backHome = () => {
        navigate('/aluno/home')
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate() + 1).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Lembre-se que os meses começam do 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const aulasCompletadas = aulas.filter(aula => {
        const progressoAula = progressAulas?.find(progress => progress.userId === userId && progress.aulaId === aula.id);
        return progressoAula && progressoAula.status === 'end';
    }).length;

    const provasCompletadas = provas.filter(prova => {
        const progressoProva = progressProvas?.find(progress => progress.userId === userId && progress.provaId === prova.id);
        return progressoProva && progressoProva.status === 'end';
    }).length;

    const totalScoreCompletadas = provas.reduce((acc, prova) => {
        if (prova.type === 'prova') {
            const progressoProva = progressProvas?.find(progress => progress.userId === userId && progress.provaId === prova.id);
            return progressoProva && progressoProva.status === 'end' ? acc + progressoProva.score : acc;
        }
        return acc;
    }, 0);

    useEffect(() => {
        const fetchMateriais = async () => {
            try {
                const q = query(
                    collection(firestore, "materiais"),
                    where("moduloId", "==", moduloId)
                );
                const querySnapshot = await getDocs(q);
                const materiaisData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMateriais(materiaisData);
            } catch (error) {
                console.error("Erro ao buscar materiais:", error);
            }
        };

        fetchMateriais();
    }, [moduloId]);

    const downloadMaterial = (url) => {
        window.open(url, "_blank");
    };
    

    return (
        <div className='containerMenu'>
            <div className='divBtnBack'>
                <IoIosArrowDropleftCircle size={30} onClick={backHome}/>
            </div>
            {modulo && conteudo && aulas && provas &&(
                <div className='divContentMenu'>
                    <span className='ft14'>Disponível até {formatDate(modulo.validade)}</span>
                    <div className='divName'>
                        <h2>{modulo.name}</h2>
                        <span className='progressPorcent ft14'>{modulo.status !== 'block' ? `${calculateProgress(aulasCompletadas, aulas.length, provasCompletadas, provas.length) > 0 ? `${calculateProgress(aulasCompletadas, aulas.length, provasCompletadas, provas.length)}% Concluído` : 'Não iniciado'}` : (<> <FaLock /> Bloqueado</>)}</span>
                    </div>
                    <ProgressBar aulasCompletadas={aulasCompletadas} aulasTotal={aulas.length} provasCompletadas={provasCompletadas} provasTotal={provas.length} />
                    <div className='infos'>
                        <span>Aulas</span>
                        <span>{aulasCompletadas}/{aulas.length}</span> 
                    </div>
                    <div className='infos'>
                        <span>Provas</span>
                        <span>{provasCompletadas}/{provas.length}</span>
                    </div>
                    <div className='infos'>
                        <span>Prontos</span>
                        <span>{totalScoreCompletadas}/{provasQtd * 100}</span>
                    </div>
                </div>
            )}
            <div className='divOptions'>
                {options.map((o) => (
                    <div key={o.id} className={`option ${type === o.type ? 'active' : ''}`} onClick={() => navigateToOptions(o.type)}>
                        <div className='divIcon'>
                            {o.icon}
                        </div>
                        <span className='optionText'>{o.text}</span>
                    </div>
                ))}
            </div>
            <div className="materials">
                <h3 className='materials_title'>Materiais complementares</h3>
                <p className='materials_text' >Materiais referentes a esse módulo</p>
                <div className="materialsList">
    {materiais.length > 0 ? (
        materiais.map((material) => {
            const fileName = decodeURIComponent(
                material.materialUrl.split("/").pop().split("?")[0]
            ).replace("materiais/", "");

            return (
                <div
                    key={material.id}
                    className="materialItem"
                    onClick={() => downloadMaterial(material.materialUrl)}
                    role="button"
                    tabIndex="0"
                    onKeyDown={(e) =>
                        e.key === "Enter" && downloadMaterial(material.materialUrl)
                    }
                >
                    <FaFilePdf className="materialIcon" size={32} />
                    <p className="materialName">{fileName}</p>
                </div>
            );
        })
    ) : (
        <p className="materialNone" >Nenhum material disponível para este módulo.</p>
    )}
</div>
            </div>
        </div>
    );
}

Menu.propTypes = {
    modulo: PropTypes.array.isRequired,
    conteudo: PropTypes.array.isRequired,
    aulas: PropTypes.array.isRequired,
    provas: PropTypes.array.isRequired,
    progressAulas: PropTypes.array.isRequired,
    progressProvas: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
};

export default Menu

/*

{
            id: 3,
            icon: <MdOutlineErrorOutline size={20}/>,
            text: 'Reportar problema',
            type: 'problema'
        },

*/