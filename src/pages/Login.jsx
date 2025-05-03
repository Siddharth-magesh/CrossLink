import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/session';
import { url_base } from '../config';

const Login = () => {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${url_base}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registration_number: regNo,
          password: password
        })
      });

      const data = await res.json();

      if (res.ok) {
        loginUser(data.token, data.username);
        navigate('/main');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Server not reachable');
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-dark text-white">
      <form onSubmit={handleLogin} className="w-75">
        <h2 className="mb-4 text-center">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Registration Number</label>
          <input
            type="text"
            className="form-control"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-danger w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;
