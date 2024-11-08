import { useState } from 'react';
import InputSend from '../InputSend/InputSend';
import './ModalCreateConteudo.css'
import PropTypes from 'prop-types'
import { IoClose } from "react-icons/io5";
import InputDate from '../InputDate/InputDate';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';
import ButtonSend from '../ButtonSend/ButtonSend';

function ModalCreateConteudo({title, close, moduloId, updateDocs}) {
    const [name, setName] = useState('');
    const [liberacao, setLiberacao] = useState('')
    const [loading, setLoading] = useState(false)
    const [showErro, setShowErro] = useState(false)


    const getName = (newName) => {
        setName(newName);
    };

    const salvarConteudo = async (send) => {
        if (send) {
            setLoading(true)
            try {
                if(name === '' || liberacao === ''){
                    setShowErro(true)
                    setLoading(false)
                    return
                }
                const conteudoRef = await addDoc(collection(firestore, 'conteudo'), {
                    name: name,
                    moduloId: moduloId,
                    openDate: liberacao,
                    createdAt: new Date(),
                });
                await addDoc(collection(firestore, 'aulas'), {
                    conteudoId: conteudoRef.id,  
                    createdAt: new Date(),
                    description: 'Descrição não configurada',
                    name: 'Aula não configurada',
                    type: 'aula',
                    videoUrl: 'url não configurada',
                });
                await addDoc(collection(firestore, 'provas'), {
                    conteudoId: conteudoRef.id,  
                    createdAt: new Date(),
                    description: 'Descrição não configurada',
                    name: 'Prova não configurada',
                    quests: [],  
                    type: 'prova',
                });
                await addDoc(collection(firestore, 'aulas'), {
                    conteudoId: conteudoRef.id,  
                    createdAt: new Date(),
                    description: 'Descrição não configurada',
                    link: 'Link não configurado',
                    name: 'Gameficação não configurada',
                    type: 'game',
                });
                await addDoc(collection(firestore, 'provas'), {
                    conteudoId: conteudoRef.id,  
                    createdAt: new Date(),
                    description: 'Descrição não configurada',
                    name: 'StoryTelling não configurada',
                    pdfUrl: 'Sem arquivo',
                    type: 'storyTelling',
                });
                setLoading(false)
                close()
                updateDocs()
            } catch (error) {
                console.error("Erro ao salvar conteudo:", error);
                setLoading(false)
            }
        }
    };

    return (
        <div className='containerModalCreateConteudo'>
            <div className='modalCreate'>
                <div className='divheader'>
                    <h3>{title}</h3>
                    <div className='divClose'>
                        <IoClose size={25} onClick={() => close(false)}/>
                    </div>
                </div>
                <InputSend title='Nome do tópico' placeH='' onSearchChange={getName} type='text' />
                <div className='divFooter'>
                    <InputDate title='Liberação em' onSearchChange={setLiberacao}/>
                </div>
                {showErro && <p style={{color: 'red'}}>Preencha os campos de Nome do conteúdo e liberação</p>}
                <ButtonSend title={loading ? 'Salvando' : 'Salvar conteúdo'} icon action={() => salvarConteudo(true)} disable={loading}/>
            </div>
        </div>
    )
}

ModalCreateConteudo.propTypes = {
    title: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    moduloId: PropTypes.string.isRequired,
    updateDocs: PropTypes.func.isRequired,
};

export default ModalCreateConteudo