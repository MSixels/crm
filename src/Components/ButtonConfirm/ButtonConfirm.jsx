import './ButtonConfirm.css';
import PropTypes from 'prop-types';

function ButtonConfirm({ title, icon, action, disabled, type }) {
    const executeAction = () => {
        action(true);
    };

    const buttonClass = type === 'play' ? 'buttonPlay' : '';

    return (
        <div className='containerButtonConfirm'>
            <button
                onClick={executeAction}
                disabled={disabled}
                className={buttonClass}
            >
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
    type: PropTypes.string,
};

export default ButtonConfirm;
