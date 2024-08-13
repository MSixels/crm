import './Aulas.css'
import PropTypes from 'prop-types'
import { FaPlay } from "react-icons/fa";

function Aulas({modulo}) {
    return (
        <div className='containerAulas'>
            {modulo && (
                <div className='divContent'>
                    <div className='divHeadLine'>
                        <div className='textHeadLine'>
                            <h2>{modulo.name}</h2>
                            <span>{modulo.description}</span>
                        </div>
                        <button>Continuar de onde parou <FaPlay /></button>
                    </div>
                    
                </div>
            )}
        </div>
    )
}
Aulas.propTypes = {
    modulo: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        prof: PropTypes.string.isRequired,
        timesEnd: PropTypes.string.isRequired,
        aulasTotal: PropTypes.number.isRequired,
        aulasFeitas: PropTypes.number.isRequired,
        provasTotal: PropTypes.number.isRequired,
        provasFeitas: PropTypes.number.isRequired,
        workCampoTotal: PropTypes.number.isRequired,
        workCampoFeitas: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
    })
};

export default Aulas