import { IoClose } from 'react-icons/io5';
import './ModalCreateRastreio.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import ButtonConfirm from '../ButtonConfirm/ButtonConfirm';
import InputSend from '../InputSend/InputSend';
import { useNavigate } from 'react-router-dom';

function ModalCreateRastreio({ title, close }) {
    const [name, setName] = useState('')
    const [optionSelected, setOptionSelected] = useState(null)
    const [btnDisabled, setBtnDisabled] = useState(true)
    const navigate = useNavigate()

    const faixa = [
        {id: 1, title: 'Entre 3 e 6 anos', title_2: ''},
        {id: 2, title: 'Até 8 anos', title_2: '(Em período de alfabetização)'},
        {id: 3, title: 'Acima de 8 anos', title_2: ''},
    ]

    useEffect(() => {
        if (name !== '' && optionSelected != null) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [name, optionSelected]);

    const handleSearchChange = (newSearchTerm) => {
        setName(newSearchTerm);
        console.log(newSearchTerm); 
    };

    const novoRastreio = async (send) => {
        if (send) {
            if(optionSelected === 1){
                navigate(`/aluno/rastreio/novo-rastreio-tipo-1`)
            } else if(optionSelected === 2){
                navigate(`/aluno/rastreio/novo-rastreio-tipo-2`)
            } else if(optionSelected === 3) {
                navigate(`/aluno/rastreio/novo-rastreio-tipo-3`)
            }
        }
    };
    return (
        <div className='containerModalCreateRastreio'>
            <div className='modalCreate'>
                <div className='divheader'>
                    <h3>{title}</h3>
                    <div className='divClose'>
                        <IoClose size={25} onClick={() => close(false)} />
                    </div>
                </div>
                <p>Nome do paciente</p>
                <InputSend 
                    title='Nome' 
                    placeH='' 
                    onSearchChange={handleSearchChange} 
                    type="text" 
                />
                <p>Faixa etária</p>
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
