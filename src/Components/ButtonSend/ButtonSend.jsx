import './ButtonSend.css'
import PropTypes from 'prop-types'

function ButtonSend({title, icon, action, disabled = false}) {  
    const executeAction = () => {
        action(true)
    }
    return (
        <div className='containerButtonSend'>
            <button onClick={() => executeAction()} disabled={disabled}>
                <span>{title}</span>
                {icon}
            </button>
        </div>
    )
}

ButtonSend.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    action: PropTypes.func.isRequired,
    disabled: PropTypes.bool,  
};

export default ButtonSend;