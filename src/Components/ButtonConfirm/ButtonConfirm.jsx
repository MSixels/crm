import './ButtonConfirm.css';
import PropTypes from 'prop-types';

function ButtonConfirm({ title, icon, action, disabled }) {
    const executeAction = () => {
        action(true);
    };
    return (
        <div className='containerButtonConfirm'>
            <button onClick={() => executeAction()} disabled={disabled}>
                <span>{title}</span>
                {icon}
            </button>
        </div>
    );
}

ButtonConfirm.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    action: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
};

export default ButtonConfirm;
