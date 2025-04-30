/**
 * SetUserDetails Component
 *
 * This component represents the final step of the user registration process,
 * where the user provides their personal details and sets a password.
 *
 * Props:
 * - username (string): The user's NetID, displayed as a disabled input (not editable).
 * - password (string): The current value of the password input.
 * - confirmPassword (string): The current value of the confirm password input.
 * - setPassword (function): Function to update the password state.
 * - setConfirmPassword (function): Function to update the confirm password state.
 * - firstName (string): The user's first name.
 * - setFirstName (function): Function to update the first name state.
 * - lastName (string): The user's last name.
 * - setLastName (function): Function to update the last name state.
 * - onRegister (function): Callback function triggered when the user clicks "Register".
 * - loading (boolean): A flag indicating whether the registration is in progress.
 *
 * The component includes:
 * - A disabled field displaying the NetID.
 * - Input fields for first name, last name, password, and confirm password.
 * - A button that triggers registration and shows a loading state if applicable.
 * */

export default function SetUserDetails({
  username,
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  onRegister,
  loading,
}) {
  return (
    <div>
      <h3 className="mb-2">Step 3: Complete Your Details</h3>
      <form submit={onRegister}>
        <input
          className="border p-2 rounded w-full mb-2"
          type="text"
          value={username}
          disabled
        />

        <input
          className="border p-2 rounded w-full mb-2"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full mb-2"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full mb-2"
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full mb-2"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="bg-green-600 text-white px-4 py-2 rounded mt-2"
          onClick={onRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
