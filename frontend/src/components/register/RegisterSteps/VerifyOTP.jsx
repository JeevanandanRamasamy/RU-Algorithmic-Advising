/**
 * VerifyOTP Component
 *
 * This component represents Step 2 in a multi-step registration process,
 * where the user must enter a One-Time Password (OTP) that was sent to their Rutgers email.
 *
 * Props:
 * - username (string): The NetID of the user, used to indicate which email received the code.
 * - code (string): The current value of the entered OTP.
 * - setCode (function): Function to update the OTP value as the user types.
 * - onNext (function): Callback triggered when the user clicks the "Next" button.
 * - onBack (function): Callback triggered when the user clicks the "Back" button.
 * - onResend (function): Callback triggered when the user clicks "Resend Code".
 * - resendTimer (number): Countdown in seconds until the "Resend Code" button is re-enabled.
 *
 * The component includes:
 * - A message informing the user where the code was sent.
 * - An input field for entering the 6-digit OTP.
 * - A "Back" button to return to the previous step.
 * - A "Resend Code" button that is disabled during the cooldown timer.
 * - A "Next" button that proceeds to the next step only when a code is entered.
 *
 */

export default function VerifyOTP({
  username,
  code,
  setCode,
  onNext,
  onBack,
  onResend,
  resendTimer,
}) {
  return (
    <div>
      <h3 className="mb-2">Step 2: Enter Verification Code</h3>
      <p className="mb-2">
        A verification code has been sent to your Rutgers email linked to NetID:{" "}
        <strong>{username}</strong>
      </p>

      <input
        className="border p-2 rounded w-full mb-2"
        type="text"
        placeholder="Enter 6-digit code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={onBack}
        >
          Back
        </button>

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${
              resendTimer > 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-yellow-500 text-white"
            }`}
            onClick={onResend}
            disabled={resendTimer > 0}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={onNext}
            disabled={!code}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
