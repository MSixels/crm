import { useParams, useNavigate } from 'react-router-dom';

function VideoAula() {
    const { moduloId, contentId } = useParams();
    const navigate = useNavigate();

    const videoInfo = {
        title: "Título da Aula",
        youtubeUrl: "https://www.youtube.com/embed/EXEMPLO_VIDEO_ID",
        description: "Descrição do vídeo.",
        nextContentId: "2"
    };

    const handleNextContent = () => {
        navigate(`/aluno/modulo/${moduloId}/aula/${videoInfo.nextContentId}`);
    };

    return (
        <div>
            <h2>{videoInfo.title}</h2>
            <iframe 
                width="560" 
                height="315" 
                src={videoInfo.youtubeUrl} 
                title={videoInfo.title} 
                frameBorder="0" 
                allowFullScreen>
            </iframe>
            <div>{videoInfo.description}</div>
            <button onClick={handleNextContent}>Próximo Conteúdo</button>
        </div>
    );
}

export default VideoAula;
