// AadharVerification.jsx
import { useState } from "react";
import axios from "axios";

export default function AadharVerification({ selectedCity, onVerified }) {
  const [aadharDigits, setAadharDigits] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    try {
      const res = await axios.post("/api/verify-city", {
        aadhar: aadharDigits,
        city: selectedCity,
      });
      if (res.data.valid) {
        onVerified(true);
      } else {
        setError("You can only report issues in your registered city.");
        onVerified(false);
      }
    } catch (err) {
      setError("Verification failed.");
    }
  };

  return (
    <div className="space-y-2">
      <input
        maxLength={2}
        placeholder="Last 2 digits of Aadhar"
        value={aadharDigits}
        onChange={(e) => setAadharDigits(e.target.value)}
        className="input"
      />
      <button onClick={handleVerify} className="btn">
        Verify
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
