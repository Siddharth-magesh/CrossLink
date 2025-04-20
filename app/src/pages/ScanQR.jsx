import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const ScanQR = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: 250 },
      false
    );

    const startScanner = () => {
      scanner.render(
        async (decodedText, decodedResult) => {
          try {
            await scanner.clear();
            navigate('/scan-result', { state: { token: decodedText } });
          } catch (err) {
            console.error('Error clearing scanner:', err);
          }
        },
        (err) => {
          console.warn('QR Scan Error:', err);
        }
      );
    };

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(() => {
        startScanner();
      })
      .catch((err) => {
        console.error('Camera permission denied:', err);
        alert('Please allow camera access to scan QR codes.');
      });

    return () => {
      scanner.clear().catch((err) => {
        console.error('Clear on unmount failed:', err);
      });
    };
  }, [navigate]);

  return (
    <div className="vh-100 bg-dark text-white d-flex flex-column p-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5
          className="text-danger fw-bold mb-0"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Cross<span className="text-white">Link</span>
        </h5>
        <span>{localStorage.getItem('username') || 'User'}</span>
      </div>

      <h4 className="text-center text-white mb-3">Scan QR Code</h4>

      {/* QR Reader Container */}
      <div id="qr-reader" style={{ width: '100%' }}></div>

      <button
        className="btn btn-outline-light mt-4 w-100"
        onClick={() => navigate('/manage-event')}
      >
        Cancel
      </button>

      {/* Manual Attendance Button */}
      <button
        className="btn btn-warning position-fixed bottom-0 end-0 mb-4 me-4"
        style={{
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '18px',
        }}
        onClick={() => navigate('/manual-attendance')}
      >
        <span className="text-white">📋</span>
      </button>
    </div>
  );
};

export default ScanQR;
