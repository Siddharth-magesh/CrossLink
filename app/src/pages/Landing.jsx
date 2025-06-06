import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/session';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAdmin()) {
        navigate('/main'); // Admin dashboard
      } else if (isAuthenticated()) {
        navigate('/user-dashboard'); // User dashboard
      } else {
        navigate('/user-login'); // Not logged in
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-dark text-center flex-column">
      <h1 className="mb-4">
        <span style={{ color: 'red' }}>Cross</span>
        <span style={{ color: 'white' }}>Link</span>
      </h1>
      <div className="progress w-50">
        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '100%' }}></div>
      </div>
    </div>
  );
};

export default Landing;
