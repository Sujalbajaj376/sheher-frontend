// src/components/IssueForm.jsx
import { useState } from "react";
import axios from "axios";

const categories = ["Water", "Infrastructure", "Waste", "Lighting", "Sanitation"];

export default function IssueForm({ userCity }) {
  const [step, setStep] = useState(1);
  const [aadhar, setAadhar] = useState("");
  const [verified, setVerified] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const verifyAadhar = async () => {
    const res = await axios.post("http://localhost:5000/api/verify-city", {
      aadhar,
      city: userCity,
    });
    if (res.data.valid) {
      setVerified(true);
      setStep(2);
    } else {
      alert("You can only report issues in your registered city.");
    }
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setMedia(files);
  };

  const fetchLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("category", category);
    formData.append("description", description);
    formData.append("userId", "testUser123");
    formData.append("city", userCity);
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);
    media.forEach((file) => formData.append("media", file));

    await axios.post("http://localhost:5000/api/issues/report", formData);
    setLoading(false);
    alert("Issue submitted!");
    setStep(1); // Reset form
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-center">Report an Issue</h2>

      {step === 1 && (
        <>
          <input
            type="text"
            maxLength={2}
            placeholder="Enter last 2 digits of Aadhar"
            value={aadhar}
            onChange={(e) => setAadhar(e.target.value)}
            className="input w-full"
          />
          <button onClick={verifyAadhar} className="btn w-full bg-blue-500 text-white">
            Verify Aadhar
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-full">
            <option>Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <textarea
            maxLength={500}
            placeholder="Describe the issue"
            className="input w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input type="file" accept="image/*,video/*" multiple onChange={handleMediaChange} />
          <button onClick={fetchLocation} className="btn bg-green-500 text-white">
            Fetch GPS Location
          </button>
          {location && (
            <p className="text-sm text-gray-500">
              Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          )}
          <button onClick={() => setStep(3)} className="btn w-full bg-blue-600 text-white">
            Next: Review
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <div className="space-y-2">
            <p><strong>Category:</strong> {category}</p>
            <p><strong>Description:</strong> {description}</p>
            <p><strong>Location:</strong> {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}</p>
            <p><strong>Media:</strong> {media.length} files</p>
          </div>
          <button onClick={handleSubmit} className="btn w-full bg-indigo-600 text-white" disabled={loading}>
            {loading ? "Submitting..." : "Submit Issue"}
          </button>
        </>
      )}
    </div>
  );
}
