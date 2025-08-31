import { toast } from "react-toastify";
import ToastConfirmBox from "./ToastConfirmBox";

export function confirmToast({ message, onConfirm, confirmText, cancelText }) {
    toast.info(({ closeToast }) => (
        <ToastConfirmBox
            message={message}
            onConfirm={onConfirm}
            closeToast={closeToast}
            confirmText={confirmText}
            cancelText={cancelText}
        />
    ), {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
    });
}