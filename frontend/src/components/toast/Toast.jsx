/**
 * Toast Utility Module
 *
 * This file defines reusable toast notification functions using `react-toastify`.
 * It provides custom wrappers for success, warning, error, and info toasts,
 * as well as functionality for dismissing specific toasts and rendering the toast container.
 *
 * Features:
 * - Consistent toast appearance (dark theme, top-center position, 5s auto-close, etc.)
 * - Optional `toastId` support to prevent duplicate toasts
 * - A single `ToastWrapper` component to be rendered once at the root level
 *
 * Usage:
 * - showSuccessToast("Message", "optional-id")
 * - showErrorToast("Error occurred", "unique-id")
 * - clearToast("optional-id")
 * - <ToastWrapper /> in App.js or index.js
 */

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
  transition: Bounce,
};

const withOptionalId = (options, id) =>
  id ? { ...options, toastId: id } : options;

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
export const clearToast = (id) => {
  toast.dismiss(id);
};

// ToastContainer wrapper (used once in root component)
export const ToastWrapper = () => <ToastContainer />;
