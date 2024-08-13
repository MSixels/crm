import './HeadLine.css'
import { FaPlay } from "react-icons/fa";

function HeadLine() {
    
    return (
        <div className='containerHeadLine'>
            <h1>Olá, Vinícius!</h1>
            <button>Continuar de onde parou <FaPlay /></button>
        </div>
    )
}

export default HeadLine