import './ModalDeleteItem.css'
import PropTypes from 'prop-types'

function ModalDeleteItem({ confirm, cancel, text}) {
    return(
        <div className='containerModalDeleteItem'>
            <div className='modalConfirmDelete'>
                <p className='titleAlert'>{text}</p>
                <div className='divBtns'>
                    <button onClick={confirm} className='delete'>Confirmar</button>
                    <button onClick={cancel} className='close'>Cancelar</button>
                </div>
            </div>
        </div>
    )
}
ModalDeleteItem.propTypes = {
    confirm: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
};

export default ModalDeleteItem