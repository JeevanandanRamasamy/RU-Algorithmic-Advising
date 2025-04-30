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
