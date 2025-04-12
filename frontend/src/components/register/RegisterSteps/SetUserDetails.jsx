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
    </div>
  );
}
