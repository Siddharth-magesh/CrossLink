import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/session";

const ScanQR = () => {
  const navigate = useNavigate();
  const [scannerKey, setScannerKey] = useState(Date.now());
  const hasScanned = useRef(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "User");
  }, []);

  useEffect(() => {
    hasScanned.current = false;
    const qrReader = document.getElementById("qr-reader");
    if (qrReader) qrReader.innerHTML = "";

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        if (hasScanned.current) return;
        hasScanned.current = true;
        await scanner.clear();
        // Clean up UI and video
        const qrReader = document.getElementById("qr-reader");
        if (qrReader) qrReader.innerHTML = "";
        const videos = document.querySelectorAll("video");
        videos.forEach((video) => {
          if (video.srcObject) {
            video.srcObject.getTracks().forEach((track) => track.stop());
            video.srcObject = null;
          }
        });
        // Delay navigation to ensure cleanup and force remount on next scan
        setTimeout(() => {
          setScannerKey(Date.now());
          navigate("/scan-result", { state: { token: decodedText } });
        }, 200);
      },
      (err) => {}
    );

    return () => {
      scanner.clear().catch(() => {});
      const qrReader = document.getElementById("qr-reader");
      if (qrReader) qrReader.innerHTML = "";
      const videos = document.querySelectorAll("video");
      videos.forEach((video) => {
        if (video.srcObject) {
          video.srcObject.getTracks().forEach((track) => track.stop());
          video.srcObject = null;
        }
      });
    };
    // eslint-disable-next-line
  }, [scannerKey, navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="vh-100 bg-dark text-white d-flex flex-column p-3">
      {/* Top Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4
          className="text-danger fw-bold mb-0"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Cross<span className="text-white">Link</span>
        </h4>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {username}
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="dropdownMenuButton"
          >
            <li>
              <span className="dropdown-item text-muted">Profile</span>
            </li>
            <li>
              <button
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div id="qr-reader" key={scannerKey} style={{ width: "100%" }}></div>
    </div>
  );
};

export default ScanQR;
