// src/components/Toast.jsx
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultToastOptions = {
	position: "top-center",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: false,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: "dark",
	transition: Bounce
};

const withOptionalId = (options, id) => (id ? { ...options, toastId: id } : options);

// Reusable toast functions with optional id
export const showSuccessToast = (message, id) =>
	toast.success(message, withOptionalId(defaultToastOptions, id));

export const showWarningToast = (message, id) =>
	toast.warn(message, withOptionalId(defaultToastOptions, id));

export const showErrorToast = (message, id) =>
	toast.error(message, withOptionalId(defaultToastOptions, id));

export const showInfoToast = (message, id) =>
	toast.info(message, withOptionalId(defaultToastOptions, id));

// Function to clear toast by ID
export const clearToast = id => {
	toast.dismiss(id);
};

// ToastContainer wrapper (used once in root component)
export const ToastWrapper = () => <ToastContainer />;
