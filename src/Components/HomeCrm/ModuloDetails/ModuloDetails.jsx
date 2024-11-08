import { useEffect, useState } from 'react';
import './ModuloDetails.css'
import PropTypes from 'prop-types'
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../../services/firebaseConfig';
import Loading from '../../Loading/Loading';
import { FaBookOpen } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import ButtonBold from '../../ButtonBold/ButtonBold';
import { FaCirclePlus } from "react-icons/fa6";
import ModalCreateConteudo from '../../ModalCreateConteudo/ModalCreateConteudo';
import ModalDeleteItem from '../../ModalDeleteItem/ModalDeleteItem';

function ModuloDetails({ moduloId }) {
    const navigate = useNavigate()
    const [modulo, setModulo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [optionSelected, setOptionSelected] = useState(1)
    const [conteudos, setConteudos] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [provas, setProvas] = useState([]);
    const [showModalConteudo, setShowModalConteudo] = useState(false)
    const [conteudoDelete, setConteudoDelete] = useState('')
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [showModalDeleteMaterial, setShowModalDeleteMaterial] = useState(false)
    const [materialDelete, setMaterialDelete] = useState({})

    const optionsHeader = [
        {id: 1, icon: <FaBookOpen />, title: 'Conteúdo'},
        {id: 2, icon: <FaGear />, title: 'Configurações'},
    ]

    const fetchModulo = async (moduloId) => {
        try {
            const moduloRef = doc(firestore, 'modulos', moduloId);
            const moduloSnapshot = await getDoc(moduloRef);
            if (moduloSnapshot.exists()) {
                setLoading(false)
                setModulo(moduloSnapshot.data());
                console.log(moduloSnapshot.data())
            } else {
                console.error("Módulo não encontrado!");
            }
        } catch (error) {
            setLoading(false)
            console.error("Erro ao carregar o módulo:", error);
        }
    };


    const fetchConteudos = async (moduloId) => {
        if (!moduloId) {
            console.error("moduloId não foi fornecido!");
            return [];
        }
        try {
            const conteudoRef = collection(firestore, 'conteudo');
            const q = query(conteudoRef, where("moduloId", "==", moduloId));
            const querySnapshot = await getDocs(q);
            const conteudos = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setConteudos(conteudos)
            console.log(conteudos)
        } catch (error) {
            console.error("Erro ao carregar conteúdos:", error);
            return [];
        }
    };

    const fetchAulas = async (conteudos) => {
        try {
            const conteudoIds = conteudos.map(conteudo => conteudo.id);
            if (conteudoIds.length === 0) {
                console.log("Nenhum conteúdo encontrado para buscar aulas.");
                return;
            }
            const q = query(
                collection(firestore, 'aulas'),
                where('conteudoId', 'in', conteudoIds)
            );
            const querySnapshot = await getDocs(q);
            const aulasList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAulas(aulasList);
            console.log('aulasList: ', aulasList)
            setLoading(false)
        } catch (error) {
            console.error("Erro ao carregar as aulas:", error);
            setLoading(false)
        }
    };

    const fetchProvas = async (conteudos) => {
        try {
            const conteudoIds = conteudos.map(conteudo => conteudo.id);
            if (conteudoIds.length === 0) {
                console.log("Nenhum conteúdo encontrado para buscar aulas.");
                return;
            }
            const q = query(
                collection(firestore, 'provas'),
                where('conteudoId', 'in', conteudoIds)
            );
            const querySnapshot = await getDocs(q);
            const provasList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProvas(provasList);
            console.log('provasList: ', provasList)
        } catch (error) {
            console.error("Erro ao carregar as aulas:", error);
        }
    };


    useEffect(() => {
        if (moduloId) {
            fetchModulo(moduloId);
            fetchConteudos(moduloId)
        }
    }, [moduloId]);

    useEffect(() => {
        if(conteudos){
            fetchAulas(conteudos)
            fetchProvas(conteudos)
        }
        
    }, [conteudos])

    const closeModalConteudo = () => {
        setShowModalConteudo(false)
    }

    const itemDelete = (id) => {
        setConteudoDelete(id)
        setShowModalDelete(true)
    }

    const deleteConteudo = async () => {
        try {
            console.log(conteudoDelete);
            
            if (!firestore) {
                throw new Error('Instância Firestore não encontrada');
            }
    
            const conteudoRef = doc(firestore, 'conteudo', conteudoDelete);
            await deleteDoc(conteudoRef);
    
            const aulasQuery = query(
                collection(firestore, 'aulas'),
                where('conteudoId', '==', conteudoDelete)
            );
            const aulasSnapshot = await getDocs(aulasQuery);
            aulasSnapshot.forEach(async (docSnapshot) => {
                const aulaRef = doc(firestore, 'aulas', docSnapshot.id);
                await deleteDoc(aulaRef);
                console.log(`Aula com id ${docSnapshot.id} deletada.`);
            });
    
            const provasQuery = query(
                collection(firestore, 'provas'),
                where('conteudoId', '==', conteudoDelete)
            );
            const provasSnapshot = await getDocs(provasQuery);
            provasSnapshot.forEach(async (docSnapshot) => {
                const provaRef = doc(firestore, 'provas', docSnapshot.id);
                await deleteDoc(provaRef);
                console.log(`Prova com id ${docSnapshot.id} deletada.`);
            });
    
            setShowModalDelete(false);
            console.log(`Conteúdo com id ${conteudoDelete} deletado com sucesso.`);
            
            fetchConteudos(moduloId);
        } catch (error) {
            console.error("Erro ao deletar conteúdo:", error);
        }
    };

    const cancelarDelete = () => {
        setShowModalDelete(false)
        setConteudoDelete('')
    }

    const itemDeleteMatrial = (id, type) => {
        setMaterialDelete({id, type})
        setShowModalDeleteMaterial(true)
    }

    const deleteMaterial = async () => {
        try {
            if (!firestore) {
                throw new Error('Instância Firestore não encontrada');
            }
    
            if (materialDelete.type === 'aula' || materialDelete.type === 'game') {
                const aulaRef = doc(firestore, 'aulas', materialDelete.id);
                await deleteDoc(aulaRef);
                console.log(`Item da tabela 'aulas' com id ${materialDelete.id} deletado com sucesso.`);
                fetchConteudos(moduloId);
                setShowModalDeleteMaterial(false)
            }
            else if (materialDelete.type === 'prova' || materialDelete.type === 'storyTelling') {
                const provaRef = doc(firestore, 'provas', materialDelete.id);
                await deleteDoc(provaRef);
                console.log(`Item da tabela 'provas' com id ${materialDelete.id} deletado com sucesso.`);
                fetchConteudos(moduloId);
                setShowModalDeleteMaterial(false)
            } else {
                alert('Item não encontrado');
            }
        } catch (error) {
            console.error('Erro ao deletar material:', error);
        }
    };

    const cancelarDeleteMaterial = () => {
        setMaterialDelete({})
        setShowModalDeleteMaterial(false)
    }

    if (loading) {
        return <Loading />;
    }
    
    if (!modulo) {
        return <p>Conteúdo não encontrado!</p>;
    }

    const renderConteudo = () => {
        return (
            <div className='divConteudos'>
                {showModalConteudo && <ModalCreateConteudo 
                    title='Novo tópico' 
                    close={closeModalConteudo} 
                    moduloId={moduloId} 
                    updateDocs={() => fetchConteudos(moduloId)}/>
                }
                {showModalDelete && <ModalDeleteItem 
                    confirm={deleteConteudo} 
                    cancel={cancelarDelete} 
                    text='Tem certeza que deseja excluir esse conteúdo?'/>
                }
                {showModalDeleteMaterial && <ModalDeleteItem 
                    confirm={deleteMaterial} 
                    cancel={cancelarDeleteMaterial} 
                    text='Tem certeza que deseja excluir esse material?'/>
                }
                <div className='header'>
                    <h2>Conteúdo</h2>
                    <ButtonBold 
                        title='Novo tópico' 
                        icon={<FaCirclePlus size={24}/>} 
                        action={() => setShowModalConteudo(true)}
                    />
                </div>
                
                <div>
                    {conteudos.length < 1 ? <div><p>Este módulo ainda não tem conteúdos! Adicione um conteúdo!</p></div> : 
                    conteudos.map((c) => {
                        const itensRelacionados = [
                            ...aulas.filter((aula) => aula.conteudoId === c.id && aula.type === 'aula').map(item => ({ ...item, type: 'aula' })),
                            ...aulas.filter((aula) => aula.conteudoId === c.id && aula.type === 'game').map(item => ({ ...item, type: 'game' })),
                            ...provas.filter((prova) => prova.conteudoId === c.id && prova.type === 'prova').map(item => ({ ...item, type: 'prova' })),
                            ...provas.filter((prova) => prova.conteudoId === c.id && prova.type === 'storyTelling').map(item => ({ ...item, type: 'storyTelling' }))
                        ];
    
                        const itensOrdenados = itensRelacionados.sort((a, b) => {
                            return a.createdAt.seconds - b.createdAt.seconds;
                        });
    
                        return (
                            <div key={c.id} className='divConteudo'>
                                <div className='divHeaderConteudo'>
                                    <p style={{ fontSize: 18, fontWeight: 'bold' }}>{c.name}</p>
                                    <ButtonBold title='Novo conteúdo' icon={<FaCirclePlus size={24}/>}/>
                                </div>
                                
                                {itensOrdenados.length > 0 ? (
                                    itensRelacionados.map((item) => (
                                        <div key={item.id} className='divValue'>
                                            <p>{item.name}</p>
                                            <div className='divOptionsValue'>
                                                
                                                {item.name.includes('não configurada') ? <p className='textAlert'>Não configurado</p> : ''}
                                                <div className='divIcon delete' onClick={() => itemDeleteMatrial(item.id, item.type)}>
                                                    <MdDelete size={24}/>
                                                </div>
                                                <div className='divIcon edit' onClick={() => navigate(`/professor/modulos/${moduloId}/${item.type}/${item.id}`)}>
                                                    <MdEdit size={24}/>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Conteúdo vazio! Adicione um material!</p>
                                )}
                                <div className='divBtnDelete'>
                                    <button className='btnDelete' onClick={() => itemDelete(c.id)}>
                                        <p>Excluir conteúdo</p>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                    }
                    
                </div>
            </div>
        );
    };
    
    

    const renderModuloConfig = () => {
        return(
            <div>
                <h2>Configuração</h2>
            </div>
        )
    }

    return(
        <div className='containerModuloDetails'>
            <div className='divHeader'>
                <div className='divIcon' onClick={() => navigate('/professor/modulos')}>
                    <IoMdArrowRoundBack />
                </div>
                <h2 style={{ fontSize: 24 }}>Módulo - {modulo.name}</h2>
            </div>
            
            <div className='divOptions'>
                {optionsHeader.map((o) => (
                    <div key={o.id} className={`divTitle ${optionSelected === o.id && 'active'}`} onClick={() => setOptionSelected(o.id)}>
                        {o.icon}
                        <p>{o.title}</p>
                    </div>
                ))}
            </div>
            <div className='divValues'>
                {optionSelected === 1 ? renderConteudo() : optionSelected === 2 ? renderModuloConfig() : ''}
            </div>
        </div>
    )
}
ModuloDetails.propTypes = {
    userType: PropTypes.number.isRequired,
    moduloId: PropTypes.string.isRequired,
};

export default ModuloDetails