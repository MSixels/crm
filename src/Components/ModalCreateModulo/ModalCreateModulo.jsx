import { useState } from 'react';
import ButtonBold from '../ButtonBold/ButtonBold';
import InputSend from '../InputSend/InputSend';
import './ModalCreateModulo.css'
import PropTypes from 'prop-types'
import { IoClose } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import DropDown from '../DropDown/DropDown';
import { professores, turmas } from '../../database';
import ButtonSend from '../ButtonSend/ButtonSend';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import InputDate from '../InputDate/InputDate';

function ModalCreateModulo({title, close}) {
    const [searchDrop, setSearchDrop] = useState('Selecione')
    const [searchDropTurma, setSearchDropTurma] = useState('Selecione')

    const handleDropChange = (newDrop) => {
        setSearchDrop(newDrop);
    };

    const handleDropChangeTurma = (newTurma) => {
        setSearchDropTurma(newTurma);
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
                <InputSend title='Nome do módulo' placeH='' />
                <div className='divFooter'>
                    <DropDown title='Turma(s)' type='Selecione' options={turmas} onTurmaChange={handleDropChangeTurma} />
                    <InputDate title='Válido até'/>
                </div>
                <ButtonSend  title='Continuar' icon={<MdOutlineKeyboardArrowRight size={20}/>}/>
            </div>
        </div>
    )
}

ModalCreateModulo.propTypes = {
    title: PropTypes.string.isRequired,
    inputs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
    })).isRequired,
    //onChange: PropTypes.func.isRequired,
    close: PropTypes.string.isRequired
};

export default ModalCreateModulo