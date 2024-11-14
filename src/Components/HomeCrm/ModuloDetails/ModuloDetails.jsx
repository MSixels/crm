import { useEffect, useState } from 'react';
import './ModuloDetails.css'
import PropTypes from 'prop-types'
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../../services/firebaseConfig';
import Loading from '../../Loading/Loading';
import { FaBookOpen } from "react-icons/fa";
import { FaGear, FaXmark } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp, IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import ButtonBold from '../../ButtonBold/ButtonBold';
import { FaCirclePlus } from "react-icons/fa6";
import ModalCreateConteudo from '../../ModalCreateConteudo/ModalCreateConteudo';
import ModalDeleteItem from '../../ModalDeleteItem/ModalDeleteItem';
import ModalCreateMaterial from '../../ModalCreateMaterial/ModalCreateMaterial'
import { deleteConteudo, deleteModulo, updateModulo } from '../../../functions/functions';

function ModuloDetails({ moduloId, pagetype }) {
    const navigate = useNavigate()
    const [modulo, setModulo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [conteudos, setConteudos] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [provas, setProvas] = useState([]);
    const [showModalConteudo, setShowModalConteudo] = useState(false)
    const [conteudoDelete, setConteudoDelete] = useState('')
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [showModalDeleteMaterial, setShowModalDeleteMaterial] = useState(false)
    const [materialDelete, setMaterialDelete] = useState({})
    const [showModalCreateMaterial, setShowModalCreateMaterial] = useState(false)
    const [moduloName, setModuloName] = useState('')
    const [moduloDescription, setModuloDescription] = useState('')
    const [professores, setProfessores] = useState([])
    const [searchDrop, setSearchDrop] = useState('Selecione')
    const [liberacao, setLiberacao] = useState('')
    const [validade, setValidade] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [showModalDeleteModulo, setShowModalDeleteModulo] = useState(false)

    const optionsHeader = [
        {id: 1, icon: <FaBookOpen />, title: 'Conteúdo', route: 'conteudo'},
        {id: 2, icon: <FaGear />, title: 'Configurações', route: 'configuracoes'},
    ]

    const fetchModulo = async (moduloId) => {
        try {
            const moduloRef = doc(firestore, 'modulos', moduloId);
            const moduloSnapshot = await getDoc(moduloRef);
            if (moduloSnapshot.exists()) {
                setLoading(false)
                //console.log(moduloSnapshot.data())
                setModulo(moduloSnapshot.data());
                setModuloName(moduloSnapshot.data().name)
                setModuloDescription(moduloSnapshot.data().description)
                //console.log(moduloSnapshot.data().liberacao)
                //console.log(moduloSnapshot.data().validade)
                setLiberacao(moduloSnapshot.data().liberacao)
                setValidade(moduloSnapshot.data().validade)
            } else {
                console.error("Módulo não encontrado!");
            }
        } catch (error) {
            setLoading(false)
            //console.error("Erro ao carregar o módulo:", error);
        }
    };

    const fetchProfessores = async () => {
        try {
            const q = query(
                collection(firestore, 'users'),
                where('type', 'in', [1, 2]) 
            );

            const querySnapshot = await getDocs(q);

            const professoresList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name 
            }));

            setProfessores(professoresList);
        } catch (error) {
            //console.error("Erro ao carregar os professores:", error);
        }
    };

    useEffect(() => {
        fetchProfessores()
    }, [])

    useEffect(() => {
        if (modulo) {
            const professorId = modulo.professorId;
    
            if (professores && professorId) {
                const professorEncontrado = professores.find(prof => prof.id === professorId);
    
                if (professorEncontrado) {
                    setSearchDrop({ id: professorId, name: professorEncontrado.name });
                } else {
                    setSearchDrop('Professor não encontrado');
                }
            } else {
                setSearchDrop('Selecione');
            }
        }
    }, [modulo, professores]);


    const fetchConteudos = async (moduloId) => {
        if (!moduloId) {
            //console.error("moduloId não foi fornecido!");
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
            //console.log(conteudos)
        } catch (error) {
            //console.error("Erro ao carregar conteúdos:", error);
            return [];
        }
    };

    const fetchAulas = async (conteudos) => {
        try {
            const conteudoIds = conteudos.map(conteudo => conteudo.id);
            if (conteudoIds.length === 0) {
                //console.log("Nenhum conteúdo encontrado para buscar aulas.");
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
            //console.log('aulasList: ', aulasList)
            setLoading(false)
        } catch (error) {
            //console.error("Erro ao carregar as aulas:", error);
            setLoading(false)
        }
    };

    const fetchProvas = async (conteudos) => {
        try {
            const conteudoIds = conteudos.map(conteudo => conteudo.id);
            if (conteudoIds.length === 0) {
                //console.log("Nenhum conteúdo encontrado para buscar aulas.");
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
            //console.log('provasList: ', provasList)
        } catch (error) {
            //console.error("Erro ao carregar as aulas:", error);
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

    const handleDeleteConteudo = () => {
        deleteConteudo(conteudoDelete)
        setShowModalDelete(false)
        fetchConteudos(moduloId)
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
                //console.log(`Item da tabela 'aulas' com id ${materialDelete.id} deletado com sucesso.`);
                fetchConteudos(moduloId);
                setShowModalDeleteMaterial(false)
            }
            else if (materialDelete.type === 'prova' || materialDelete.type === 'storyTelling') {
                const provaRef = doc(firestore, 'provas', materialDelete.id);
                await deleteDoc(provaRef);
                //console.log(`Item da tabela 'provas' com id ${materialDelete.id} deletado com sucesso.`);
                fetchConteudos(moduloId);
                setShowModalDeleteMaterial(false)
            } else {
                alert('Item não encontrado');
            }
        } catch (error) {
            //console.error('Erro ao deletar material:', error);
        }
    };

    const cancelarDeleteMaterial = () => {
        setMaterialDelete({})
        setShowModalDeleteMaterial(false)
    }

    const closeModalMaterial = () => {
        setShowModalCreateMaterial(false)
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
                    confirm={handleDeleteConteudo} 
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
                    {conteudos.length < 1 ? <div><p>Este módulo não tem tópicos! Adicione um tópico!</p></div> : 
                        conteudos.map((c) => {
                            const itensRelacionados = [
                                ...aulas.filter((aula) => aula.conteudoId === c.id && aula.type === 'aula').map(item => ({ ...item, type: 'aula' })),
                                ...aulas.filter((aula) => aula.conteudoId === c.id && aula.type === 'game').map(item => ({ ...item, type: 'game' })),
                                ...provas.filter((prova) => prova.conteudoId === c.id && prova.type === 'prova').map(item => ({ ...item, type: 'prova' })),
                                ...provas.filter((prova) => prova.conteudoId === c.id && prova.type === 'storyTelling').map(item => ({ ...item, type: 'storyTelling' }))
                            ];
        
                            const itensOrdenados = itensRelacionados.sort((a, b) => {
                                const order = {
                                    aula: 1,
                                    game: 2,
                                    prova: 3,
                                    storyTelling: 4
                                };
                            
                                if (order[a.type] !== order[b.type]) {
                                    return order[a.type] - order[b.type];
                                }
                            
                                return a.createdAt.seconds - b.createdAt.seconds;
                            });
        
                            return (
                                <div key={c.id} className='divConteudo'>
                                    {showModalCreateMaterial && <ModalCreateMaterial 
                                        title='Novo conteúdo'
                                        close={closeModalMaterial} 
                                        conteudoId={c.id} 
                                        updateDocs={() => fetchConteudos(moduloId)}/>
                                    }
                                    <div className='divHeaderConteudo'>
                                        <p style={{ fontSize: 18, fontWeight: 'bold' }}>{c.name}</p>
                                        <ButtonBold title='Novo conteúdo' icon={<FaCirclePlus size={24}/>} action={() => setShowModalCreateMaterial(true)}/>
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
                                            <p>Excluir tópico</p>
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

        const handleInputChangeName = (event) => {
            setModuloName(event.target.value);
        };

        const handleInputChangeDescription = (event) => {
            setModuloDescription(event.target.value);
        };

        const handleSelectItem = (newDrop) => {
            setSearchDrop(newDrop);
            setIsDropdownOpen(false)
        };

        const handleSearchLiberacao = (e, type) => {
            if (type === 'select') {
                const newSearchTerm = e.target.value;
                setLiberacao(newSearchTerm);
            } else if (type === 'clean') {
                setLiberacao(''); 
            }
        };

        const handleSearchValidade = (e, type) => {
            if (type === 'select') {
                const newSearchTerm = e.target.value;
                setValidade(newSearchTerm);
            } else if (type === 'clean') {
                setValidade(''); 
            }
        };

        const options = professores.map(professor => ({
            id: professor.id,
            name: professor.name
        })); 

        const handleUpdateModulo = () => {
            updateModulo(moduloId, moduloName, moduloDescription, searchDrop.id, liberacao, validade)
        }

        const openModalDelete = () => {
            setShowModalDeleteModulo(true)
        }

        const handleDeleteModulo = () => {
            deleteModulo(moduloId)
            navigate('/professor/modulos')
        }

        return(
            <div className='containerConfig'>
                {showModalDeleteModulo && <ModalDeleteItem confirm={handleDeleteModulo} cancel={() => setShowModalDeleteModulo(false)} text='Tem certeza que deseja excluir esse módulo?'/>}
                <div className='divHeaderConfig'>
                    <h2>Configuração</h2>
                    <button className='btnConfirm' onClick={handleUpdateModulo}>Salvar alterações</button>
                </div>
                <div className='contents'>
                    <p style={{ fontWeight: 500}}>Informações</p>
                    <div className='divInput'>
                        <label htmlFor="name">Nome</label>
                        <input
                            id='name'
                            type="text"
                            value={moduloName}            
                            onChange={handleInputChangeName}
                        />
                    </div>
                    <div 
                        style={{
                            display: 'flex', 
                            flexDirection: 'column', 
                            position: 'relative', 
                            paddingBottom: 12, 
                            marginTop: 16
                        }}>
                        <label htmlFor="coment" 
                        style={{
                            position: 'absolute', 
                            top: -10, 
                            fontSize: 12, 
                            left: 12, 
                            backgroundColor: '#FFF', 
                            paddingInline: 4
                        }}>Descrição</label>
                        <textarea
                            name="coment"
                            id="coment"
                            maxLength="500"
                            style={{ 
                                height: 150, 
                                outline: 'none', 
                                padding: 8, 
                                border: 'solid 1px #ccc', 
                                borderRadius: 4, 
                                maxWidth: '100%', 
                                minWidth: 200, 
                                maxHeight: 200, 
                                minHeight: 100 
                            }}
                            value={moduloDescription}
                            onChange={handleInputChangeDescription}
                        ></textarea>
                        <p style={{marginLeft: 8, fontSize: 12}}>{moduloDescription.length}/500</p>
                    </div>
                    <p style={{ fontWeight: 500, marginBottom: 24}}>Professor vinculado</p>
                    <div className='containerDropDown'>
                        <div className='dropdownInput' onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            <span className='label'>Professor</span>
                            <span>{typeof searchDrop === 'string' ? searchDrop : searchDrop.name}</span>
                            <span>
                                {searchDrop !== 'Selecione' ? (
                                    <span onClick={() => handleSelectItem('Selecione')}><FaXmark /></span>
                                ) : (
                                    isDropdownOpen ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />
                                )}
                            </span>
                        </div>
                        {isDropdownOpen && (
                            <div className='dropdownList'>
                                {options.map((o) => (
                                    <span key={o.id} onClick={() => handleSelectItem(o)} className='optionDrop'>
                                        {o.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <p style={{ fontWeight: 500, marginTop: 24}}>Validade módulo</p>
                    <div style={{ display: 'flex', gap: 24}}>
                        <div className='divInput inputDate'>
                            <label htmlFor="busca">Liberação</label>
                            <input 
                                type="date" 
                                name='busca' 
                                id='busca' 
                                className='input' 
                                value={liberacao}
                                onChange={(e) => handleSearchLiberacao(e, 'select')} 
                            />
                            {liberacao != '' && <span onClick={() => handleSearchLiberacao(null, 'clean')}><FaXmark /></span> }
                        </div>
                        <div className='divInput inputDate'>
                            <label htmlFor="busca">Validade</label>
                            <input 
                                type="date" 
                                name='busca' 
                                id='busca' 
                                className='input' 
                                value={validade}
                                onChange={(e) => handleSearchValidade(e, 'select')} 
                            />
                            {validade != '' && <span onClick={() => handleSearchValidade(null, 'clean')}><FaXmark /></span> }
                        </div>
                    </div>
                </div>
                <div className='divHeaderConfig mt24'>
                    <button className='btnConfirm alert' onClick={openModalDelete}>Excluir módulo</button>
                    <button className='btnConfirm' onClick={handleUpdateModulo}>Salvar alterações</button>
                </div>
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
                    <div key={o.id} className={`divTitle ${pagetype === o.route && 'active'}`} onClick={() => navigate(`/professor/modulos/${moduloId}/${o.route}`)}>
                        {o.icon}
                        <p>{o.title}</p>
                    </div>
                ))}
            </div>
            <div className='divValues'>
                {pagetype === 'conteudo' ? renderConteudo() : pagetype === 'configuracoes' ? renderModuloConfig() : ''}
            </div>
        </div>
    )
}
ModuloDetails.propTypes = {
    userType: PropTypes.number.isRequired,
    moduloId: PropTypes.string.isRequired,
    pagetype: PropTypes.string.isRequired,
};

export default ModuloDetails