import './ButtonSend.css'
import PropTypes from 'prop-types'

function ButtonSend({title, icon, action}) {
    const executeAction = () => {
        action(true)
    }
    return (
        <div className='containerButtonSend'>
            <button onClick={() => executeAction()}>
                <span>{title}</span>
                {icon}
            </button>
        </div>
    )
}
ButtonSend.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
};

export default ButtonSend