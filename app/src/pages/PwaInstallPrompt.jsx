import { useEffect, useState } from 'react';

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setShowPrompt(false));
    }
  };

  if (!showPrompt) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 20, left: 0, right: 0, zIndex: 9999,
      display: 'flex', justifyContent: 'center'
    }}>
      <div className="bg-dark text-white p-3 rounded shadow d-flex align-items-center gap-3">
        <span>Install CrossLink for a better experience!</span>
        <button className="btn btn-danger" onClick={handleInstall}>Install</button>
        <button className="btn btn-secondary" onClick={() => setShowPrompt(false)}>Dismiss</button>
      </div>
    </div>
  );
};

export default PwaInstallPrompt;