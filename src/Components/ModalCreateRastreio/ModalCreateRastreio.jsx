import { IoClose } from 'react-icons/io5';
import './ModalCreateRastreio.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import ButtonConfirm from '../ButtonConfirm/ButtonConfirm';
import InputSend from '../InputSend/InputSend';
import { useNavigate } from 'react-router-dom';

function ModalCreateRastreio({ title, close }) {
    const [name, setName] = useState('')
    const [escola, setEscola] = useState('')
    const [optionSelected, setOptionSelected] = useState(null)
    const [btnDisabled, setBtnDisabled] = useState(true)
    const navigate = useNavigate()

    const faixa = [
        {id: 1, title: 'Entre 3 e 6 anos', title_2: ''},
        {id: 2, title: 'Até 8 anos', title_2: '(Em período de alfabetização)'},
        {id: 3, title: 'Acima de 8 anos', title_2: ''},
    ]

    useEffect(() => {
        if (name !== '' && optionSelected != null && escola !== '') {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [name, optionSelected, escola]);

    const handleSearchChange = (newSearchTerm) => {
        setName(newSearchTerm);
        console.log(newSearchTerm); 
    };

    const handleSearchEscola = (newNameEscola) => {
        setEscola(newNameEscola)
    }

    const novoRastreio = async (send) => {
        if (send) {
            if(optionSelected === 1){
                navigate(`/aluno/rastreio/novo-rastreio-tipo-1?patient=${name}&school=${escola}`)
            } else if(optionSelected === 2){
                navigate(`/aluno/rastreio/novo-rastreio-tipo-2?patient=${name}&school=${escola}`)
            } else if(optionSelected === 3) {
                navigate(`/aluno/rastreio/novo-rastreio-tipo-3?patient=${name}&school=${escola}`)
            }
        }
    };
    return (
        <div className='containerModalCreateRastreio'>
            <div className='modalCreate'>
                <div className='divheader'>
                    <h3 style={{fontSize: 20}}>{title}</h3>
                    <div className='divClose'>
                        <IoClose size={25} onClick={() => close(false)} />
                    </div>
                </div>
                <p style={{fontSize: 16}}>Nome do paciente</p>
                <InputSend 
                    title='Nome completo' 
                    placeH='' 
                    onSearchChange={handleSearchChange} 
                    type="text" 
                />
                <InputSend 
                    title='Nome da escola' 
                    placeH='' 
                    onSearchChange={handleSearchEscola} 
                    type="text" 
                />
                <p style={{fontSize: 16}}>Faixa etária</p>
                <div className='divOptionsFaixas'>
                    {faixa.map((f) => (
                        <div key={f.id} className={`divFaixa ${optionSelected === f.id ? 'active' : ''}`} onClick={() => setOptionSelected(f.id)}>
                            <div className='divIcon'>
                                <div className='circle'>
                                    <div className={`${optionSelected === f.id ? 'ball' : ''}`}></div>
                                </div>
                            </div>
                            <p className='title'>{f.title}</p>
                            <p className='title'>{f.title_2}</p>
                        </div>
                    ))}
                </div>
                <ButtonConfirm title='Confirmar' action={novoRastreio} disabled={btnDisabled}/>
            </div>
        </div>
    );
}

ModalCreateRastreio.propTypes = {
    title: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
};

export default ModalCreateRastreio;
