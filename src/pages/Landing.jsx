import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/session';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAuthenticated()) {
        navigate('/main');
      } else {
        navigate('/login');
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
