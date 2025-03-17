import './ToastContainer.css'
import { useToast } from "../../Contexts/ToastContext";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === "success" ? (
              <FaCheckCircle className="icon-success" />
            ) : (
              <FaTimesCircle className="icon-error" />
            )}
          </div>

          <div className="toast-message">
            <div className="toast-message-title">
              <h3>{toast.title}</h3>
            </div>
            <div className="toast-message-infos">
              {toast.infos.map((message, index) => (
                <p key={index}>{message}</p>
              ))}
            </div>
            <div>
              <p>{toast.footer}</p>
            </div>
          </div>

          <div className="toast-close" onClick={() => removeToast(toast.id)}>
            <FaTimes />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;