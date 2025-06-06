import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { url_base } from "../config";

const StudentUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${url_base}/api/upload_members_data`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Members added successfully!");
        setFile(null);
      } else {
        setError(data.error || "Failed to add students.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="vh-100 bg-dark text-white p-3 d-flex flex-column">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4
          className="text-danger fw-bold mb-0"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Cross<span className="text-white">Link</span>
        </h4>
        <span className="fw-semibold">
          {localStorage.getItem("username") || "User"}
        </span>
      </div>
      <h5 className="text-white mb-4 text-center">Student Management</h5>
      <div
        className="bg-secondary p-4 rounded mx-auto"
        style={{ maxWidth: 500 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Upload Student CSV</label>
            <input
              type="file"
              className="form-control"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="btn btn-danger w-100">
            Upload
          </button>
        </form>
        {/* <div className="mt-3">
          <a
            href="/sample_data/student_data.json"
            download
            className="btn btn-outline-light btn-sm me-2"
          >
            Download Sample JSON
          </a>
          <a
            href="/sample_data/sample_students.csv"
            download
            className="btn btn-outline-light btn-sm"
          >
            Download Sample CSV
          </a>
        </div> */}
        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default StudentUpload;
