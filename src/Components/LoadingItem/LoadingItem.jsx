import './LoadingItem.css'
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function LoadingItem() {
    return (
        <div className='containerLoadingItem'>
            <div className='loadingIcon'>
                <AiOutlineLoading3Quarters size={40} color='#6732D1'/>
            </div>
        </div>
    )
}

export default LoadingItem