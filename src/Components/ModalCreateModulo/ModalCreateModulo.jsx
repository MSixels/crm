import { useEffect, useState } from 'react';
import ButtonBold from '../ButtonBold/ButtonBold';
import InputSend from '../InputSend/InputSend';
import './ModalCreateModulo.css'
import PropTypes from 'prop-types'
import { IoClose } from "react-icons/io5";
import DropDown from '../DropDown/DropDown';
import InputDate from '../InputDate/InputDate';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';
import ButtonSend from '../ButtonSend/ButtonSend';

function ModalCreateModulo({title, close}) {
    const [professores, setProfessores] = useState([])
    const [searchDrop, setSearchDrop] = useState('Selecione')
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [liberacao, setLiberacao] = useState('')
    const [validade, setValidade] = useState('')
    const [loading, setLoading] = useState(false)

    const handleDropChange = (newDrop) => {
        setSearchDrop(newDrop);
    };

    const getName = (newName) => {
        setName(newName);
    };
    const getDescription = (newDesc) => {
        setDescription(newDesc);
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
            console.error("Erro ao carregar os professores:", error);
        }
    };

    useEffect(() => {
        fetchProfessores()
    }, [])

    useEffect(() => {
        console.log(searchDrop.id)
    }, [searchDrop])

    const salvarModulo = async (send) => {
        if (send) {
            setLoading(true)
            try {
                if(name === '' || description === '' || searchDrop.id === '' || validade === '' || liberacao === ''){
                    alert('Preencha os campos de Modulo')
                    return
                }
                await addDoc(collection(firestore, 'modulos'), {
                    name: name,
                    description: description,
                    professorId: searchDrop.id,
                    liberacao: liberacao,
                    validade: validade,
                    createdAt: new Date(),
                });
                alert("Módulo salvo com sucesso!");
                setLoading(false)
                close()                
            } catch (error) {
                console.error("Erro ao salvar módulo:", error);
                setLoading(false)
            }
        }
    };

    return (
        <div className='containerModalCreateModulo'>
            <div className='modalCreate'>
                <div className='divheader'>
                    <h3>{title}</h3>
                    <div className='divClose'>
                        <IoClose size={25} onClick={() => close(false)}/>
                    </div>
                </div>
                <DropDown title='Professor' type='Selecione' options={professores} onTurmaChange={handleDropChange} />
                <InputSend title='Nome do módulo' placeH='' onSearchChange={getName} type='text' />
                <InputSend title='Descrição' placeH='' onSearchChange={getDescription} type='text' />
                <div className='divFooter'>
                    <InputDate title='Liberação em' onSearchChange={setLiberacao}/>
                    <InputDate title='Válido até' onSearchChange={setValidade}/>
                </div>
                <ButtonSend title={loading ? 'Salvando' : 'Salvar Módulo'} icon action={() => salvarModulo(true)} disabled={loading}/>
            </div>
        </div>
    )
}

ModalCreateModulo.propTypes = {
    title: PropTypes.string.isRequired,
    close: PropTypes.string.isRequired
};

export default ModalCreateModulo