import './ButtonBold.css'
import PropTypes from 'prop-types'

function ButtonBold({title, icon, action, disabled}) {
    const executeAction = () => {
        action(true)
    }
    return (
        <div className='containerButtonBold'>
            <button onClick={() => executeAction()} disabled={disabled}>
                <span>{title}</span>
                {icon}
            </button>
        </div>
    )
}
ButtonBold.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    action: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

export default ButtonBold