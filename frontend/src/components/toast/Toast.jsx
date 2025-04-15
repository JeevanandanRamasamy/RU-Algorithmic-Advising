// src/components/Toast.jsx
// More info on the api here https://fkhadra.github.io/react-toastify/introduction/

import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  transition: Bounce,
};

// Exporting reusable functions
export const showSuccessToast = (msg) => toast.success(msg, toastOptions);
export const showWarningToast = (msg) => toast.warn(msg, toastOptions);
export const showErrorToast = (msg) => toast.error(msg, toastOptions);
export const showInfoToast = (msg) => toast.info(msg, toastOptions);

// Include ToastContainer once in your root app
export const ToastWrapper = () => <ToastContainer />;
