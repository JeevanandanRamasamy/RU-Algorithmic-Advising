import {
  showSuccessToast,
  showWarningToast,
  showErrorToast,
  showInfoToast,
} from "../components/toast/Toast";

function ToastDemo() {
  return (
    <>
      <div>
        <h1>React Toast Demo</h1>
        <button onClick={() => showSuccessToast("This is a success message!")}>
          Success
        </button>
        <button onClick={() => showWarningToast("This is a warning!")}>
          Warning
        </button>
        <button onClick={() => showErrorToast("This is an error!")}>
          Error
        </button>
        <button onClick={() => showInfoToast("This is an info!")}>Info</button>
      </div>
    </>
  );
}

export default ToastDemo;
