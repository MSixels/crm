import { useState } from 'react';
import './ModalCreateMaterial.css'
import PropTypes from 'prop-types'
import { IoClose } from "react-icons/io5";
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';
import ButtonSend from '../ButtonSend/ButtonSend';
import DropDown from '../DropDown/DropDown'

function ModalCreateMaterial({title, close, conteudoId, updateDocs}) {
    const [loading, setLoading] = useState(false)
    const [showErro, setShowErro] = useState(false)
    const [searchDrop, setSearchDrop] = useState('Selecione')

    const salvarConteudo = async (send) => {
        if (send) {
            setLoading(true)
            try {
                if(searchDrop === '' || searchDrop === 'Selecione'){
                    setShowErro(true)
                    setLoading(false)
                    return
                }
                if(searchDrop === 1){
                    await addDoc(collection(firestore, 'aulas'), {
                        conteudoId: conteudoId,  
                        createdAt: new Date(),
                        description: 'Descrição não configurada',
                        name: 'Aula não configurada',
                        type: 'aula',
                        videoUrl: 'url não configurada',
                    });
                } else if(searchDrop === 2){
                    await addDoc(collection(firestore, 'provas'), {
                        conteudoId: conteudoId,  
                        createdAt: new Date(),
                        description: 'Descrição não configurada',
                        name: 'Prova não configurada',
                        quests: [],  
                        type: 'prova',
                    });
                } else if(searchDrop === 3){
                    await addDoc(collection(firestore, 'aulas'), {
                        conteudoId: conteudoId,  
                        createdAt: new Date(),
                        description: 'Descrição não configurada',
                        link: 'Link não configurado',
                        name: 'Gameficação não configurada',
                        type: 'game',
                    });
                } else if(searchDrop === 4){
                    await addDoc(collection(firestore, 'provas'), {
                        conteudoId: conteudoId,  
                        createdAt: new Date(),
                        description: 'Descrição não configurada',
                        name: 'StoryTelling não configurada',
                        pdfUrl: 'Sem arquivo',
                        type: 'storyTelling',
                    });
                } else{
                    setShowErro(true)
                }

                setLoading(false)
                close()
                updateDocs()
            } catch (error) {
                console.error("Erro ao salvar conteudo:", error);
                setLoading(false)
            }
        }
    };

    const options = [
        {id: 1, name: 'Aula'},
        {id: 2, name: 'Prova'},
        {id: 3, name: 'Gameficação'},
        {id: 4, name: 'StoryTelling'},
    ]

    const handleDropChange = (option) => {
        if (option.id) {
            setSearchDrop(option.id); 
        } else {
            setSearchDrop('Selecione');
        }
    };

    return (
        <div className='containerModalCreateMaterial'>
            <div className='modalCreate'>
                <div className='divheader'>
                    <h3>{title}</h3>
                    <div className='divClose'>
                        <IoClose size={25} onClick={() => close(false)}/>
                    </div>
                </div>
                
                <DropDown title='Conteúdo' type='Selecione' options={options} onTurmaChange={handleDropChange}/>
                {showErro && <p style={{color: 'red'}}>Selecione um conteúdo</p>}
                <ButtonSend title={loading ? 'Salvando' : 'Salvar conteúdo'} icon action={() => salvarConteudo(true)} disable={loading}/>
            </div>
        </div>
    )
}

ModalCreateMaterial.propTypes = {
    title: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    conteudoId: PropTypes.string.isRequired,
    updateDocs: PropTypes.func.isRequired,
};

export default ModalCreateMaterial