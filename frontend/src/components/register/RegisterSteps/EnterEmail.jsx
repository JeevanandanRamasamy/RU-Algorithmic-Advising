/**
 * EnterEmail Component
 *
 * This component represents the first step in a multi-step registration process,
 * where the user is prompted to enter their NetID (used as a username).
 *
 * Props:
 * - username (string): The current value of the username input field.
 * - setUsername (function): A function to update the username state as the user types.
 * - onNext (function): A callback function triggered when the user clicks "Send Code" to proceed.
 * - loading (boolean): A flag indicating whether a request (e.g., sending a verification code) is in progress.
 *
 * The component includes:
 * - A heading indicating the step.
 * - A text input for the user's NetID.
 * - A button that triggers the `onNext` function and shows a loading state if needed.
 */

export default function EnterEmail({ username, setUsername, onNext, loading }) {
  return (
    <div>
      <h3 className="mb-2">Step 1: Enter NetID</h3>
      <form submit={onNext}>
        <input
          className="border p-2 rounded w-full"
          type="text"
          placeholder="e.g., abc123"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Button to proceed to the next step, calls onNext function */}
        <button
          className="mt-3 bg-blue-600 text-white px-4 py-2 font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 "
          onClick={onNext}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Code"}
        </button>
      </form>
    </div>
  );
}
