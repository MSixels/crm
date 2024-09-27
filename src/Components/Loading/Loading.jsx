import './Loading.css'
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Loading() {
    return (
        <div className='containerLoading'>
            <div className='loadingIcon'>
                <AiOutlineLoading3Quarters size={40} color='#6732D1'/>
            </div>
        </div>
    )
}

export default Loading