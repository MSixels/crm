import './ButtonBold.css'
import PropTypes from 'prop-types'

function ButtonBold({title, icon, route}) {
    return (
        <div className='containerButtonBold'>
            <button>
                <span>{title}</span>
                {icon}
            </button>
        </div>
    )
}
ButtonBold.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    route: PropTypes.string.isRequired,
};

export default ButtonBold