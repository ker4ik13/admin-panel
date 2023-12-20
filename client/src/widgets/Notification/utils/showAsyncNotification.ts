import { toast, ToastOptions, type ToastPromiseParams } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import s from '../Notification.module.scss';

export const showAsyncNotification = (callback: Promise<unknown>, params: ToastPromiseParams, options?: ToastOptions) => {
  toast.promise(callback, {
    pending: {
      className: s.notification,
      position: 'bottom-right',
      theme: options?.theme,
      render() {
        return 'Ожидание...';
      },
    },
    error: {
      className: s.notification,
      position: 'bottom-right',
      autoClose: options?.autoClose,
      theme: options?.theme,
      render(props) {
        return "fuck";
      },
    },
    
    success: {
      className: s.notification,
      position: 'bottom-right',
      autoClose: options?.autoClose,
      theme: options?.theme,
      render() {
        return 'fuck';
      },
    },
  })
};