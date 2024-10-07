import './ButtonBold.css'
import PropTypes from 'prop-types'

function ButtonBold({title, icon, action}) {
    const executeAction = () => {
        action(true)
    }
    return (
        <div className='containerButtonBold'>
            <button onClick={() => executeAction()}>
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
};

export default ButtonBold