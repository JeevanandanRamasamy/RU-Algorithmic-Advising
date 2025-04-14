// src/components/Toast.jsx
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Function to clear toast by ID
export const clearToast = id => {
	toast.dismiss(id);
};

// Exporting reusable functions with id parameter
export const showSuccessToast = (message, id) => {
	toast.success(message, {
		position: "top-center",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: false,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "dark",
		transition: Bounce,
		toastId: id // Adding id to the toast
	});
};

export const showWarningToast = (message, id) => {
	toast.warn(message, {
		position: "top-center",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: false,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "dark",
		transition: Bounce,
		toastId: id // Adding id to the toast
	});
};

export const showErrorToast = (message, id) => {
	toast.error(message, {
		position: "top-center",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: false,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "dark",
		transition: Bounce,
		toastId: id // Adding id to the toast
	});
};

export const showInfoToast = (message, id) => {
	toast.info(message, {
		position: "top-center",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: false,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "dark",
		transition: Bounce,
		toastId: id // Adding id to the toast
	});
};

// Include ToastContainer once in your root app
export const ToastWrapper = () => <ToastContainer />;
